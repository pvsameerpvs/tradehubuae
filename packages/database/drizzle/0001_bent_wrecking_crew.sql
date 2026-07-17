ALTER TABLE "stock_history" ADD COLUMN "product_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_address" jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "billing_address" jsonb;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_history" ADD CONSTRAINT "stock_history_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_active_idx" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "products_featured_idx" ON "products" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "products_brand_id_idx" ON "products" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "stock_history_product_idx" ON "stock_history" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "stock_history_variant_idx" ON "stock_history" USING btree ("variant_id");--> statement-breakpoint
CREATE INDEX "stock_history_created_at_idx" ON "stock_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_payment_status_idx" ON "orders" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "chat_messages_session_id_idx" ON "chat_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "chat_messages_created_at_idx" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "chat_sessions_status_idx" ON "chat_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_sessions_user_id_idx" ON "chat_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "chat_sessions_last_message_idx" ON "chat_sessions" USING btree ("last_message_at");--> statement-breakpoint
ALTER TABLE "blog_tags" ADD CONSTRAINT "blog_tags_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "public"."products" ALTER COLUMN "condition" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."condition";--> statement-breakpoint
CREATE TYPE "public"."condition" AS ENUM('New', 'Like New', 'Excellent', 'Good', 'Fair');--> statement-breakpoint
ALTER TABLE "public"."products" ALTER COLUMN "condition" SET DATA TYPE "public"."condition" USING "condition"::"public"."condition";