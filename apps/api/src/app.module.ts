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
import { CouponsModule } from "./modules/coupons/coupons.module";
import { MediaModule } from "./modules/media/media.module";
import { SEOsModule } from "./modules/seo/seo.module";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AIModule } from "./modules/ai/ai.module";
import { UsesModule } from "./modules/uses/uses.module";
import { ComboOffersModule } from "./modules/combo-offers/combo-offers.module";
import { ContactModule } from "./modules/contact/contact.module";
import { AddressesModule } from "./modules/addresses/addresses.module";
import { BulkSalesModule } from "./modules/bulk-sales/bulk-sales.module";
import { ChatModule } from "./modules/chat/chat.module";
import { ReviewsModule } from "./modules/reviews/reviews.module";
import { CartModule } from "./modules/cart/cart.module";
import { ReturnsModule } from "./modules/returns/returns.module";
import { DrizzleModule } from "./database/drizzle.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../../.env", "../../.env.local", ".env", ".env.local"],
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
    CouponsModule,
    MediaModule,
    SEOsModule,
    AnalyticsModule,
    AIModule,
    UsesModule,
    ComboOffersModule,
    ContactModule,
    AddressesModule,
    BulkSalesModule,
    ChatModule,
    ReviewsModule,
    CartModule,
    ReturnsModule,
  ],
})
export class AppModule {}
