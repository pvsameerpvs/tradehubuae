import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";
import { logger } from "@tradehubuae/logger";
import { db, schema } from "@tradehubuae/database";
import { ai } from "@tradehubuae/ai";
import { storage } from "@tradehubuae/storage";
import { eq, desc, count, sql, and, gte, lte } from "drizzle-orm";
import sharp from "sharp";
import { env } from "@tradehubuae/config";

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

  await setupQueue("ai-generation");
  await setupQueue("image-processing");
  await setupQueue("email-sending");
  await setupQueue("invoice-generation");
  await setupQueue("analytics-processing");
  await setupQueue("seo-generation");

  await setupWorker("ai-generation", async (job) => {
    const { type, payload } = job.data;
    switch (type) {
      case "product-generation": {
        logger.info("Generating product content via AI");
        const productId = payload.productId;

        const [product] = await db
          .select()
          .from(schema.products)
          .where(eq(schema.products.id, productId))
          .limit(1);

        if (!product) {
          throw new Error(`Product ${productId} not found`);
        }

        const generated = await ai.generateProduct({
          model: payload.model,
          brand: payload.brand,
          category: payload.category,
          specs: payload.specs,
        });

        await db
          .update(schema.products)
          .set({
            name: generated.title,
            description: generated.description,
            shortDescription: generated.shortDescription,
            seoTitle: generated.seo.metaTitle,
            seoDescription: generated.seo.metaDescription,
            metaKeywords: generated.seo.keywords.join(", "),
            updatedAt: new Date(),
          })
          .where(eq(schema.products.id, productId));

        const [existing] = await db
          .select()
          .from(schema.seoMetadata)
          .where(
            and(
              eq(schema.seoMetadata.entityType, "product"),
              eq(schema.seoMetadata.entityId, productId),
            ),
          )
          .limit(1);

        const seoValues = {
          title: generated.seo.metaTitle,
          description: generated.seo.metaDescription,
          keywords: generated.seo.keywords.join(", "),
        };

        if (existing) {
          await db
            .update(schema.seoMetadata)
            .set({ ...seoValues, updatedAt: new Date() })
            .where(eq(schema.seoMetadata.id, existing.id));
        } else {
          await db.insert(schema.seoMetadata).values({
            entityType: "product",
            entityId: productId,
            ...seoValues,
          });
        }

        if (generated.specifications.length > 0) {
          await db
            .delete(schema.productSpecs)
            .where(eq(schema.productSpecs.productId, productId));

          await db.insert(schema.productSpecs).values(
            generated.specifications.map((spec, i) => ({
              productId,
              label: spec.label,
              value: spec.value,
              sortOrder: i,
            })),
          );
        }

        logger.info(`AI product content generated for ${productId}`);
        break;
      }
      case "seo-generation": {
        logger.info("Generating SEO content via AI");
        const { entityType, entityId, title, keywords } = payload;

        const seoContent = await ai.generateSEOContent({
          type: entityType as "product" | "category" | "blog",
          title,
          keywords,
        });

        const [existing] = await db
          .select()
          .from(schema.seoMetadata)
          .where(
            and(
              eq(schema.seoMetadata.entityType, entityType),
              eq(schema.seoMetadata.entityId, entityId),
            ),
          )
          .limit(1);

        if (existing) {
          await db
            .update(schema.seoMetadata)
            .set({
              title: seoContent.metaTitle,
              description: seoContent.metaDescription,
              keywords: seoContent.keywords.join(", "),
              schema: seoContent.schema ? JSON.stringify(seoContent.schema) : null,
              updatedAt: new Date(),
            })
            .where(eq(schema.seoMetadata.id, existing.id));
        } else {
          await db.insert(schema.seoMetadata).values({
            entityType,
            entityId,
            title: seoContent.metaTitle,
            description: seoContent.metaDescription,
            keywords: seoContent.keywords.join(", "),
            schema: seoContent.schema ? JSON.stringify(seoContent.schema) : null,
          });
        }

        logger.info(`SEO content generated for ${entityType}:${entityId}`);
        break;
      }
      default:
        logger.warn(`Unknown AI job type: ${type}`);
    }
  });

  await setupWorker("image-processing", async (job) => {
    const { type, imageId, path, buffer } = job.data;

    const inputBuffer = buffer
      ? Buffer.from(buffer.data ?? buffer)
      : null;

    if (!inputBuffer) {
      throw new Error("No image buffer provided");
    }

    switch (type) {
      case "resize": {
        logger.info(`Resizing image ${imageId}`);

        const sizes = [
          { suffix: "thumbnail", width: 150, height: 150 },
          { suffix: "small", width: 300, height: 300 },
          { suffix: "medium", width: 600, height: 600 },
          { suffix: "large", width: 1200, height: 1200 },
        ];

        const results: { suffix: string; url: string }[] = [];

        for (const size of sizes) {
          const resized = await sharp(inputBuffer)
            .resize(size.width, size.height, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          const basePath = path.replace(/\.[^.]+$/, "");
          const key = `${basePath}_${size.suffix}.webp`;

          const result = await storage.upload({
            buffer: resized,
            key,
            contentType: "image/webp",
            convertToWebP: false,
          });

          results.push({ suffix: size.suffix, url: result.url });
        }

        logger.info(`Image ${imageId} resized to ${results.length} variants`);
        break;
      }
      case "webp-convert": {
        logger.info(`Converting image ${imageId} to WebP`);

        const webpBuffer = await sharp(inputBuffer)
          .webp({ quality: 80 })
          .toBuffer();

        const webpKey = path.replace(/\.[^.]+$/, ".webp");

        const result = await storage.upload({
          buffer: webpBuffer,
          key: webpKey,
          contentType: "image/webp",
          convertToWebP: false,
        });

        if (imageId) {
          await db
            .update(schema.productImages)
            .set({
              url: result.url,
              format: "webp",
            })
            .where(eq(schema.productImages.id, imageId));
        }

        logger.info(`Image ${imageId} converted to WebP at ${result.url}`);
        break;
      }
      default:
        logger.warn(`Unknown image processing type: ${type}`);
    }
  });

  await setupWorker("email-sending", async (job) => {
    const { type, payload } = job.data;
    const resendApiKey = env.RESEND_API_KEY;
    const from = env.EMAIL_FROM;

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    async function sendResendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, html }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`Resend API error ${response.status}: ${body}`);
      }

      return response.json();
    }

    switch (type) {
      case "order-confirmation": {
        const orderId = payload.orderId;
        logger.info(`Sending order confirmation for order ${orderId}`);

        const [order] = await db
          .select()
          .from(schema.orders)
          .where(eq(schema.orders.id, orderId))
          .limit(1);

        if (!order) throw new Error(`Order ${orderId} not found`);

        const [user] = order.userId
          ? await db
              .select()
              .from(schema.users)
              .where(eq(schema.users.id, order.userId))
              .limit(1)
          : [];

        const items = await db
          .select()
          .from(schema.orderItems)
          .where(eq(schema.orderItems.orderId, order.id));

        const itemsHtml = items
          .map(
            (item) =>
              `<tr><td style="padding:8px;border:1px solid #ddd">${item.name}</td><td style="padding:8px;border:1px solid #ddd;text-align:center">${item.quantity}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">AED ${Number(item.unitPrice).toFixed(2)}</td><td style="padding:8px;border:1px solid #ddd;text-align:right">AED ${Number(item.totalPrice).toFixed(2)}</td></tr>`,
          )
          .join("");

        const html = `
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order <strong>${order.orderNumber}</strong>.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <thead><tr style="background:#f5f5f5"><th style="padding:8px;border:1px solid #ddd;text-align:left">Item</th><th style="padding:8px;border:1px solid #ddd">Qty</th><th style="padding:8px;border:1px solid #ddd;text-align:right">Price</th><th style="padding:8px;border:1px solid #ddd;text-align:right">Total</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p><strong>Total:</strong> AED ${Number(order.total).toFixed(2)}</p>
          ${order.contactName ? `<p><strong>Customer:</strong> ${order.contactName}${order.contactPhone ? ` - ${order.contactPhone}` : ""}</p>` : ""}
          <p>We will notify you once your order ships.</p>
        `;

        await sendResendEmail({
          to: user?.email ?? payload.to,
          subject: `Order Confirmed - ${order.orderNumber}`,
          html,
        });

        await db.insert(schema.notifications).values({
          userId: order.userId,
          orderId: order.id,
          type: "order_confirmation",
          channel: "email",
          subject: `Order ${order.orderNumber} confirmed`,
          content: html.replace(/<[^>]*>/g, "").slice(0, 500),
          sentAt: new Date(),
        });

        logger.info(`Order confirmation sent for ${order.orderNumber}`);
        break;
      }
      case "password-reset": {
        logger.info(`Sending password reset email to ${payload.to}`);

        const html = `
          <h1>Password Reset</h1>
          <p>You requested a password reset for your TradeHub UAE account.</p>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${payload.resetLink}" style="display:inline-block;padding:12px 24px;background:#0066cc;color:#fff;text-decoration:none;border-radius:6px;margin:16px 0">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `;

        await sendResendEmail({
          to: payload.to,
          subject: "Password Reset - TradeHub UAE",
          html,
        });

        logger.info(`Password reset email sent to ${payload.to}`);
        break;
      }
      case "contact-notification": {
        logger.info("Sending contact form notification");

        const html = `
          <h1>New Contact Form Submission</h1>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${payload.name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${payload.email}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Phone</td><td style="padding:8px">${payload.phone ?? "N/A"}</td></tr>
          </table>
          <hr style="margin:16px 0"/>
          <p><strong>Message:</strong></p>
          <p>${payload.message}</p>
        `;

        await sendResendEmail({
          to: payload.to,
          subject: `New Contact from ${payload.name} - TradeHub UAE`,
          html,
        });

        logger.info(`Contact notification sent for ${payload.name}`);
        break;
      }
      default:
        logger.warn(`Unknown email type: ${type}`);
    }
  });

  await setupWorker("invoice-generation", async (job) => {
    const { orderId } = job.data;
    logger.info(`Generating invoice for order ${orderId}`);

    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);

    if (!order) throw new Error(`Order ${orderId} not found`);

    const items = await db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, orderId));

    const [user] = order.userId
      ? await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, order.userId))
          .limit(1)
      : [];

    const invoiceNumber = `INV-${order.orderNumber}`;

    const itemsRows = items
      .map(
        (item) =>
          `<tr>
            <td style="padding:8px;border:1px solid #ddd">${item.name}</td>
            <td style="padding:8px;border:1px solid #ddd">${item.sku}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">AED ${Number(item.unitPrice).toFixed(2)}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">AED ${Number(item.totalPrice).toFixed(2)}</td>
          </tr>`,
      )
      .join("");

    const invoiceHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Invoice ${invoiceNumber}</title></head>
<body style="font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px 20px">
  <div style="text-align:center;margin-bottom:40px;border-bottom:2px solid #003399;padding-bottom:20px">
    <h1 style="color:#003399;margin:0">TradeHub UAE</h1>
    <p style="color:#666;font-size:14px">IT Equipment & Solutions</p>
  </div>
  <div style="margin-bottom:32px">
    <h2 style="color:#333;margin:0 0 4px">Invoice</h2>
    <p style="margin:0;color:#666">${invoiceNumber}</p>
  </div>
  <table style="width:100%;margin-bottom:32px;font-size:14px">
    <tr><td style="padding:4px 8px;color:#666">Order</td><td style="padding:4px 8px">${order.orderNumber}</td><td style="padding:4px 8px;color:#666">Date</td><td style="padding:4px 8px">${order.createdAt.toLocaleDateString()}</td></tr>
    <tr><td style="padding:4px 8px;color:#666">Customer</td><td style="padding:4px 8px">${user?.name ?? order.contactName ?? "N/A"}</td><td style="padding:4px 8px;color:#666">Payment</td><td style="padding:4px 8px">${order.paymentMethod ?? order.paymentStatus}</td></tr>
    <tr><td style="padding:4px 8px;color:#666">Email</td><td style="padding:4px 8px">${user?.email ?? "N/A"}</td><td style="padding:4px 8px;color:#666">Status</td><td style="padding:4px 8px">${order.status}</td></tr>
  </table>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <thead>
      <tr style="background:#003399;color:#fff">
        <th style="padding:10px;border:1px solid #003399;text-align:left">Item</th>
        <th style="padding:10px;border:1px solid #003399;text-align:left">SKU</th>
        <th style="padding:10px;border:1px solid #003399;text-align:center">Qty</th>
        <th style="padding:10px;border:1px solid #003399;text-align:right">Unit Price</th>
        <th style="padding:10px;border:1px solid #003399;text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>
  <div style="text-align:right;font-size:14px;border-top:2px solid #eee;padding-top:16px">
    <p style="margin:4px 0"><strong>Subtotal:</strong> AED ${Number(order.subtotal).toFixed(2)}</p>
    <p style="margin:4px 0"><strong>Shipping:</strong> AED ${Number(order.shippingCost).toFixed(2)}</p>
    <p style="margin:4px 0"><strong>Tax:</strong> AED ${Number(order.taxAmount).toFixed(2)}</p>
    ${Number(order.discountAmount) > 0 ? `<p style="margin:4px 0"><strong>Discount:</strong> -AED ${Number(order.discountAmount).toFixed(2)}</p>` : ""}
    <p style="margin:8px 0 0;font-size:20px;color:#003399"><strong>Total: AED ${Number(order.total).toFixed(2)}</strong></p>
  </div>
  <div style="margin-top:48px;padding-top:16px;border-top:1px solid #ddd;font-size:12px;color:#999;text-align:center">
    <p>TradeHub UAE | tradinghubuae.com</p>
    <p>Thank you for your business!</p>
  </div>
</body>
</html>`;

    const invoiceBuffer = Buffer.from(invoiceHtml, "utf-8");
    const filename = `${invoiceNumber}.html`;

    const uploadResult = await storage.uploadDocument(invoiceBuffer, "invoices", filename);

    await db
      .update(schema.orders)
      .set({ updatedAt: new Date() })
      .where(eq(schema.orders.id, orderId));

    await db.insert(schema.notifications).values({
      userId: order.userId,
      orderId: order.id,
      type: "invoice_generated",
      channel: "system",
      subject: `Invoice ${invoiceNumber} generated`,
      content: `Invoice for order ${order.orderNumber} has been generated.`,
      metadata: JSON.stringify({
        invoiceNumber,
        invoiceUrl: uploadResult.url,
        invoiceKey: uploadResult.key,
      }),
    });

    logger.info(`Invoice ${invoiceNumber} generated for order ${orderId}`, {
      url: uploadResult.url,
    });
  });

  await setupWorker("analytics-processing", async (job) => {
    const { type, payload } = job.data;

    switch (type) {
      case "daily-aggregation": {
        const date = payload?.date ?? new Date().toISOString().split("T")[0];
        const startDate = new Date(`${date}T00:00:00Z`);
        const endDate = new Date(`${date}T23:59:59Z`);

        logger.info(`Aggregating daily analytics for ${date}`);

        const pageViewAgg = await db
          .select({
            url: schema.pageViews.url,
            viewCount: count(),
          })
          .from(schema.pageViews)
          .where(
            and(
              gte(schema.pageViews.createdAt, startDate),
              lte(schema.pageViews.createdAt, endDate),
            ),
          )
          .groupBy(schema.pageViews.url);

        logger.info(`Found ${pageViewAgg.length} unique page URLs for ${date}`);

        for (const row of pageViewAgg) {
          await db.insert(schema.analyticsEvents).values({
            name: "daily_page_view_aggregate",
            properties: JSON.stringify({ url: row.url, count: Number(row.viewCount), date }),
            pageUrl: row.url,
          });
        }

        const productViewAgg = await db
          .select({
            url: schema.pageViews.url,
            viewCount: count(),
          })
          .from(schema.pageViews)
          .where(
            and(
              sql`${schema.pageViews.url} LIKE '%/products/%'`,
              gte(schema.pageViews.createdAt, startDate),
              lte(schema.pageViews.createdAt, endDate),
            ),
          )
          .groupBy(schema.pageViews.url);

        for (const row of productViewAgg) {
          const slug = row.url.split("/products/").pop()?.split(/[?#]/)[0] ?? "";
          if (slug) {
            await db
              .update(schema.products)
              .set({
                viewCount: sql`${schema.products.viewCount} + ${Number(row.viewCount)}`,
                updatedAt: new Date(),
              })
              .where(eq(schema.products.slug, slug));
          }
        }

        const eventAgg = await db
          .select({
            name: schema.analyticsEvents.name,
            eventCount: count(),
          })
          .from(schema.analyticsEvents)
          .where(
            and(
              gte(schema.analyticsEvents.createdAt, startDate),
              lte(schema.analyticsEvents.createdAt, endDate),
            ),
          )
          .groupBy(schema.analyticsEvents.name);

        for (const row of eventAgg) {
          await db.insert(schema.analyticsEvents).values({
            name: "daily_event_aggregate",
            properties: JSON.stringify({
              eventName: row.name,
              count: Number(row.eventCount),
              date,
            }),
          });
        }

        logger.info(`Daily analytics aggregation complete for ${date}`, {
          uniqueUrls: pageViewAgg.length,
          productViewsUpdated: productViewAgg.length,
          uniqueEvents: eventAgg.length,
        });
        break;
      }
      default:
        logger.warn(`Unknown analytics processing type: ${type}`);
    }
  });

  await setupWorker("seo-generation", async (job) => {
    const result = await runSeoGeneration();
    logger.info("SEO generation job result", result);
  });

  logger.info("All workers initialized and listening for jobs");
}

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
