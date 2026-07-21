import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { brands, products } from "@tradehubuae/database";
import { eq, like, or, count, and, asc, desc, sql } from "drizzle-orm";
import type { CreateBrandDto } from "./dto/create-brand.dto";
import type { UpdateBrandDto } from "./dto/update-brand.dto";
import type { QueryBrandDto } from "./dto/query-brand.dto";
import slugify from "slugify";

const brandSortColumns: Record<string, any> = {
  sortOrder: brands.sortOrder,
  name: brands.name,
  createdAt: brands.createdAt,
};

@Injectable()
export class BrandsService {
  private readonly logger = new Logger(BrandsService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: QueryBrandDto) {
    const { page = 1, limit = 50, sort = "sortOrder", order = "asc", q, isActive } = query;

    const conditions: (typeof sql.arguments[number] | undefined)[] = [];
    if (q) {
      conditions.push(
        or(
          like(brands.name, `%${q}%`),
          like(brands.description, `%${q}%`),
        ),
      );
    }
    if (isActive !== undefined) conditions.push(eq(brands.isActive, isActive));

    const where = conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined;

    const data = await this.drizzle.db.query.brands.findMany({
      where,
      orderBy: order === "desc" ? desc(brandSortColumns[sort] ?? brands.sortOrder) : asc(brandSortColumns[sort] ?? brands.sortOrder),
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(brands)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    const enriched = await Promise.all(
      data.map(async (brand) => {
        const [productCount] = await this.drizzle.db
          .select({ total: count() })
          .from(products)
          .where(eq(products.brandId, brand.id));
        return { ...brand, _count: { products: Number(productCount?.total ?? 0) } };
      }),
    );

    return {
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total, hasPreviousPage: page > 1 },
    };
  }

  async findById(id: string) {
    const [brand] = await this.drizzle.db
      .select()
      .from(brands)
      .where(eq(brands.id, id))
      .limit(1);

    if (!brand) throw new NotFoundException("Brand not found");

    const [productCount] = await this.drizzle.db
      .select({ total: count() })
      .from(products)
      .where(eq(products.brandId, id));

    return { ...brand, _count: { products: Number(productCount?.total ?? 0) } };
  }

  async findBySlug(slug: string) {
    const [brand] = await this.drizzle.db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .limit(1);

    if (!brand) throw new NotFoundException("Brand not found");

    const [productCount] = await this.drizzle.db
      .select({ total: count() })
      .from(products)
      .where(eq(products.brandId, brand.id));

    return { ...brand, _count: { products: Number(productCount?.total ?? 0) } };
  }

  async create(dto: CreateBrandDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });

    const [existing] = await this.drizzle.db
      .select()
      .from(brands)
      .where(eq(brands.slug, slug))
      .limit(1);

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const [brand] = await this.drizzle.db
      .insert(brands)
      .values({
        name: dto.name,
        slug: finalSlug,
        description: dto.description,
        logo: dto.logo,
        website: dto.website,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0,
      })
      .returning();

    this.logger.log(`Brand created: ${brand!.name}`);
    return brand!;
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findById(id);

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.logo !== undefined) updateData.logo = dto.logo;
    if (dto.website !== undefined) updateData.website = dto.website;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;

    if (dto.name) {
      const newSlug = slugify(dto.name, { lower: true, strict: true });
      const [slugConflict] = await this.drizzle.db
        .select()
        .from(brands)
        .where(and(eq(brands.slug, newSlug), sql`${brands.id} != ${id}`))
        .limit(1);
      updateData.slug = slugConflict ? `${newSlug}-${Date.now().toString(36)}` : newSlug;
    }

    const [brand] = await this.drizzle.db
      .update(brands)
      .set(updateData)
      .where(eq(brands.id, id))
      .returning();

    this.logger.log(`Brand updated: ${brand!.name}`);
    return brand!;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.drizzle.db
      .delete(brands)
      .where(eq(brands.id, id));
    this.logger.log(`Brand deleted: ${id}`);
  }
}
