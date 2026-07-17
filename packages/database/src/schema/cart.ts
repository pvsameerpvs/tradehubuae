import { uuid, integer, timestamp, uniqueIndex, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { sales } from "./__schemas";
import { users } from "./users";
import { products, productVariants } from "./products";

export const cartItems = sales.table("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex("cart_user_product_variant_unq").on(t.userId, t.productId, t.variantId),
  uniqueIndex("cart_user_product_null_unq").on(t.userId, t.productId).where(sql`${t.variantId} IS NULL`),
]);

export const wishlistItems = sales.table("wishlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.userId, t.productId),
}));
