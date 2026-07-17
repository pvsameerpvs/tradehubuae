import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { orders, orderItems, products, productVariants } from "@tradehubuae/database";
import { eq, and, count, desc, sql, SQL } from "drizzle-orm";
import { generateOrderNumber } from "@tradehubuae/utils";
import { ORDER_STATUS, type OrderStatus } from "@tradehubuae/config";

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

  async findAll(query: { page?: number; limit?: number; status?: string; userId?: string; search?: string }) {
    const { page = 1, limit = 20, status, userId, search } = query;
    const conditions: SQL[] = [];

    if (status) conditions.push(eq(orders.status, status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | "REFUNDED"));
    if (userId) conditions.push(eq(orders.userId, userId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzle.db.query.orders.findMany({
      where,
      with: {
        items: true,
        user: { columns: { name: true, email: true, phone: true } },
        shippingAddress: true,
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
        shippingAddress: true,
        billingAddress: true,
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
        shippingAddress: true,
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
        subtotal: dto.subtotal.toString(),
        shippingCost: (dto.shippingCost ?? 0).toString(),
        taxAmount: (dto.taxAmount ?? 0).toString(),
        discountAmount: (dto.discountAmount ?? 0).toString(),
        total: dto.total.toString(),
        paymentMethod: dto.paymentMethod,
        shippingMethod: dto.shippingMethod,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        shippingAddressId: dto.shippingAddressId ?? null,
        shippingAddress: dto.shippingAddress ?? null,
        estimatedDeliveryDate: estDelivery,
        notes: dto.notes,
      })
      .returning();

    if (dto.items && dto.items.length > 0) {
      const items = dto.items;
      await this.drizzle.db.insert(orderItems).values(
        items.map((item) => ({
          orderId: order!.id,
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          totalPrice: (item.unitPrice * item.quantity).toString(),
          image: item.image,
        })),
      );

      for (const item of items) {
        if (item.productId) {
          await this.drizzle.db
            .update(products)
            .set({
              saleCount: sql`${products.saleCount} + ${item.quantity}`,
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

    const result = await this.findById(order!.id);

    this.logger.log(`Order created: ${orderNumber}`);
    return result;
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

    const [order] = await this.drizzle.db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    this.logger.log(`Order ${existing.orderNumber} status: ${existing.status} → ${status}`);
    return order!;
  }
}
