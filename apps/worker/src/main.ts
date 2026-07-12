import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { logger } from "@tradehubuae/logger";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
}) as any;

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

async function setupWorker(name: string, processor: (job: any) => Promise<void>): Promise<Worker> {
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

async function startWorkers() {
  logger.info("Starting TradeHub workers...");

  const aiQueue = await setupQueue("ai-generation");
  const imageQueue = await setupQueue("image-processing");
  const emailQueue = await setupQueue("email-sending");
  const invoiceQueue = await setupQueue("invoice-generation");

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

  logger.info("All workers initialized and listening for jobs");
}

startWorkers().catch((error) => {
  logger.error("Failed to start workers", error as Error);
  process.exit(1);
});

process.on("SIGTERM", () => {
  logger.info("Worker shutting down");
  process.exit(0);
});
