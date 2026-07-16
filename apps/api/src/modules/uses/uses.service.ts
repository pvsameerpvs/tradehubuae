import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { uses, products } from "@tradehubuae/database";
import { eq, like, or, count, and, asc, desc, sql } from "drizzle-orm";
import type { CreateUseDto } from "./dto/create-use.dto";
import type { UpdateUseDto } from "./dto/update-use.dto";
import type { QueryUseDto } from "./dto/query-use.dto";
import slugify from "slugify";

const useSortColumns: Record<string, any> = {
  name: uses.name,
  createdAt: uses.createdAt,
};

@Injectable()
export class UsesService {
  private readonly logger = new Logger(UsesService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: QueryUseDto) {
    const { page = 1, limit = 50, sort = "name", order = "asc", q } = query;

    const conditions: (typeof sql.arguments[number] | undefined)[] = [];
    if (q) {
      conditions.push(
        or(
          like(uses.name, `%${q}%`),
        ),
      );
    }

    const where = conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined;

    const data = await this.drizzle.db.query.uses.findMany({
      where,
      orderBy: order === "desc" ? desc(useSortColumns[sort] ?? uses.name) : asc(useSortColumns[sort] ?? uses.name),
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(uses)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    const productCounts = await this.drizzle.db
      .select({ useId: products.useId, total: count() })
      .from(products)
      .where(eq(products.isActive, true))
      .groupBy(products.useId);

    const countMap = new Map(productCounts.map((r) => [r.useId, Number(r.total)]));

    const enriched = data.map((item) => ({
      ...item,
      _count: { products: countMap.get(item.id) ?? 0 },
    }));

    return {
      data: enriched,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total, hasPreviousPage: page > 1 },
    };
  }

  async findById(id: string) {
    const [item] = await this.drizzle.db
      .select()
      .from(uses)
      .where(eq(uses.id, id))
      .limit(1);

    if (!item) throw new NotFoundException("Use not found");

    const [countResult] = await this.drizzle.db
      .select({ total: count() })
      .from(products)
      .where(and(eq(products.useId, id), eq(products.isActive, true)));

    return { ...item, _count: { products: Number(countResult?.total ?? 0) } };
  }

  async create(dto: CreateUseDto) {
    const slug = slugify(dto.name, { lower: true, strict: true });

    const [existing] = await this.drizzle.db
      .select()
      .from(uses)
      .where(eq(uses.slug, slug))
      .limit(1);

    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    const [item] = await this.drizzle.db
      .insert(uses)
      .values({ name: dto.name, slug: finalSlug, image: dto.image })
      .returning();

    this.logger.log(`Use created: ${item!.name}`);
    return item!;
  }

  async update(id: string, dto: UpdateUseDto) {
    await this.findById(id);

    const updateData: Record<string, any> = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.image !== undefined) updateData.image = dto.image;

    if (dto.name) {
      const newSlug = slugify(dto.name, { lower: true, strict: true });
      const [slugConflict] = await this.drizzle.db
        .select()
        .from(uses)
        .where(and(eq(uses.slug, newSlug), sql`${uses.id} != ${id}`))
        .limit(1);
      updateData.slug = slugConflict ? `${newSlug}-${Date.now().toString(36)}` : newSlug;
    }

    const [item] = await this.drizzle.db
      .update(uses)
      .set(updateData)
      .where(eq(uses.id, id))
      .returning();

    this.logger.log(`Use updated: ${item!.name}`);
    return item!;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.drizzle.db
      .delete(uses)
      .where(eq(uses.id, id));
    this.logger.log(`Use deleted: ${id}`);
  }
}
