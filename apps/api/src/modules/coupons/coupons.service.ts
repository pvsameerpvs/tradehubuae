import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { coupons } from "@tradehubuae/database";
import { eq, like, or, count, and, asc, desc, sql, lte, gte } from "drizzle-orm";
import type { CreateCouponDto } from "./dto/create-coupon.dto";
import type { UpdateCouponDto } from "./dto/update-coupon.dto";
import type { QueryCouponDto } from "./dto/query-coupon.dto";

const sortColumns: Record<string, any> = {
  code: coupons.code,
  value: coupons.value,
  isActive: coupons.isActive,
  createdAt: coupons.createdAt,
  expiresAt: coupons.expiresAt,
};

@Injectable()
export class CouponsService {
  private readonly logger = new Logger(CouponsService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: QueryCouponDto) {
    const { page = 1, limit = 50, sort = "createdAt", order = "desc", q, isActive } = query;

    const conditions: (typeof sql.arguments[number] | undefined)[] = [];
    if (q) {
      conditions.push(
        or(
          like(coupons.code, `%${q}%`),
          like(coupons.description, `%${q}%`),
        ),
      );
    }
    if (isActive !== undefined) conditions.push(eq(coupons.isActive, isActive));

    const where = conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined;

    const data = await this.drizzle.db.query.coupons.findMany({
      where,
      orderBy: order === "desc" ? desc(sortColumns[sort] ?? coupons.createdAt) : asc(sortColumns[sort] ?? coupons.createdAt),
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(coupons)
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
      .from(coupons)
      .where(eq(coupons.id, id))
      .limit(1);

    if (!item) throw new NotFoundException("Coupon not found");
    return item;
  }

  async validateCode(code: string, orderTotal?: number) {
    const cleaned = code.toUpperCase().trim();

    const [item] = await this.drizzle.db
      .select()
      .from(coupons)
      .where(eq(coupons.code, cleaned))
      .limit(1);

    if (!item) return { valid: false, error: "Invalid code" };
    if (!item.isActive) return { valid: false, error: "This code is no longer active" };

    if (item.expiresAt && new Date(item.expiresAt) < new Date()) {
      return { valid: false, error: "This code has expired" };
    }

    if (item.startsAt && new Date(item.startsAt) > new Date()) {
      return { valid: false, error: "This code is not active yet" };
    }

    if (item.usageLimit && item.usedCount >= item.usageLimit) {
      return { valid: false, error: "This code has reached its usage limit" };
    }

    if (orderTotal !== undefined && item.minOrderAmount && orderTotal < Number(item.minOrderAmount)) {
      return {
        valid: false,
        error: `Minimum order amount of AED ${Number(item.minOrderAmount).toLocaleString()} required`,
      };
    }

    let discount = item.type === "percentage"
      ? (orderTotal ?? 0) * (Number(item.value) / 100)
      : Number(item.value);

    if (item.maxDiscount) discount = Math.min(discount, Number(item.maxDiscount));
    if (orderTotal !== undefined) discount = Math.min(discount, orderTotal);

    return {
      valid: true,
      promo: {
        code: item.code,
        description: item.description,
        type: item.type,
        discount,
      },
    };
  }

  async create(dto: CreateCouponDto) {
    const code = dto.code.toUpperCase().trim();

    const [existing] = await this.drizzle.db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1);

    if (existing) throw new BadRequestException("Coupon code already exists");

    const [item] = await this.drizzle.db
      .insert(coupons)
      .values({
        code,
        description: dto.description,
        type: dto.type,
        value: dto.value.toString(),
        minOrderAmount: dto.minOrderAmount?.toString(),
        maxDiscount: dto.maxDiscount?.toString(),
        usageLimit: dto.usageLimit,
        isActive: dto.isActive ?? true,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      })
      .returning();

    this.logger.log(`Coupon created: ${item!.code}`);
    return item!;
  }

  async update(id: string, dto: UpdateCouponDto) {
    await this.findById(id);

    const updateData: Record<string, any> = {};
    if (dto.code !== undefined) updateData.code = dto.code.toUpperCase().trim();
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.value !== undefined) updateData.value = dto.value.toString();
    if (dto.minOrderAmount !== undefined) updateData.minOrderAmount = dto.minOrderAmount?.toString();
    if (dto.maxDiscount !== undefined) updateData.maxDiscount = dto.maxDiscount?.toString();
    if (dto.usageLimit !== undefined) updateData.usageLimit = dto.usageLimit;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.startsAt !== undefined) updateData.startsAt = dto.startsAt ? new Date(dto.startsAt) : null;
    if (dto.expiresAt !== undefined) updateData.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;

    const [item] = await this.drizzle.db
      .update(coupons)
      .set(updateData)
      .where(eq(coupons.id, id))
      .returning();

    this.logger.log(`Coupon updated: ${item!.code}`);
    return item!;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.drizzle.db
      .delete(coupons)
      .where(eq(coupons.id, id));
    this.logger.log(`Coupon deleted: ${id}`);
  }
}
