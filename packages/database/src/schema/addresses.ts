import { pgTable, uuid, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: varchar("city", { length: 255 }).notNull(),
  emirate: varchar("emirate", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }).default("UAE").notNull(),
  zipCode: varchar("zip_code", { length: 20 }),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
