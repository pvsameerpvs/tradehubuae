import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { generateOrderNumber } from "@tradehubuae/utils";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(query: { page?: number; limit?: number; status?: string; userId?: string }) {
    const { page = 1, limit = 20, status, userId } = query;
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

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
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: { select: { name: true } } } },
        user: { select: { name: true, email: true, phone: true } },
        payment: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        shippingAddress: true,
      },
    });

    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async create(dto: any, userId?: string) {
    const orderNumber = generateOrderNumber();

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        status: "PENDING",
        subtotal: dto.subtotal,
        shippingCost: dto.shippingCost ?? 0,
        taxAmount: dto.taxAmount ?? 0,
        discountAmount: dto.discountAmount ?? 0,
        total: dto.total,
        paymentMethod: dto.paymentMethod,
        shippingMethod: dto.shippingMethod,
        notes: dto.notes,
        items: {
          create: dto.items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            image: item.image,
          })),
        },
      },
      include: { items: true },
    });

    this.logger.log(`Order created: ${orderNumber}`);
    return order;
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findById(id);

    const updateData: any = { status };
    if (status === "SHIPPED") updateData.shippedAt = new Date();
    if (status === "DELIVERED") updateData.deliveredAt = new Date();

    return this.prisma.order.update({
      where: { id },
      data: updateData,
    });
  }
}
