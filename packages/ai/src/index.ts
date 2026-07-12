import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { env } from "@tradehubuae/config";
import { logger } from "@tradehubuae/logger";

interface ProductGenerationInput {
  images?: string[];
  model?: string;
  brand?: string;
  category?: string;
  specs?: Record<string, string>;
}

interface ProductGenerationOutput {
  title: string;
  description: string;
  shortDescription: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
    keywords: string[];
  };
  specifications: Record<string, string>[];
  faq: { question: string; answer: string }[];
  tags: string[];
  condition: string;
  suggestedCategory: string;
  suggestedBrand: string;
}

interface ImageAnalysisOutput {
  altText: string;
  description: string;
  quality: "excellent" | "good" | "fair" | "poor";
  qualityIssues: string[];
  detectedObjects: string[];
  dominantColors: string[];
  textDetected?: string;
}

interface SEOContentInput {
  type: "category" | "blog" | "product";
  title: string;
  keywords: string[];
  targetLength?: number;
  existingContent?: string;
}

interface SEOContentOutput {
  metaTitle: string;
  metaDescription: string;
  content: string;
  keywords: string[];
  slug: string;
  schema?: Record<string, unknown>;
}

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private visionModel: GenerativeModel;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.visionModel = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    logger.info("AI service initialized");
  }

  private parseJSONResponse<T>(text: string): T {
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON");
    }
    return JSON.parse(jsonMatch[0]) as T;
  }

  async generateProduct(input: ProductGenerationInput): Promise<ProductGenerationOutput> {
    const prompt = `
      You are an expert ecommerce product manager for TradeHub UAE, a UAE-based IT equipment seller.
      Generate a complete product listing in JSON format.

      Input: ${JSON.stringify(input)}

      Generate:
      - title: SEO-optimized product title (max 70 chars)
      - description: Rich product description (min 300 words) with HTML formatting, highlighting features, benefits, and use cases
      - shortDescription: One-line summary (max 160 chars)
      - seo: { metaTitle, metaDescription, slug, keywords[] }
      - specifications: Array of { label, value } objects with technical specs
      - faq: Array of { question, answer } for common customer questions
      - tags: Array of relevant tags
      - condition: "New", "Like New", "Excellent", "Good", or "Fair"
      - suggestedCategory: Best matching category
      - suggestedBrand: Best matching brand

      Return ONLY valid JSON, no markdown.
    `;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();

    logger.info("AI product generation completed");
    return this.parseJSONResponse<ProductGenerationOutput>(text);
  }

  async analyzeImage(base64Image: string, mimeType: string): Promise<ImageAnalysisOutput> {
    const prompt = `
      Analyze this product image for TradeHub UAE ecommerce platform.
      Return JSON with:
      - altText: SEO-optimized alt text
      - description: Detailed image description
      - quality: "excellent" | "good" | "fair" | "poor"
      - qualityIssues: Array of issues if quality is not excellent
      - detectedObjects: Array of detected objects
      - dominantColors: Array of dominant colors
      - textDetected: Any text visible in the image
    `;

    const imagePart = {
      inlineData: { data: base64Image, mimeType },
    };

    const result = await this.visionModel.generateContent([prompt, imagePart]);
    const text = result.response.text();

    return this.parseJSONResponse<ImageAnalysisOutput>(text);
  }

  async generateSEOContent(input: SEOContentInput): Promise<SEOContentOutput> {
    const prompt = `
      You are an SEO expert for TradeHub UAE, a UAE IT equipment ecommerce platform.
      Generate SEO-optimized ${input.type} content.

      Input: ${JSON.stringify(input)}

      Generate JSON with:
      - metaTitle: SEO meta title (max 60 chars)
      - metaDescription: Meta description (max 160 chars)
      - content: Rich HTML content tailored for UAE audience, including local context
      - keywords: Array of target keywords
      - slug: SEO-friendly URL slug
      - schema: Schema.org JSON-LD if applicable

      Return ONLY valid JSON.
    `;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();

    logger.info("AI SEO content generation completed", { type: input.type });
    return this.parseJSONResponse<SEOContentOutput>(text);
  }

  async generateCategoryDescription(categoryName: string, products: string[]): Promise<SEOContentOutput> {
    return this.generateSEOContent({
      type: "category",
      title: categoryName,
      keywords: products,
    });
  }

  async suggestRelatedProducts(
    productName: string,
    specs: Record<string, string>,
    inventory: string[],
  ): Promise<string[]> {
    const prompt = `
      Given a product "${productName}" with specs: ${JSON.stringify(specs)}
      Suggest 4 related products from this inventory list: ${JSON.stringify(inventory)}
      Consider complementary items, upgrades, and accessories.
      Return as JSON array of product names.
    `;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    return this.parseJSONResponse<string[]>(text);
  }
}

export const ai = new AIService();
export type {
  ProductGenerationInput,
  ProductGenerationOutput,
  ImageAnalysisOutput,
  SEOContentInput,
  SEOContentOutput,
};
