import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "SUPER_ADMIN",
  "ADMIN",
  "INVENTORY_MANAGER",
  "SALES_MANAGER",
  "CONTENT_MANAGER",
  "SEO_MANAGER",
  "CUSTOMER",
]);

export const conditionEnum = pgEnum("condition", [
  "New",
  "Like New",
  "Excellent",
  "Good",
  "Fair",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);
