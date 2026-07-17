import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";
import { logger } from "@tradehubuae/logger";
import { db, schema } from "@tradehubuae/database";
import { ai } from "@tradehubuae/ai";
import { eq, desc, count, sql } from "drizzle-orm";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const QUEUE_NAMES = [
  "ai-generation",
  "image-processing",
  "email-sending",
  "invoice-generation",
  "analytics-processing",
  "seo-generation",
] as const;

async function setupQueue(name: string): Promise<Queue> {
  return new Queue(name, { connection });
}

async function setupWorker(name: string, processor: (job: Job) => Promise<void>): Promise<Worker> {
  const worker = new Worker(
    name,
    async (job) => {
      logger.info(`Processing job ${job.id} from queue ${name}`, { data: job.data });
      try {
        await processor(job);
        logger.info(`Job ${job.id} completed successfully`);
      } catch (error) {
        logger.error(`Job ${job.id} failed`, error as Error);
        throw error;
      }
    },
    { connection },
  );

  worker.on("completed", (job) => {
    logger.info(`Job ${job.id} marked as completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed permanently`, err);
  });

  return worker;
}

async function runSeoGeneration() {
  logger.info("Starting daily SEO generation...");

  const topProducts = await db
    .select({ id: schema.products.id, name: schema.products.name })
    .from(schema.products)
    .where(eq(schema.products.isActive, true))
    .orderBy(desc(schema.products.viewCount))
    .limit(20);

  logger.info(`Generating SEO for ${topProducts.length} products`);
  let success = 0;
  let errors = 0;

  for (const product of topProducts) {
    try {
      const seoContent = await ai.generateSEOContent({
        type: "product",
        title: product.name,
        keywords: [product.name, ...product.name.split(" ")],
      });

      const existing = await db
        .select()
        .from(schema.seoMetadata)
        .where(
          sql`${schema.seoMetadata.entityType} = 'product' AND ${schema.seoMetadata.entityId} = ${product.id}`
        )
        .limit(1);

      if (existing[0]) {
        await db
          .update(schema.seoMetadata)
          .set({
            title: seoContent.metaTitle,
            description: seoContent.metaDescription,
            keywords: seoContent.keywords.join(", "),
            schema: seoContent.schema ? JSON.stringify(seoContent.schema) : null,
            updatedAt: new Date(),
          })
          .where(eq(schema.seoMetadata.id, existing[0].id));
      } else {
        await db
          .insert(schema.seoMetadata)
          .values({
            entityType: "product",
            entityId: product.id,
            title: seoContent.metaTitle,
            description: seoContent.metaDescription,
            keywords: seoContent.keywords.join(", "),
            schema: seoContent.schema ? JSON.stringify(seoContent.schema) : null,
          });
      }

      success++;
      logger.info(`SEO generated: ${product.name}`);
    } catch (error) {
      errors++;
      logger.error(`Failed: ${product.name}`, error as Error);
    }
  }

  logger.info(`Daily SEO complete: ${success} ok, ${errors} failed`);
  return { success, errors, total: topProducts.length };
}

async function startWorkers() {
  logger.info("Starting TradeHub workers...");

  const aiQueue = await setupQueue("ai-generation");
  const imageQueue = await setupQueue("image-processing");
  const emailQueue = await setupQueue("email-sending");
  const invoiceQueue = await setupQueue("invoice-generation");

  // Cron handler: triggered externally via Railway cron
  const cronQueue = await setupQueue("seo-generation");

  await setupWorker("ai-generation", async (job) => {
    const { type, payload } = job.data;
    switch (type) {
      case "product-generation":
        logger.info("Generating product content via AI");
        break;
      case "seo-generation":
        logger.info("Generating SEO content via AI");
        break;
      default:
        logger.warn(`Unknown AI job type: ${type}`);
    }
  });

  await setupWorker("image-processing", async (job) => {
    const { imageId, path } = job.data;
    logger.info(`Processing image ${imageId} at ${path}`);
  });

  await setupWorker("email-sending", async (job) => {
    const { to, subject, template } = job.data;
    logger.info(`Sending email to ${to}: ${subject}`);
  });

  await setupWorker("invoice-generation", async (job) => {
    const { orderId } = job.data;
    logger.info(`Generating invoice for order ${orderId}`);
  });

  // SEO generation worker
  await setupWorker("seo-generation", async (job) => {
    const result = await runSeoGeneration();
    logger.info("SEO generation job result", result);
  });

  logger.info("All workers initialized and listening for jobs");
}

// Allow CLI trigger: `pnpm worker cron:seo-generation`
const isCronTrigger = process.argv.includes("cron:seo-generation");
if (isCronTrigger) {
  runSeoGeneration()
    .then((result) => {
      logger.info("Cron job finished", result);
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Cron job failed", error as Error);
      process.exit(1);
    });
} else {
  startWorkers().catch((error) => {
    logger.error("Failed to start workers", error as Error);
    process.exit(1);
  });
}

process.on("SIGTERM", () => {
  logger.info("Worker shutting down");
  process.exit(0);
});
