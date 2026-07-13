import { Controller, Get, Post, Delete, Body, Param, Query } from "@nestjs/common";
import { SeoService } from "./seo.service";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("seo")
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get()
  async findAll(@Query("entityType") entityType?: string) {
    return this.seoService.findAll(entityType);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get(":entityType/:entityId")
  async findByEntity(
    @Param("entityType") entityType: string,
    @Param("entityId") entityId: string,
  ) {
    return this.seoService.findByEntity(entityType, entityId);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Post()
  async upsert(@Body() dto: {
    entityType: string;
    entityId: string;
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    schema?: string;
  }) {
    return this.seoService.upsert(dto);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.seoService.remove(id);
  }

  @Roles("ADMIN", "SUPER_ADMIN")
  @Post("generate")
  async runGeneration() {
    return this.seoService.runDailyGeneration();
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get("stats")
  async getStats() {
    return this.seoService.getStats();
  }
}
