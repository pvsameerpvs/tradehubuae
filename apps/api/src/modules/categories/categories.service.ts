import { Injectable, NotFoundException, ConflictException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { categories, productCategories } from "@tradehubuae/database";
import { eq, and, like, or, count, isNull, asc, desc, sql } from "drizzle-orm";
import type { CreateCategoryDto } from "./dto/create-category.dto";
import type { UpdateCategoryDto } from "./dto/update-category.dto";
import type { QueryCategoryDto } from "./dto/query-category.dto";
import slugify from "slugify";

const categorySortColumns: Record<string, any> = {
  sortOrder: categories.sortOrder,
  name: categories.name,
  createdAt: categories.createdAt,
};

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: QueryCategoryDto) {
    const { page = 1, limit = 50, sort = "sortOrder", order = "asc", q, isActive } = query;

    const conditions: (typeof sql.arguments[number] | undefined)[] = [];
    if (q) {
      conditions.push(
        or(
          like(categories.name, `%${q}%`),
          like(categories.description, `%${q}%`),
        ),
      );
    }
    if (isActive !== undefined) conditions.push(eq(categories.isActive, isActive));

    const where = conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined;

    const data = await this.drizzle.db.query.categories.findMany({
      where,
      with: {
        parent: { columns: { id: true, name: true, slug: true } },
        children: true,
      },
      orderBy: order === "desc" ? desc(categorySortColumns[sort] ?? categories.sortOrder) : asc(categorySortColumns[sort] ?? categories.sortOrder),
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(categories)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    const enriched = await Promise.all(
      data.map(async (cat) => {
        const [productCount] = await this.drizzle.db
          .select({ total: count() })
          .from(productCategories)
          .where(eq(productCategories.categoryId, cat.id));
        return { ...cat, _count: { children: cat.children?.length ?? 0, products: Number(productCount?.total ?? 0) }, children: undefined };
      }),
    );

    return {
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total, hasPreviousPage: page > 1 },
    };
  }

  async getTree() {
    const tree = await this.drizzle.db.query.categories.findMany({
      where: and(isNull(categories.parentId), eq(categories.isActive, true)),
      with: {
        children: {
          where: eq(categories.isActive, true),
          with: {
            children: {
              where: eq(categories.isActive, true),
              with: { children: { where: eq(categories.isActive, true) } },
            },
          },
          orderBy: [asc(categories.sortOrder)],
        },
      },
      orderBy: [asc(categories.sortOrder)],
    });

    return tree;
  }

  async findById(id: string) {
    const [category] = await this.drizzle.db.query.categories.findMany({
      where: eq(categories.id, id),
      with: {
        parent: { columns: { id: true, name: true, slug: true } },
        children: { orderBy: [asc(categories.sortOrder)] },
      },
    });

    if (!category) throw new NotFoundException("Category not found");

    const [productCount] = await this.drizzle.db
      .select({ total: count() })
      .from(productCategories)
      .where(eq(productCategories.categoryId, id));

    return { ...category, _count: { products: Number(productCount?.total ?? 0) } };
  }

  async create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });

    const [existing] = await this.drizzle.db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    if (dto.parentId) {
      const [parent] = await this.drizzle.db
        .select()
        .from(categories)
        .where(eq(categories.id, dto.parentId))
        .limit(1);

      if (!parent) throw new NotFoundException("Parent category not found");
    }

    const [category] = await this.drizzle.db
      .insert(categories)
      .values({
        name: dto.name,
        slug: finalSlug,
        description: dto.description,
        image: dto.image,
        parentId: dto.parentId,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,

      })
      .returning();

    this.logger.log(`Category created: ${category!.name}`);
    return category!;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.findById(id);

    if (dto.parentId && dto.parentId === id) {
      throw new ConflictException("Category cannot be its own parent");
    }

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.parentId !== undefined) updateData.parentId = dto.parentId;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;


    if (dto.name && dto.name !== existing.name) {
      const newSlug = slugify(dto.name, { lower: true, strict: true });
      const [slugConflict] = await this.drizzle.db
        .select()
        .from(categories)
        .where(and(eq(categories.slug, newSlug), sql`${categories.id} != ${id}`))
        .limit(1);
      updateData.slug = slugConflict ? `${newSlug}-${Date.now().toString(36)}` : newSlug;
    }

    await this.drizzle.db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id));

    const category = await this.findById(id);

    this.logger.log(`Category updated: ${category.name}`);
    return category;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.drizzle.db
      .delete(categories)
      .where(eq(categories.id, id));
    this.logger.log(`Category deleted: ${id}`);
  }
}
