import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logo: varchar("logo", { length: 500 }),
  website: varchar("website", { length: 500 }),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
