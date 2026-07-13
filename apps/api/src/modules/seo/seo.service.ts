import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DrizzleService } from "../../database/drizzle.service";
import { seoMetadata, products, categories, blogPosts } from "@tradehubuae/database";
import { eq, desc, sql, count } from "drizzle-orm";
import { ai } from "@tradehubuae/ai";

interface SeoEntry {
  id?: string;
  entityType: string;
  entityId: string;
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
  schema?: string | null;
}

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);

  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(entityType?: string) {
    const query = this.drizzle.db
      .select()
      .from(seoMetadata)
      .orderBy(desc(seoMetadata.updatedAt));

    if (entityType) {
      query.where(eq(seoMetadata.entityType, entityType));
    }

    return query;
  }

  async findByEntity(entityType: string, entityId: string) {
    const result = await this.drizzle.db
      .select()
      .from(seoMetadata)
      .where(
        sql`${seoMetadata.entityType} = ${entityType} AND ${seoMetadata.entityId} = ${entityId}`
      )
      .limit(1);

    return result[0] ?? null;
  }

  async upsert(dto: SeoEntry) {
    const existing = await this.findByEntity(dto.entityType, dto.entityId);

    if (existing) {
      const [updated] = await this.drizzle.db
        .update(seoMetadata)
        .set({
          title: dto.title ?? existing.title,
          description: dto.description ?? existing.description,
          keywords: dto.keywords ?? existing.keywords,
          ogImage: dto.ogImage ?? existing.ogImage,
          schema: dto.schema ?? existing.schema,
          updatedAt: new Date(),
        })
        .where(eq(seoMetadata.id, existing.id))
        .returning();

      return updated;
    }

    const [created] = await this.drizzle.db
      .insert(seoMetadata)
      .values({
        entityType: dto.entityType,
        entityId: dto.entityId,
        title: dto.title,
        description: dto.description,
        keywords: dto.keywords,
        ogImage: dto.ogImage,
        schema: dto.schema,
      })
      .returning();

    return created;
  }

  async remove(id: string) {
    const existing = await this.drizzle.db
      .select()
      .from(seoMetadata)
      .where(eq(seoMetadata.id, id))
      .limit(1);

    if (!existing[0]) throw new NotFoundException("SEO entry not found");

    await this.drizzle.db
      .delete(seoMetadata)
      .where(eq(seoMetadata.id, id));

    return { deleted: true };
  }

  async runDailyGeneration() {
    this.logger.log("Starting daily SEO generation...");
    const results: { entityType: string; entityId: string; title?: string; status: "success" | "error"; error?: string }[] = [];

    // Get top 20 products by viewCount
    const topProducts = await this.drizzle.db
      .select({ id: products.id, name: products.name, slug: products.slug })
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.viewCount))
      .limit(20);

    this.logger.log(`Generating SEO for ${topProducts.length} products`);

    for (const product of topProducts) {
      try {
        const seoContent = await ai.generateSEOContent({
          type: "product",
          title: product.name,
          keywords: [product.name, ...product.name.split(" ")],
        });

        await this.upsert({
          entityType: "product",
          entityId: product.id,
          title: seoContent.metaTitle,
          description: seoContent.metaDescription,
          keywords: seoContent.keywords.join(", "),
          schema: seoContent.schema ? JSON.stringify(seoContent.schema) : null,
        });

        results.push({ entityType: "product", entityId: product.id, title: seoContent.metaTitle, status: "success" });
        this.logger.log(`SEO generated for product: ${product.name}`);
      } catch (error) {
        this.logger.error(`Failed to generate SEO for product ${product.name}`, error as Error);
        results.push({ entityType: "product", entityId: product.id, status: "error", error: (error as Error).message });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    this.logger.log(`Daily SEO generation complete: ${successCount} succeeded, ${errorCount} failed`);
    return { total: results.length, success: successCount, errors: errorCount, results };
  }

  async getStats() {
    const totalEntries = await this.drizzle.db
      .select({ count: count() })
      .from(seoMetadata);

    const staleEntries = await this.drizzle.db
      .select({ count: count() })
      .from(seoMetadata)
      .where(
        sql`${seoMetadata.updatedAt} < NOW() - INTERVAL '90 days'`
      );

    const productSeo = await this.drizzle.db
      .select({ count: count() })
      .from(seoMetadata)
      .where(eq(seoMetadata.entityType, "product"));

    return {
      total: Number(totalEntries[0]?.count ?? 0),
      stale: Number(staleEntries[0]?.count ?? 0),
      products: Number(productSeo[0]?.count ?? 0),
    };
  }
}
