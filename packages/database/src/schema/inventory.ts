import { index, uuid, varchar, text, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { products, productVariants } from "./products";
import { emirateEnum } from "./enums";
import { inventory } from "./__schemas";

export const warehouses = inventory.table("warehouses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  address: text("address"),
  city: varchar("city", { length: 255 }),
  emirate: emirateEnum("emirate"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const stock = inventory.table("stock", {
  id: uuid("id").defaultRandom().primaryKey(),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id, { onDelete: "restrict" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(0).notNull(),
  reserved: integer("reserved").default(0).notNull(),
  minimumStock: integer("minimum_stock").default(0).notNull(),
  maximumStock: integer("maximum_stock"),
  location: varchar("location", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.warehouseId, t.productId, t.variantId),
}));

export const stockHistory = inventory.table("stock_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id, { onDelete: "restrict" }),
  type: varchar("type", { length: 50 }).notNull(),
  quantity: integer("quantity").notNull(),
  reference: varchar("reference", { length: 255 }),
  referenceId: varchar("reference_id", { length: 255 }),
  note: text("note"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => [
  index("stock_history_product_idx").on(t.productId),
  index("stock_history_variant_idx").on(t.variantId),
  index("stock_history_created_at_idx").on(t.createdAt),
]);

export const stockTransfers = inventory.table("stock_transfers", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromWarehouseId: uuid("from_warehouse_id").notNull().references(() => warehouses.id, { onDelete: "restrict" }),
  toWarehouseId: uuid("to_warehouse_id").notNull().references(() => warehouses.id, { onDelete: "restrict" }),
  referenceNumber: varchar("reference_number", { length: 100 }).notNull().unique(),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const stockTransferItems = inventory.table("stock_transfer_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  transferId: uuid("transfer_id").notNull().references(() => stockTransfers.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
});

export const inventoryLogs = inventory.table("inventory_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  warehouseId: uuid("warehouse_id").notNull().references(() => warehouses.id, { onDelete: "restrict" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }),
  details: text("details").array(),
  performedBy: varchar("performed_by", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
