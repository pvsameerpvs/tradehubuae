import { uuid, varchar, text, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { content } from "./__schemas";

export const seoMetadata = content.table("seo_metadata", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  keywords: varchar("keywords", { length: 500 }),
  ogImage: varchar("og_image", { length: 500 }),
  schema: text("schema"),
  priority: text("priority"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.entityType, t.entityId),
}));

export const redirects = content.table("redirects", {
  id: uuid("id").defaultRandom().primaryKey(),
  from: varchar("from", { length: 500 }).notNull().unique(),
  to: varchar("to", { length: 500 }).notNull(),
  statusCode: text("status_code").default("301").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
