import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { returns, orders, orderItems, products, productVariants } from "@tradehubuae/database";
import { eq, and, count, desc, sql } from "drizzle-orm";
import { ORDER_STATUS } from "@tradehubuae/config";
import type { CreateReturnDto } from "./dto/create-return.dto";

@Injectable()
export class ReturnsService {
  private readonly logger = new Logger(ReturnsService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: { page?: number; limit?: number; status?: string; search?: string }) {
    const { page = 1, limit = 20, status, search } = query;
    const conditions: any[] = [];

    if (status) conditions.push(eq(returns.status, status));
    if (search) {
      const orderIds = await this.drizzle.db
        .select({ id: orders.id })
        .from(orders)
        .where(sql`${orders.orderNumber} ILIKE ${`%${search}%`}`);
      if (orderIds.length > 0) {
        conditions.push(sql`${returns.orderId} IN (${orderIds.map((o) => o.id).join(",")})`);
      }
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzle.db
      .select({
        id: returns.id,
        orderId: returns.orderId,
        reason: returns.reason,
        status: returns.status,
        refundAmount: returns.refundAmount,
        notes: returns.notes,
        items: returns.items,
        createdAt: returns.createdAt,
        updatedAt: returns.updatedAt,
        orderNumber: orders.orderNumber,
        orderStatus: orders.status,
        contactName: orders.contactName,
        total: orders.total,
      })
      .from(returns)
      .leftJoin(orders, eq(returns.orderId, orders.id))
      .where(where)
      .orderBy(desc(returns.createdAt))
      .offset((page - 1) * limit)
      .limit(limit);

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(returns)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: string) {
    const [result] = await this.drizzle.db
      .select({
        id: returns.id,
        orderId: returns.orderId,
        reason: returns.reason,
        status: returns.status,
        refundAmount: returns.refundAmount,
        notes: returns.notes,
        items: returns.items,
        createdAt: returns.createdAt,
        updatedAt: returns.updatedAt,
        orderNumber: orders.orderNumber,
        orderStatus: orders.status,
        contactName: orders.contactName,
        contactPhone: orders.contactPhone,
        total: orders.total,
        shippingMethod: orders.shippingMethod,
        paymentMethod: orders.paymentMethod,
        deliveredAt: orders.deliveredAt,
        trackingNumber: orders.trackingNumber,
      })
      .from(returns)
      .leftJoin(orders, eq(returns.orderId, orders.id))
      .where(eq(returns.id, id))
      .limit(1);

    if (!result) throw new NotFoundException("Return not found");
    return result;
  }

  async create(orderId: string, dto?: CreateReturnDto) {
    const [order] = await this.drizzle.db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) throw new NotFoundException("Order not found");

    if (order.status !== ORDER_STATUS.DELIVERED) {
      throw new BadRequestException("Returns are only allowed for delivered orders");
    }

    const deliveredAt = order.deliveredAt ? new Date(order.deliveredAt) : null;
    if (deliveredAt) {
      const daysSinceDelivery = Math.floor(
        (Date.now() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysSinceDelivery > 7) {
        throw new BadRequestException(
          "Return window has expired. Returns are only accepted within 7 days of delivery.",
        );
      }
    }

    const [existing] = await this.drizzle.db
      .select()
      .from(returns)
      .where(
        and(
          eq(returns.orderId, orderId),
          sql`${returns.status} != 'REJECTED'`,
        ),
      )
      .limit(1);

    if (existing) {
      throw new BadRequestException("A return request already exists for this order");
    }

    const orderItemsList = await this.drizzle.db
      .select({ id: orderItems.productId, quantity: orderItems.quantity, name: orderItems.name })
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    const [ret] = await this.drizzle.db
      .insert(returns)
      .values({
        orderId,
        reason: dto?.reason || "Customer requested return",
        notes: dto?.notes || null,
        items: orderItemsList,
        status: "PENDING",
      })
      .returning();

    this.logger.log(`Return requested for order ${order.orderNumber}: ${ret!.id}`);
    return ret!;
  }

  async updateStatus(id: string, dto: { status?: string; refundAmount?: number; notes?: string }) {
    const ret = await this.findById(id);

    if (!dto.status || !["APPROVED", "REJECTED", "REFUNDED"].includes(dto.status)) {
      throw new BadRequestException("Valid status required: APPROVED, REJECTED, or REFUNDED");
    }

    const validTransitions: Record<string, string[]> = {
      PENDING: ["APPROVED", "REJECTED"],
      APPROVED: ["REFUNDED"],
      REFUNDED: [],
      REJECTED: [],
    };

    const allowed = validTransitions[ret.status] ?? [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition return from ${ret.status} to ${dto.status}. Valid: ${allowed.join(", ") || "none"}`,
      );
    }

    if (dto.status === "APPROVED") {
      const items = (ret.items as any[]) || [];
      if (items.length > 0) {
        for (const item of items) {
          if (item.id) {
            await this.drizzle.db
              .update(products)
              .set({
                stock: sql`${products.stock} + ${item.quantity}`,
                saleCount: sql`GREATEST(${products.saleCount} - ${item.quantity}, 0)`,
              })
              .where(eq(products.id, item.id));

            const [orderItem] = await this.drizzle.db
              .select()
              .from(orderItems)
              .where(and(eq(orderItems.orderId, ret.orderId), eq(orderItems.productId, item.id)))
              .limit(1);

            if (orderItem?.variantId) {
              await this.drizzle.db
                .update(productVariants)
                .set({ stock: sql`${productVariants.stock} + ${item.quantity}` })
                .where(eq(productVariants.id, orderItem.variantId));
            }
          }
        }
      } else {
        const orderItemsList = await this.drizzle.db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, ret.orderId));

        for (const item of orderItemsList) {
          await this.drizzle.db
            .update(products)
            .set({
              stock: sql`${products.stock} + ${item.quantity}`,
              saleCount: sql`GREATEST(${products.saleCount} - ${item.quantity}, 0)`,
            })
            .where(eq(products.id, item.productId));

          if (item.variantId) {
            await this.drizzle.db
              .update(productVariants)
              .set({ stock: sql`${productVariants.stock} + ${item.quantity}` })
              .where(eq(productVariants.id, item.variantId));
          }
        }
      }

      await this.drizzle.db
        .update(orders)
        .set({ status: ORDER_STATUS.RETURNED })
        .where(eq(orders.id, ret.orderId));
    }

    if (dto.status === "REFUNDED") {
      await this.drizzle.db
        .update(orders)
        .set({ status: ORDER_STATUS.REFUNDED })
        .where(eq(orders.id, ret.orderId));
    }

    const updateData: Record<string, any> = { status: dto.status };
    if (dto.refundAmount !== undefined) updateData.refundAmount = dto.refundAmount;
    if (dto.notes !== undefined) updateData.notes = dto.notes;

    const [updated] = await this.drizzle.db
      .update(returns)
      .set(updateData)
      .where(eq(returns.id, id))
      .returning();

    this.logger.log(`Return ${id} status updated to ${dto.status}`);
    return updated!;
  }
}
