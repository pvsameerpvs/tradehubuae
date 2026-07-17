import { uuid, varchar, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { marketing } from "./__schemas";
import { products } from "./products";

export const coupons = marketing.table("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }),
  maxDiscount: numeric("max_discount", { precision: 10, scale: 2 }),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  startsAt: timestamp("starts_at", { mode: "date" }),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const couponProducts = marketing.table("coupon_products", {
  couponId: uuid("coupon_id").notNull().references(() => coupons.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
}, (t) => ({
  primaryKey: { columns: [t.couponId, t.productId] },
}));

export const comboOffers = marketing.table("combo_offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  discountType: varchar("discount_type", { length: 50 }).notNull(),
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  image: varchar("image", { length: 500 }),
  isActive: boolean("is_active").default(true).notNull(),
  startsAt: timestamp("starts_at", { mode: "date" }),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const comboOfferItems = marketing.table("combo_offer_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  offerId: uuid("offer_id").notNull().references(() => comboOffers.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(1).notNull(),
});
