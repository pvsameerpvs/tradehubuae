import { pgTable, uuid, varchar, text, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./users";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  pros: text("pros"),
  cons: text("cons"),
  isVerified: boolean("is_verified").default(false).notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.userId, t.productId),
}));
