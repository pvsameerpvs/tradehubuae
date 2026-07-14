import { generateObject, type LanguageModelV1 } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { env } from "@tradehubuae/config";
import { logger } from "@tradehubuae/logger";

// ---- System Prompts ----

const PRODUCT_SYSTEM_PROMPT = `You are an expert ecommerce product manager for TradeHub UAE, a UAE-based IT equipment seller.
Generate a complete product listing in the exact JSON schema provided.

Product specifications:
- title: SEO-optimized product title (max 70 chars)
- description: Rich product description (min 300 words) with HTML formatting, highlighting features, benefits, and use cases
- shortDescription: One-line summary (max 160 chars)
- seo: { metaTitle, metaDescription, slug, keywords[] }
- specifications: Array of { label, value } objects with technical specs
- faq: Array of { question, answer } for common customer questions
- tags: Array of relevant tags
- condition: "New", "Like New", "Excellent", "Good", or "Fair"
- suggestedCategory: Best matching category
- suggestedBrand: Best matching brand`;

const IMAGE_ANALYSIS_SYSTEM_PROMPT = `Analyze this product image for TradeHub UAE ecommerce platform.
Return valid JSON matching the schema exactly.`;

const IMAGE_ANALYSIS_USER_PROMPT = `Analyze this product image. Return JSON with:
- altText: SEO-optimized alt text
- description: Detailed image description
- quality: "excellent" | "good" | "fair" | "poor"
- qualityIssues: Array of issues if quality is not excellent
- detectedObjects: Array of detected objects
- dominantColors: Array of dominant colors
- textDetected: Any text visible in the image`;

function seoSystemPrompt(type: string): string {
  return `You are an SEO expert for TradeHub UAE, a UAE IT equipment ecommerce platform.
Generate SEO-optimized ${type} content in the exact JSON schema provided.

Fields:
- metaTitle: SEO meta title (max 60 chars)
- metaDescription: Meta description (max 160 chars)
- content: Rich HTML content tailored for UAE audience, including local context
- keywords: Array of target keywords
- slug: SEO-friendly URL slug
- schema: Schema.org JSON-LD if applicable`;
}

const RELATED_PRODUCTS_SYSTEM_PROMPT = `You are a product recommendation expert for TradeHub UAE.
Suggest 4 related products from the given inventory list.
Consider complementary items, upgrades, and accessories.
Return a JSON array of product names only.`;

// ---- Input Types ----

export interface ProductGenerationInput {
  images?: string[];
  model?: string;
  brand?: string;
  category?: string;
  specs?: Record<string, string>;
}

export interface SEOContentInput {
  type: "category" | "blog" | "product";
  title: string;
  keywords: string[];
  targetLength?: number;
  existingContent?: string;
}

// ---- Zod Output Schemas ----

const productOutputSchema = z.object({
  title: z.string().max(70),
  description: z.string().min(300),
  shortDescription: z.string().max(160),
  seo: z.object({
    metaTitle: z.string().max(60),
    metaDescription: z.string().max(160),
    slug: z.string(),
    keywords: z.array(z.string()),
  }),
  specifications: z.array(z.object({ label: z.string(), value: z.string() })),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
  tags: z.array(z.string()),
  condition: z.enum(["New", "Like New", "Excellent", "Good", "Fair"]),
  suggestedCategory: z.string(),
  suggestedBrand: z.string(),
});

const imageAnalysisSchema = z.object({
  altText: z.string(),
  description: z.string(),
  quality: z.enum(["excellent", "good", "fair", "poor"]),
  qualityIssues: z.array(z.string()),
  detectedObjects: z.array(z.string()),
  dominantColors: z.array(z.string()),
  textDetected: z.string().optional(),
});

const seoContentOutputSchema = z.object({
  metaTitle: z.string().max(60),
  metaDescription: z.string().max(160),
  content: z.string(),
  keywords: z.array(z.string()),
  slug: z.string(),
  schema: z.record(z.unknown()).optional(),
});

const relatedProductsSchema = z.array(z.string());

// ---- Output Types ----

export type ProductGenerationOutput = z.infer<typeof productOutputSchema>;
export type ImageAnalysisOutput = z.infer<typeof imageAnalysisSchema>;
export type SEOContentOutput = z.infer<typeof seoContentOutputSchema>;

// ---- Provider Registry ----

type ModelProvider = (modelId: string) => LanguageModelV1;

interface ProviderConfig {
  create: (opts: { apiKey: string; baseURL?: string }) => ModelProvider;
  defaultModel: string;
  defaultVisionModel: string;
  supportsVision: boolean;
}

const providers: Record<string, ProviderConfig> = {
  google: {
    create: ({ apiKey }) =>
      createGoogleGenerativeAI({ apiKey }) as unknown as ModelProvider,
    defaultModel: "gemini-1.5-pro",
    defaultVisionModel: "gemini-1.5-flash",
    supportsVision: true,
  },
  openai: {
    create: ({ apiKey }) =>
      createOpenAI({ apiKey }) as unknown as ModelProvider,
    defaultModel: "gpt-4o",
    defaultVisionModel: "gpt-4o-mini",
    supportsVision: true,
  },
  anthropic: {
    create: ({ apiKey }) =>
      createAnthropic({ apiKey }) as unknown as ModelProvider,
    defaultModel: "claude-3-5-sonnet-20241022",
    defaultVisionModel: "claude-3-5-sonnet-20241022",
    supportsVision: true,
  },
  "openai-compatible": {
    create: ({ apiKey, baseURL }) =>
      createOpenAI({ apiKey, baseURL }) as unknown as ModelProvider,
    defaultModel: "gpt-4o",
    defaultVisionModel: "gpt-4o-mini",
    supportsVision: true,
  },
};

// ---- Lazy Provider ----

let _provider: ModelProvider | null = null;
let _config: ProviderConfig | null = null;

function ensureProvider(): { provider: ModelProvider; config: ProviderConfig } {
  if (!_provider || !_config) {
    const name = env.AI_PROVIDER;
    const resolved = providers[name];

    if (!resolved) {
      const available = Object.keys(providers).join(", ");
      throw new Error(
        `Unknown AI_PROVIDER "${name}". Available: ${available}. ` +
          `Set AI_PROVIDER in your .env file.`,
      );
    }

    _config = resolved;
    _provider = _config.create({
      apiKey: env.AI_API_KEY,
      baseURL: env.AI_BASE_URL,
    });

    logger.info("AI service initialized", { provider: name });
  }

  return { provider: _provider, config: _config };
}

function getModel(modelName?: string): LanguageModelV1 {
  const { provider, config } = ensureProvider();
  return provider(modelName ?? (env.AI_MODEL || config.defaultModel));
}

function getVisionModel(modelName?: string): LanguageModelV1 {
  const { provider, config } = ensureProvider();
  return provider(modelName ?? (env.AI_VISION_MODEL || config.defaultVisionModel));
}

// ---- Helpers ----

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

// ---- Service Functions ----

async function generateProduct(input: ProductGenerationInput): Promise<ProductGenerationOutput> {
  try {
    const { object } = await generateObject({
      model: getModel(),
      schema: productOutputSchema,
      system: PRODUCT_SYSTEM_PROMPT,
      prompt: JSON.stringify(input),
    });

    logger.info("AI product generation completed");
    return object;
  } catch (error) {
    logger.error("AI product generation failed", toError(error));
    throw new Error(`Failed to generate product: ${toError(error).message}`);
  }
}

async function analyzeImage(base64Image: string, mimeType: string): Promise<ImageAnalysisOutput> {
  const { config } = ensureProvider();

  if (!config.supportsVision) {
    logger.warn("Current AI provider does not support vision, falling back to text-only analysis");
  }

  try {
    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: string }
    > = [{ type: "text", text: IMAGE_ANALYSIS_USER_PROMPT }];

    if (config.supportsVision) {
      content.push({
        type: "image",
        image: `data:${mimeType};base64,${base64Image}`,
      });
    }

    const { object } = await generateObject({
      model: getVisionModel(),
      schema: imageAnalysisSchema,
      system: IMAGE_ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    logger.info("AI image analysis completed");
    return object;
  } catch (error) {
    logger.error("AI image analysis failed", toError(error));
    throw new Error(`Failed to analyze image: ${toError(error).message}`);
  }
}

async function generateSEOContent(input: SEOContentInput): Promise<SEOContentOutput> {
  try {
    const prompt = [
      `Type: ${input.type}`,
      `Title: ${input.title}`,
      `Keywords: ${input.keywords.join(", ")}`,
      input.targetLength ? `Target Length: ${input.targetLength}` : "",
      input.existingContent ? `Existing Content: ${input.existingContent}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const { object } = await generateObject({
      model: getModel(),
      schema: seoContentOutputSchema,
      system: seoSystemPrompt(input.type),
      prompt,
    });

    logger.info("AI SEO content generation completed", { type: input.type });
    return object;
  } catch (error) {
    logger.error("AI SEO content generation failed", toError(error), { type: input.type });
    throw new Error(`Failed to generate SEO content: ${toError(error).message}`);
  }
}

async function generateCategoryDescription(
  categoryName: string,
  products: string[],
): Promise<SEOContentOutput> {
  return generateSEOContent({
    type: "category",
    title: categoryName,
    keywords: products,
  });
}

async function suggestRelatedProducts(
  productName: string,
  specs: Record<string, string>,
  inventory: string[],
): Promise<string[]> {
  try {
    const prompt = [
      `Product: "${productName}"`,
      `Specs: ${JSON.stringify(specs)}`,
      `Available Inventory: ${JSON.stringify(inventory)}`,
    ].join("\n");

    const { object } = await generateObject({
      model: getVisionModel(),
      schema: relatedProductsSchema,
      system: RELATED_PRODUCTS_SYSTEM_PROMPT,
      prompt,
    });

    return object;
  } catch (error) {
    logger.error("AI related products suggestion failed", toError(error));
    throw new Error(`Failed to suggest related products: ${toError(error).message}`);
  }
}

// ---- Singleton Export ----

export const ai = {
  generateProduct,
  analyzeImage,
  generateSEOContent,
  generateCategoryDescription,
  suggestRelatedProducts,
};
