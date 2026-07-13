import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { orders, orderItems } from "@tradehubuae/database";
import { eq, and, count, desc } from "drizzle-orm";
import { generateOrderNumber } from "@tradehubuae/utils";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: { page?: number; limit?: number; status?: string; userId?: string }) {
    const { page = 1, limit = 20, status, userId } = query;
    const conditions: any[] = [];

    if (status) conditions.push(eq(orders.status, status as any));
    if (userId) conditions.push(eq(orders.userId, userId));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzle.db.query.orders.findMany({
      where,
      with: {
        items: true,
        user: { columns: { name: true, email: true } },
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

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const [order] = await this.drizzle.db.query.orders.findMany({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: { columns: { name: true } },
          },
        },
        user: { columns: { name: true, email: true, phone: true } },
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
        shippingAddress: true,
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async create(dto: any, userId?: string) {
    const orderNumber = generateOrderNumber();

    const [order] = await this.drizzle.db
      .insert(orders)
      .values({
        orderNumber,
        userId,
        status: "PENDING",
        subtotal: dto.subtotal.toString(),
        shippingCost: (dto.shippingCost ?? 0).toString(),
        taxAmount: (dto.taxAmount ?? 0).toString(),
        discountAmount: (dto.discountAmount ?? 0).toString(),
        total: dto.total.toString(),
        paymentMethod: dto.paymentMethod,
        shippingMethod: dto.shippingMethod,
        notes: dto.notes,
      })
      .returning();

    if (dto.items?.length > 0) {
      await this.drizzle.db.insert(orderItems).values(
        dto.items.map((item: any) => ({
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
    }

    const result = await this.findById(order!.id);

    this.logger.log(`Order created: ${orderNumber}`);
    return result;
  }

  async updateStatus(id: string, status: string) {
    await this.findById(id);

    const updateData: Record<string, any> = { status };
    if (status === "SHIPPED") updateData.shippedAt = new Date();
    if (status === "DELIVERED") updateData.deliveredAt = new Date();

    const [order] = await this.drizzle.db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    return order!;
  }
}
