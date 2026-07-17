import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { bulkRequests, bulkRequestItems, products } from "@tradehubuae/database";
import { eq, and, count, desc, SQL } from "drizzle-orm";
import type { CreateBulkSaleDto } from "./dto/create-bulk-sale.dto";
import type { UpdateBulkSaleStatusDto } from "./dto/update-status.dto";

@Injectable()
export class BulkSalesService {
  private readonly logger = new Logger(BulkSalesService.name);

  constructor(private drizzle: DrizzleService) {}

  async findAll(query: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = query;
    const conditions: SQL[] = [];

    if (status) conditions.push(eq(bulkRequests.status, status));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.drizzle.db.query.bulkRequests.findMany({
      where,
      with: { items: true },
      orderBy: [desc(bulkRequests.createdAt)],
      offset: (page - 1) * limit,
      limit,
    });

    const [totalResult] = await this.drizzle.db
      .select({ total: count() })
      .from(bulkRequests)
      .where(where);

    return {
      data,
      meta: {
        total: Number(totalResult?.total ?? 0),
        page,
        limit,
        totalPages: Math.ceil(Number(totalResult?.total ?? 0) / limit),
      },
    };
  }

  async findById(id: string) {
    const [request] = await this.drizzle.db.query.bulkRequests.findMany({
      where: eq(bulkRequests.id, id),
      with: {
        items: {
          with: {
          product: {
            columns: { id: true, name: true, slug: true },
          },
          },
        },
      },
    });

    if (!request) throw new NotFoundException("Bulk request not found");
    return request;
  }

  async create(dto: CreateBulkSaleDto) {
    const [request] = await this.drizzle.db
      .insert(bulkRequests)
      .values({
        companyName: dto.companyName,
        contactName: dto.contactName,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        status: "PENDING",
      })
      .returning();

    if (dto.items?.length) {
      await this.drizzle.db.insert(bulkRequestItems).values(
        dto.items.map((item) => ({
          bulkRequestId: request!.id,
          productId: item.productId,
          quantity: item.quantity,
          targetPrice: item.targetPrice?.toString(),
        })),
      );
    }

    const result = await this.findById(request!.id);
    this.logger.log(`Bulk request created: ${result.companyName}`);
    return result;
  }

  async updateStatus(id: string, dto: UpdateBulkSaleStatusDto) {
    const existing = await this.findById(id);

    const [request] = await this.drizzle.db
      .update(bulkRequests)
      .set({ status: dto.status })
      .where(eq(bulkRequests.id, id))
      .returning();

    this.logger.log(`Bulk request ${id} status: ${existing.status} → ${dto.status}`);
    return request!;
  }
}
