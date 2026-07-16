import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ProductsModule } from "./modules/products/products.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { BrandsModule } from "./modules/brands/brands.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { CouponsModule } from "./modules/coupons/coupons.module";
import { MediaModule } from "./modules/media/media.module";
import { SEOsModule } from "./modules/seo/seo.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AIModule } from "./modules/ai/ai.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { UsesModule } from "./modules/uses/uses.module";
import { ComboOffersModule } from "./modules/combo-offers/combo-offers.module";
import { ContactModule } from "./modules/contact/contact.module";
import { DrizzleModule } from "./database/drizzle.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DrizzleModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    InventoryModule,
    OrdersModule,
    CustomersModule,
    ReviewsModule,
    CouponsModule,
    MediaModule,
    SEOsModule,
    AnalyticsModule,
    AIModule,
    NotificationsModule,
    ReportsModule,
    UsesModule,
    ComboOffersModule,
    ContactModule,
  ],
})
export class AppModule {}
