import { pgTable, uuid, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { users } from "./users";
import { products, productVariants } from "./products";

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  variantId: uuid("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.userId, t.productId, t.variantId),
}));

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.userId, t.productId),
}));
