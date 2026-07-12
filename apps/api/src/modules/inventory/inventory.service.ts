import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private prisma: PrismaService) {}

  async getStock(productId: string) {
    return this.prisma.stock.findMany({
      where: { productId },
      include: { warehouse: true },
    });
  }

  async getAllStock(query: { warehouseId?: string; lowStock?: boolean }) {
    const where: any = {};
    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.lowStock) where.available = { lte: this.prisma.stock.fields.minimumStock };

    return this.prisma.stock.findMany({
      where,
      include: {
        warehouse: true,
        product: { select: { name: true, sku: true } },
      },
    });
  }

  async adjustStock(id: string, quantity: number, type: string, note?: string) {
    const stock = await this.prisma.stock.findUnique({ where: { id } });
    if (!stock) throw new NotFoundException("Stock record not found");

    const updated = await this.prisma.stock.update({
      where: { id },
      data: {
        quantity: { increment: quantity },
        available: { increment: quantity },
      },
    });

    await this.prisma.stockHistory.create({
      data: {
        variantId: id,
        warehouseId: stock.warehouseId,
        type,
        quantity,
        note,
      },
    });

    return updated;
  }

  async transferStock(dto: { fromWarehouseId: string; toWarehouseId: string; items: { variantId: string; quantity: number }[] }) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        const fromStock = await tx.stock.findUnique({
          where: { warehouseId_productId_variantId: { warehouseId: dto.fromWarehouseId, productId: "", variantId: item.variantId } },
        });

        if (!fromStock || fromStock.available < item.quantity) {
          throw new Error(`Insufficient stock for variant ${item.variantId}`);
        }
      }

      const transfer = await tx.stockTransfer.create({
        data: {
          fromWarehouseId: dto.fromWarehouseId,
          toWarehouseId: dto.toWarehouseId,
          referenceNumber: `ST-${Date.now().toString(36).toUpperCase()}`,
          items: {
            create: dto.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          },
        },
      });

      return transfer;
    });
  }

  async getLowStockAlerts(threshold: number = 5) {
    return this.prisma.stock.findMany({
      where: { available: { lte: threshold } },
      include: {
        product: { select: { name: true, sku: true } },
        warehouse: { select: { name: true } },
      },
      orderBy: { available: "asc" },
    });
  }
}
