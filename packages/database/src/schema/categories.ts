import { foreignKey, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { catalog } from "./__schemas";

export const categories = catalog.table("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 500 }),
  parentId: uuid("parent_id"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  parentFk: foreignKey({ columns: [t.parentId], foreignColumns: [t.id] }).onDelete("set null"),
}));

export const categoryAttributes = catalog.table("category_attributes", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).default("text").notNull(),
  required: boolean("required").default(false).notNull(),
  options: text("options").array(),
  sortOrder: integer("sort_order").default(0).notNull(),
});
