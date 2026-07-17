import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { reviews, products } from "@tradehubuae/database";
import { eq, and, asc, desc, count, sql } from "drizzle-orm";
import type { CreateReviewDto, UpdateReviewDto, ReviewQueryDto } from "./dto/create-review.dto";

const sortColumns: Record<string, any> = {
  rating: reviews.rating,
  isApproved: reviews.isApproved,
  createdAt: reviews.createdAt,
  updatedAt: reviews.updatedAt,
};

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: ReviewQueryDto) {
    const { page = 1, limit = 20, sort = "createdAt", order = "desc", productId, isApproved } = query;

    const conditions: (typeof sql.arguments[number] | undefined)[] = [];
    if (productId) conditions.push(eq(reviews.productId, productId));
    if (isApproved !== undefined) conditions.push(eq(reviews.isApproved, isApproved));

    const where = conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined;

    const data = await this.drizzle.db.query.reviews.findMany({
      where,
      orderBy: order === "desc" ? desc(sortColumns[sort] ?? reviews.createdAt) : asc(sortColumns[sort] ?? reviews.createdAt),
      offset: (page - 1) * limit,
      limit,
      with: { product: true, user: { columns: { name: true, image: true } } },
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(reviews)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total, hasPreviousPage: page > 1 },
    };
  }

  async findById(id: string) {
    const [item] = await this.drizzle.db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);

    if (!item) throw new NotFoundException("Review not found");
    return item;
  }

  async findByProduct(productId: string) {
    const data = await this.drizzle.db.query.reviews.findMany({
      where: and(eq(reviews.productId, productId), eq(reviews.isApproved, true)),
      orderBy: desc(reviews.createdAt),
      with: { product: true, user: { columns: { name: true, image: true } } },
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.isApproved, true)));

    const total = Number(totalResult?.total ?? 0);

    return { data, total };
  }

  async create(dto: CreateReviewDto, userId: string) {
    const [product] = await this.drizzle.db
      .select()
      .from(products)
      .where(eq(products.id, dto.productId))
      .limit(1);

    if (!product) throw new BadRequestException("Product not found");

    const [existing] = await this.drizzle.db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.productId, dto.productId)))
      .limit(1);

    if (existing) throw new ConflictException("You have already reviewed this product");

    const [item] = await this.drizzle.db
      .insert(reviews)
      .values({
        productId: dto.productId,
        userId,
        rating: dto.rating,
        title: dto.title,
        content: dto.content,
        pros: dto.pros,
        cons: dto.cons,
      })
      .returning();

    this.logger.log(`Review created: ${item!.id} for product ${dto.productId}`);
    return item!;
  }

  async update(id: string, dto: UpdateReviewDto) {
    await this.findById(id);

    const updateData: Record<string, any> = {};
    if (dto.rating !== undefined) updateData.rating = dto.rating;
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.pros !== undefined) updateData.pros = dto.pros;
    if (dto.cons !== undefined) updateData.cons = dto.cons;
    if (dto.isApproved !== undefined) updateData.isApproved = dto.isApproved;
    if (Object.keys(updateData).length > 0) updateData.updatedAt = new Date();

    const [item] = await this.drizzle.db
      .update(reviews)
      .set(updateData)
      .where(eq(reviews.id, id))
      .returning();

    this.logger.log(`Review updated: ${item!.id}`);
    return item!;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.drizzle.db
      .delete(reviews)
      .where(eq(reviews.id, id));
    this.logger.log(`Review deleted: ${id}`);
  }
}
