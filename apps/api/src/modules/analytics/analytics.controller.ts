import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get("overview")
  async getOverview(@Query("range") range: "7d" | "30d" | "90d" = "30d") {
    return this.analyticsService.getOverview(range);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get("top-products")
  async getTopProducts(
    @Query("range") range: "7d" | "30d" | "90d" = "30d",
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.analyticsService.getTopProducts(range, limit);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get("search-terms")
  async getSearchTerms(
    @Query("range") range: "7d" | "30d" | "90d" = "30d",
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.analyticsService.getSearchTerms(range, limit);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get("devices")
  async getDevices(@Query("range") range: "7d" | "30d" | "90d" = "30d") {
    return this.analyticsService.getDevices(range);
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get("seo-stats")
  async getSeoStats() {
    return this.analyticsService.getDashboardSeoStats();
  }

  @Roles("ADMIN", "SUPER_ADMIN", "SEO_MANAGER")
  @Get("weekly-trend")
  async getWeeklyTrend(@Query("days", new DefaultValuePipe(7), ParseIntPipe) days: number) {
    return this.analyticsService.getWeeklyTrend(days);
  }
}
