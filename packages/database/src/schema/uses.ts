import { uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { catalog } from "./__schemas";

export const uses = catalog.table("uses", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 500 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
