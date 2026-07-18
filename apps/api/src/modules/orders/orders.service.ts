import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { orders, orderItems, products, productVariants, coupons } from "@tradehubuae/database";
import { eq, and, count, desc, gte, lte, sql, SQL } from "drizzle-orm";
import { generateOrderNumber } from "@tradehubuae/utils";
import { ORDER_STATUS, type OrderStatus } from "@tradehubuae/config";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const STATUS_FLOW: Record<string, string[]> = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.RETURNED]: [],
  [ORDER_STATUS.REFUNDED]: [],
};

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: { page?: number; limit?: number; status?: string; userId?: string; search?: string; startDate?: string; endDate?: string }) {
    const { page = 1, limit = 20, status, userId, search, startDate, endDate } = query;
    const conditions: SQL[] = [];

    if (status) conditions.push(eq(orders.status, status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | "REFUNDED"));
    if (userId) conditions.push(eq(orders.userId, userId));
    if (startDate) conditions.push(gte(orders.createdAt, new Date(startDate)));
    if (endDate) conditions.push(lte(orders.createdAt, new Date(endDate)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzle.db.query.orders.findMany({
      where,
      with: {
        items: true,
        user: { columns: { name: true, email: true, phone: true } },
      },
      orderBy: [desc(orders.createdAt)],
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(orders)
      .where(where);

    const total = Number(totalResult?.total ?? 0);

    let filteredData = data;
    if (search) {
      const q = search.toLowerCase();
      filteredData = data.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.contactName?.toLowerCase().includes(q) ||
          o.contactPhone?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q),
      );
    }

    return {
      data: filteredData,
      meta: {
        total: search ? filteredData.length : total,
        page,
        limit,
        totalPages: Math.ceil((search ? filteredData.length : total) / limit),
      },
    };
  }

  async findById(id: string) {
    const [order] = await this.drizzle.db.query.orders.findMany({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: { columns: { name: true, slug: true } },
          },
        },
        user: { columns: { id: true, name: true, email: true, phone: true, image: true } },
        payment: true,
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const [order] = await this.drizzle.db.query.orders.findMany({
      where: eq(orders.orderNumber, orderNumber),
      with: {
        items: true,
        user: { columns: { name: true, email: true, phone: true } },
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async create(dto: {
    subtotal: number;
    total: number;
    paymentMethod: string;
    shippingMethod: string;
    contactName: string;
    contactPhone: string;
    shippingCost?: number;
    taxAmount?: number;
    discountAmount?: number;
    couponCode?: string;
    notes?: string;
    shippingAddressId?: string;
    shippingAddress?: Record<string, unknown>;
    items?: Array<{
      productId: string;
      variantId?: string;
      quantity: number;
      unitPrice: number;
      name: string;
      sku: string;
      image?: string;
    }>;
  }, userId?: string) {
    try {
      if (!dto.contactName || !dto.contactPhone) {
        throw new BadRequestException("contactName and contactPhone are required");
      }
      if (dto.subtotal == null || dto.total == null) {
        throw new BadRequestException("subtotal and total are required");
      }
      if (isNaN(Number(dto.subtotal)) || isNaN(Number(dto.total))) {
        throw new BadRequestException("subtotal and total must be valid numbers");
      }

      if (!dto.items || dto.items.length === 0) {
        throw new BadRequestException("At least one item is required");
      }

      for (const [i, item] of dto.items.entries()) {
        if (!item.productId || !UUID_REGEX.test(item.productId)) {
          throw new BadRequestException(
            `Item ${i}: productId is not a valid UUID`,
          );
        }
        if (!item.name) {
          throw new BadRequestException(`Item ${i}: name is required`);
        }
        if (!item.sku) {
          throw new BadRequestException(`Item ${i}: sku is required`);
        }
        if (item.sku.length > 500) {
          throw new BadRequestException(`Item ${i}: sku is too long (max 500 chars)`);
        }
        if (item.name.length > 500) {
          throw new BadRequestException(`Item ${i}: name is too long (max 500 chars)`);
        }
        if (!item.quantity || item.quantity < 1) {
          throw new BadRequestException(`Item ${i}: quantity must be at least 1`);
        }
        if (item.unitPrice == null || item.unitPrice < 0) {
          throw new BadRequestException(`Item ${i}: unitPrice is invalid`);
        }
      }

      const orderNumber = generateOrderNumber();

      const estDelivery = new Date();
      if (dto.shippingMethod === "express") {
        estDelivery.setDate(estDelivery.getDate() + 2);
      } else if (dto.shippingMethod === "next_day") {
        estDelivery.setDate(estDelivery.getDate() + 1);
      } else {
        estDelivery.setDate(estDelivery.getDate() + 5);
      }

      const [order] = await this.drizzle.db
        .insert(orders)
        .values({
          orderNumber,
          userId,
          status: ORDER_STATUS.PENDING,
          subtotal: Number(dto.subtotal).toFixed(2),
          shippingCost: Number(dto.shippingCost ?? 0).toFixed(2),
          taxAmount: Number(dto.taxAmount ?? 0).toFixed(2),
          discountAmount: Number(dto.discountAmount ?? 0).toFixed(2),
          total: Number(dto.total).toFixed(2),
          paymentMethod: dto.paymentMethod,
          shippingMethod: dto.shippingMethod,
          contactName: dto.contactName,
          contactPhone: dto.contactPhone,
          shippingAddressId: dto.shippingAddressId ?? null,
          shippingAddress: dto.shippingAddress ?? null,
          estimatedDeliveryDate: estDelivery,
          notes: dto.notes,
          couponCode: dto.couponCode ?? null,
        })
        .returning();

      if (dto.items && dto.items.length > 0) {
        const items = dto.items;
        await this.drizzle.db.insert(orderItems).values(
          items.map((item) => ({
            orderId: order!.id,
            productId: item.productId,
            variantId: item.variantId ?? null,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice).toFixed(2),
            totalPrice: (Number(item.unitPrice) * Number(item.quantity)).toFixed(2),
            image: item.image ?? null,
          })),
        );

        for (const item of items) {
          if (item.productId) {
            await this.drizzle.db
              .update(products)
              .set({
                saleCount: sql`${products.saleCount} + ${item.quantity}`,
                stock: sql`${products.stock} - ${item.quantity}`,
              })
              .where(eq(products.id, item.productId));

            if (item.variantId) {
              await this.drizzle.db
                .update(productVariants)
                .set({
                  stock: sql`${productVariants.stock} - ${item.quantity}`,
                })
                .where(eq(productVariants.id, item.variantId));
            }
          }
        }
      }

      if (dto.couponCode) {
        await this.drizzle.db
          .update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(eq(coupons.code, dto.couponCode.toUpperCase().trim()));
      }

      const result = await this.findById(order!.id);

      this.logger.log(`Order created: ${orderNumber}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create order: ${(error as Error).message}`, (error as Error).stack);
      throw error;
    }
  }

  async updateStatus(id: string, status: string) {
    const existing = await this.findById(id);

    const validNext = STATUS_FLOW[existing.status] ?? [];
    if (!validNext.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${existing.status} to ${status}. Valid transitions: ${validNext.join(", ") || "none"}`,
      );
    }

    const updateData: Record<string, any> = { status: status as OrderStatus };
    if (status === "SHIPPED") updateData.shippedAt = new Date();
    if (status === "DELIVERED") updateData.deliveredAt = new Date();

    if (status === ORDER_STATUS.CANCELLED || status === ORDER_STATUS.RETURNED || status === ORDER_STATUS.REFUNDED) {
      const items = existing.items;
      if (items?.length) {
        for (const item of items) {
          if (item.productId) {
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
                .set({
                  stock: sql`${productVariants.stock} + ${item.quantity}`,
                })
                .where(eq(productVariants.id, item.variantId));
            }
          }
        }
      }
    }

    const [order] = await this.drizzle.db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    this.logger.log(`Order ${existing.orderNumber} status: ${existing.status} → ${status}`);
    return order!;
  }
}
