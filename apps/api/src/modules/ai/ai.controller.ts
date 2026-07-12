import { Controller, Post, Body } from "@nestjs/common";
import { AIService } from "./ai.service";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("ai")
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Post("generate-product")
  async generateProduct(@Body() input: any) {
    return this.aiService.generateProduct(input);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "CONTENT_MANAGER")
  @Post("analyze-image")
  async analyzeImage(@Body() body: { image: string; mimeType: string }) {
    return this.aiService.analyzeImage(body.image, body.mimeType);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Post("generate-seo")
  async generateSEO(@Body() input: any) {
    return this.aiService.generateSEOContent(input);
  }
}
