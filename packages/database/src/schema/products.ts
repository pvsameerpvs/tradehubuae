import { pgTable, uuid, varchar, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { conditionEnum } from "./enums";
import { brands } from "./brands";
import { categories } from "./categories";
import { uses } from "./uses";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  shortDescription: text("short_description"),
  description: text("description"),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  barcode: varchar("barcode", { length: 100 }),
  condition: conditionEnum("condition").default("New").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  costPrice: numeric("cost_price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("AED").notNull(),
  weight: numeric("weight", { precision: 8, scale: 2 }),
  width: numeric("width", { precision: 8, scale: 2 }),
  height: numeric("height", { precision: 8, scale: 2 }),
  depth: numeric("depth", { precision: 8, scale: 2 }),
  brandId: uuid("brand_id").references(() => brands.id),
  useId: uuid("use_id").references(() => uses.id),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isBundle: boolean("is_bundle").default(false).notNull(),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  metaKeywords: varchar("meta_keywords", { length: 500 }),
  totalStock: integer("total_stock").default(0).notNull(),
  reservedStock: integer("reserved_stock").default(0).notNull(),
  availableStock: integer("available_stock").default(0).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  saleCount: integer("sale_count").default(0).notNull(),
  ratingAverage: numeric("rating_average", { precision: 3, scale: 2 }),
  ratingCount: integer("rating_count").default(0).notNull(),
  publishedAt: timestamp("published_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const productCategories = pgTable("product_categories", {
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  pk: { primaryKey: { columns: [t.productId, t.categoryId] } },
}));

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  url: varchar("url", { length: 1000 }).notNull(),
  alt: varchar("alt", { length: 500 }),
  width: integer("width"),
  height: integer("height"),
  size: integer("size"),
  format: varchar("format", { length: 20 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const productSpecs = pgTable("product_specs", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 255 }).notNull(),
  value: text("value").notNull(),
  group: varchar("group", { length: 255 }),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  reservedStock: integer("reserved_stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  attributes: text("attributes").array(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
