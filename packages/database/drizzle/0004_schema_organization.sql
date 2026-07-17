-- Domain schema organization: split public tables into logical schemas

-- 1. Create domain schemas
CREATE SCHEMA IF NOT EXISTS "catalog";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "inventory";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "sales";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "marketing";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "content";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "communication";--> statement-breakpoint
CREATE SCHEMA IF NOT EXISTS "analytics";--> statement-breakpoint

-- 2. Move condition enum to catalog schema
ALTER TYPE "condition" SET SCHEMA "catalog";--> statement-breakpoint

-- 3. Move catalog tables
ALTER TABLE "categories" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "category_attributes" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "brands" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "uses" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "products" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "product_categories" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "product_images" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "product_specs" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "product_variants" SET SCHEMA "catalog";--> statement-breakpoint
ALTER TABLE "reviews" SET SCHEMA "catalog";--> statement-breakpoint

-- 4. Move inventory tables
ALTER TABLE "warehouses" SET SCHEMA "inventory";--> statement-breakpoint
ALTER TABLE "stock" SET SCHEMA "inventory";--> statement-breakpoint
ALTER TABLE "stock_history" SET SCHEMA "inventory";--> statement-breakpoint
ALTER TABLE "stock_transfers" SET SCHEMA "inventory";--> statement-breakpoint
ALTER TABLE "stock_transfer_items" SET SCHEMA "inventory";--> statement-breakpoint
ALTER TABLE "inventory_logs" SET SCHEMA "inventory";--> statement-breakpoint

-- 5. Move sales tables
ALTER TABLE "orders" SET SCHEMA "sales";--> statement-breakpoint
ALTER TABLE "order_items" SET SCHEMA "sales";--> statement-breakpoint
ALTER TABLE "payments" SET SCHEMA "sales";--> statement-breakpoint
ALTER TABLE "shipments" SET SCHEMA "sales";--> statement-breakpoint
ALTER TABLE "returns" SET SCHEMA "sales";--> statement-breakpoint
ALTER TABLE "cart_items" SET SCHEMA "sales";--> statement-breakpoint
ALTER TABLE "wishlist_items" SET SCHEMA "sales";--> statement-breakpoint

-- 6. Move marketing tables
ALTER TABLE "coupons" SET SCHEMA "marketing";--> statement-breakpoint
ALTER TABLE "coupon_products" SET SCHEMA "marketing";--> statement-breakpoint
ALTER TABLE "combo_offers" SET SCHEMA "marketing";--> statement-breakpoint
ALTER TABLE "combo_offer_items" SET SCHEMA "marketing";--> statement-breakpoint
ALTER TABLE "bulk_requests" SET SCHEMA "marketing";--> statement-breakpoint
ALTER TABLE "bulk_request_items" SET SCHEMA "marketing";--> statement-breakpoint

-- 7. Move content tables
ALTER TABLE "blog_posts" SET SCHEMA "content";--> statement-breakpoint
ALTER TABLE "blog_post_products" SET SCHEMA "content";--> statement-breakpoint
ALTER TABLE "blog_tags" SET SCHEMA "content";--> statement-breakpoint
ALTER TABLE "blog_post_tags" SET SCHEMA "content";--> statement-breakpoint
ALTER TABLE "seo_metadata" SET SCHEMA "content";--> statement-breakpoint
ALTER TABLE "redirects" SET SCHEMA "content";--> statement-breakpoint

-- 8. Move communication tables
ALTER TABLE "chat_sessions" SET SCHEMA "communication";--> statement-breakpoint
ALTER TABLE "chat_messages" SET SCHEMA "communication";--> statement-breakpoint

-- 9. Move analytics tables
ALTER TABLE "analytics_events" SET SCHEMA "analytics";--> statement-breakpoint
ALTER TABLE "page_views" SET SCHEMA "analytics";--> statement-breakpoint
ALTER TABLE "search_logs" SET SCHEMA "analytics";
