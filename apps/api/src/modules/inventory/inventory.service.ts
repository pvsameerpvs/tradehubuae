import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { stock, stockHistory, stockTransfers, stockTransferItems } from "@tradehubuae/database";
import { eq, and, lte, sql } from "drizzle-orm";

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private drizzle: DrizzleService) {}

  async getStock(productId: string) {
    return this.drizzle.db.query.stock.findMany({
      where: eq(stock.productId, productId),
      with: { warehouse: true },
    });
  }

  async getAllStock(query: { warehouseId?: string; lowStock?: boolean }) {
    const conditions: (typeof sql.arguments[number] | undefined)[] = [];

    if (query.warehouseId) conditions.push(eq(stock.warehouseId, query.warehouseId));

    const where = conditions.length > 0 ? and(...conditions.filter(Boolean)) : undefined;

    const allStock = await this.drizzle.db.query.stock.findMany({
      where,
      with: {
        warehouse: true,
        product: { columns: { name: true, sku: true } },
      },
    });

    if (query.lowStock) {
      return allStock.filter((s) => s.available <= s.minimumStock);
    }

    return allStock;
  }

  async adjustStock(id: string, quantity: number, type: string, note?: string) {
    const [stockRecord] = await this.drizzle.db
      .select()
      .from(stock)
      .where(eq(stock.id, id))
      .limit(1);

    if (!stockRecord) throw new NotFoundException("Stock record not found");

    const [updated] = await this.drizzle.db
      .update(stock)
      .set({
        quantity: sql`quantity + ${quantity}`,
        available: sql`available + ${quantity}`,
      })
      .where(eq(stock.id, id))
      .returning();

    await this.drizzle.db.insert(stockHistory).values({
      variantId: id,
      warehouseId: stockRecord.warehouseId,
      type,
      quantity,
      note,
    });

    return updated!;
  }

  async transferStock(dto: { fromWarehouseId: string; toWarehouseId: string; items: { variantId: string; quantity: number }[] }) {
    const transfer = await this.drizzle.db.transaction(async (tx) => {
      for (const item of dto.items) {
        const [fromStock] = await tx
          .select()
          .from(stock)
          .where(
            and(
              eq(stock.warehouseId, dto.fromWarehouseId),
              eq(stock.variantId, item.variantId),
            ),
          )
          .limit(1);

        if (!fromStock || fromStock.available < item.quantity) {
          throw new Error(`Insufficient stock for variant ${item.variantId}`);
        }
      }

      const [transfer] = await tx
        .insert(stockTransfers)
        .values({
          fromWarehouseId: dto.fromWarehouseId,
          toWarehouseId: dto.toWarehouseId,
          referenceNumber: `ST-${Date.now().toString(36).toUpperCase()}`,
        })
        .returning();

      if (dto.items.length > 0) {
        await tx.insert(stockTransferItems).values(
          dto.items.map((item) => ({
            transferId: transfer!.id,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        );
      }

      return transfer!;
    });

    return transfer;
  }

  async getLowStockAlerts(threshold: number = 5) {
    return this.drizzle.db.query.stock.findMany({
      where: lte(stock.available, threshold),
      with: {
        product: { columns: { name: true, sku: true } },
        warehouse: { columns: { name: true } },
      },
      orderBy: (stock, { asc }) => [asc(stock.available)],
    });
  }
}
