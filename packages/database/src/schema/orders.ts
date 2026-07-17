import { index, pgTable, uuid, varchar, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
import { orderStatusEnum, paymentStatusEnum } from "./enums";
import { users } from "./users";
import { products, productVariants } from "./products";
import { addresses } from "./addresses";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0").notNull(),
  taxAmount: numeric("tax_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("AED").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: paymentStatusEnum("payment_status").default("PENDING").notNull(),
  shippingMethod: varchar("shipping_method", { length: 100 }),
  contactName: varchar("contact_name", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  shippingAddressId: uuid("shipping_address_id").references(() => addresses.id),
  shippingAddress: jsonb("shipping_address"),
  billingAddressId: uuid("billing_address_id").references(() => addresses.id),
  billingAddress: jsonb("billing_address"),
  notes: text("notes"),
  couponCode: varchar("coupon_code", { length: 50 }),
  isBulkOrder: boolean("is_bulk_order").default(false).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  estimatedDeliveryDate: timestamp("estimated_delivery_date", { mode: "date" }),
  shippedAt: timestamp("shipped_at", { mode: "date" }),
  deliveredAt: timestamp("delivered_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => [
  index("orders_user_id_idx").on(t.userId),
  index("orders_status_idx").on(t.status),
  index("orders_created_at_idx").on(t.createdAt),
  index("orders_payment_status_idx").on(t.paymentStatus),
]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  variantId: uuid("variant_id").references(() => productVariants.id),
  name: varchar("name", { length: 500 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  image: varchar("image", { length: 1000 }),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("AED").notNull(),
  method: varchar("method", { length: 50 }).notNull(),
  status: paymentStatusEnum("status").default("PENDING").notNull(),
  transactionId: varchar("transaction_id", { length: 255 }),
  gatewayResponse: text("gateway_response"),
  paidAt: timestamp("paid_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const shipments = pgTable("shipments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  trackingNumber: varchar("tracking_number", { length: 255 }).notNull().unique(),
  carrier: varchar("carrier", { length: 100 }),
  method: varchar("method", { length: 100 }),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(),
  estimatedDelivery: timestamp("estimated_delivery", { mode: "date" }),
  shippedAt: timestamp("shipped_at", { mode: "date" }),
  deliveredAt: timestamp("delivered_at", { mode: "date" }),
  address: text("address"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const returns = pgTable("returns", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(),
  items: text("items"),
  refundAmount: numeric("refund_amount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
