-- Schema audit fixes: stock dedup, SEO consolidation, onDelete, types, enums, indexes

-- 1. Remove denormalized stock columns from products (duplicated in stock table)
ALTER TABLE "products" DROP COLUMN "total_stock";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "reserved_stock";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "available_stock";--> statement-breakpoint

-- 2. Remove redundant available column from stock (available = quantity - reserved)
ALTER TABLE "stock" DROP COLUMN "available";--> statement-breakpoint

-- 3. Remove inline SEO columns (consolidated in seo_metadata table)
ALTER TABLE "products" DROP COLUMN "seo_title";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "seo_description";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "meta_keywords";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "seo_title";--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "seo_description";--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN "seo_title";--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN "seo_description";--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN "meta_keywords";--> statement-breakpoint

-- 4. Create emirate enum for UAE addresses
CREATE TYPE "public"."emirate" AS ENUM('Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah');--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "emirate" SET DATA TYPE "public"."emirate" USING "emirate"::"public"."emirate";--> statement-breakpoint

-- 5. Make stock_history.variant_id nullable (product may not have variants)
ALTER TABLE "stock_history" ALTER COLUMN "variant_id" DROP NOT NULL;--> statement-breakpoint

-- 6. Change returns.items text -> jsonb
ALTER TABLE "returns" ALTER COLUMN "items" TYPE jsonb USING CASE WHEN "items" IS NULL OR "items" = '' THEN NULL ELSE "items"::jsonb END;--> statement-breakpoint

-- 7. Change payments.gateway_response text -> jsonb
ALTER TABLE "payments" ALTER COLUMN "gateway_response" TYPE jsonb USING CASE WHEN "gateway_response" IS NULL OR "gateway_response" = '' THEN NULL ELSE "gateway_response"::jsonb END;--> statement-breakpoint

-- 8. Add userId FK to bulk_requests
ALTER TABLE "bulk_requests" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "bulk_requests" ADD CONSTRAINT "bulk_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- 9. Replace cart_items unique constraint with partial unique indexes (handles NULL variant)
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_user_id_product_id_variant_id_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "cart_user_product_variant_unq" ON "cart_items" ("user_id", "product_id", "variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cart_user_product_null_unq" ON "cart_items" ("user_id", "product_id") WHERE "variant_id" IS NULL;--> statement-breakpoint

-- 10. Add missing indexes on common query paths
CREATE INDEX "reviews_product_id_idx" ON "reviews" ("product_id");--> statement-breakpoint
CREATE INDEX "reviews_user_id_idx" ON "reviews" ("user_id");--> statement-breakpoint
CREATE INDEX "order_items_order_id_idx" ON "order_items" ("order_id");--> statement-breakpoint
CREATE INDEX "payments_order_id_idx" ON "payments" ("order_id");--> statement-breakpoint
CREATE INDEX "shipments_order_id_idx" ON "shipments" ("order_id");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" ("user_id");--> statement-breakpoint

-- 11. Fix onDelete constraints — stock
ALTER TABLE "stock" DROP CONSTRAINT "stock_warehouse_id_warehouses_id_fk";--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "stock_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock" DROP CONSTRAINT "stock_variant_id_product_variants_id_fk";--> statement-breakpoint
ALTER TABLE "stock" ADD CONSTRAINT "stock_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- 12. Fix onDelete constraints — stock_history
ALTER TABLE "stock_history" DROP CONSTRAINT "stock_history_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_history" DROP CONSTRAINT "stock_history_variant_id_product_variants_id_fk";--> statement-breakpoint
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_history" DROP CONSTRAINT "stock_history_warehouse_id_warehouses_id_fk";--> statement-breakpoint
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint

-- 13. Fix onDelete constraints — stock_transfers
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_from_warehouse_id_warehouses_id_fk";--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_from_warehouse_id_warehouses_id_fk" FOREIGN KEY ("from_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfers" DROP CONSTRAINT "stock_transfers_to_warehouse_id_warehouses_id_fk";--> statement-breakpoint
ALTER TABLE "stock_transfers" ADD CONSTRAINT "stock_transfers_to_warehouse_id_warehouses_id_fk" FOREIGN KEY ("to_warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint

-- 14. Fix onDelete constraints — stock_transfer_items
ALTER TABLE "stock_transfer_items" DROP CONSTRAINT "stock_transfer_items_variant_id_product_variants_id_fk";--> statement-breakpoint
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint

-- 15. Fix onDelete constraints — orders
ALTER TABLE "orders" DROP CONSTRAINT "orders_shipping_address_id_addresses_id_fk";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_addresses_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_billing_address_id_addresses_id_fk";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_billing_address_id_addresses_id_fk" FOREIGN KEY ("billing_address_id") REFERENCES "public"."addresses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

-- 16. Fix onDelete constraints — order_items
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_variant_id_product_variants_id_fk";--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

-- 17. Fix onDelete constraints — payments, shipments, returns
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_orders_id_fk";--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_order_id_orders_id_fk";--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" DROP CONSTRAINT "returns_order_id_orders_id_fk";--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint

-- 18. Fix onDelete constraints — cart_items
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_variant_id_product_variants_id_fk";--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

-- 19. Fix onDelete constraints — reviews
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- 20. Fix onDelete constraints — combo_offer_items
ALTER TABLE "combo_offer_items" DROP CONSTRAINT "combo_offer_items_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "combo_offer_items" ADD CONSTRAINT "combo_offer_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- 21. Fix onDelete constraints — bulk_request_items
ALTER TABLE "bulk_request_items" DROP CONSTRAINT "bulk_request_items_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "bulk_request_items" ADD CONSTRAINT "bulk_request_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint

-- 22. Fix onDelete constraints — notifications
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_order_id_orders_id_fk";--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- 23. Fix onDelete constraints — chat
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_admin_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" DROP CONSTRAINT "chat_sessions_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" DROP CONSTRAINT "chat_sessions_assigned_admin_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_assigned_admin_id_users_id_fk" FOREIGN KEY ("assigned_admin_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" DROP CONSTRAINT "chat_sessions_closed_by_users_id_fk";--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_closed_by_users_id_fk" FOREIGN KEY ("closed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint

-- 24. Fix onDelete constraints — remaining FKs (brands, uses, inventory_logs, blog_posts, orders, bulk_requests, wishlist)
ALTER TABLE "products" DROP CONSTRAINT "products_brand_id_brands_id_fk";--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_use_id_uses_id_fk";--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_use_id_uses_id_fk" FOREIGN KEY ("use_id") REFERENCES "public"."uses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_logs" DROP CONSTRAINT "inventory_logs_warehouse_id_warehouses_id_fk";--> statement-breakpoint
ALTER TABLE "inventory_logs" ADD CONSTRAINT "inventory_logs_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_author_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bulk_requests" DROP CONSTRAINT "bulk_requests_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "bulk_requests" ADD CONSTRAINT "bulk_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_product_id_products_id_fk";--> statement-breakpoint
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- 25. Fix text->jsonb for analytics and notifications
ALTER TABLE "analytics_events" ALTER COLUMN "properties" TYPE jsonb USING CASE WHEN "properties" IS NULL OR "properties" = '' THEN NULL ELSE "properties"::jsonb END;--> statement-breakpoint
ALTER TABLE "search_logs" ALTER COLUMN "filters" TYPE jsonb USING CASE WHEN "filters" IS NULL OR "filters" = '' THEN NULL ELSE "filters"::jsonb END;--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "metadata" TYPE jsonb USING CASE WHEN "metadata" IS NULL OR "metadata" = '' THEN NULL ELSE "metadata"::jsonb END;--> statement-breakpoint

-- 26. Fix warehouses.emirate to use emirate enum
ALTER TABLE "warehouses" ALTER COLUMN "emirate" SET DATA TYPE "public"."emirate" USING "emirate"::"public"."emirate";--> statement-breakpoint

-- 27. Add missing timestamps to order_items
ALTER TABLE "order_items" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint

-- 28. Add additional high-priority indexes
CREATE INDEX "order_items_product_id_idx" ON "order_items" ("product_id");--> statement-breakpoint
CREATE INDEX "product_variants_product_id_idx" ON "product_variants" ("product_id");--> statement-breakpoint
CREATE INDEX "addresses_user_id_idx" ON "addresses" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" ("user_id");
