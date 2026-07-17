import { uuid, varchar, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { marketing } from "./__schemas";
import { products } from "./products";
import { users } from "./users";

export const bulkRequests = marketing.table("bulk_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const bulkRequestItems = marketing.table("bulk_request_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  bulkRequestId: uuid("bulk_request_id").notNull().references(() => bulkRequests.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  targetPrice: numeric("target_price", { precision: 10, scale: 2 }),
});
