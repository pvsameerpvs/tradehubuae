import { Injectable, Logger } from "@nestjs/common";
import { ai } from "@tradehubuae/ai";
import type { ProductGenerationInput, SEOContentInput } from "@tradehubuae/ai";

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  async generateProduct(input: ProductGenerationInput) {
    const result = await ai.generateProduct(input);
    this.logger.log("AI product generation completed");
    return result;
  }

  async analyzeImage(base64Image: string, mimeType: string) {
    const result = await ai.analyzeImage(base64Image, mimeType);
    this.logger.log("AI image analysis completed");
    return result;
  }

  async generateSEOContent(input: SEOContentInput) {
    const result = await ai.generateSEOContent(input);
    this.logger.log("AI SEO content generation completed");
    return result;
  }

  async generateCategoryDescription(categoryName: string, products: string[]) {
    return ai.generateCategoryDescription(categoryName, products);
  }
}
