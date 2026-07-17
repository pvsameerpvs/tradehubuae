import { pgTable, uuid, varchar, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  properties: jsonb("properties"),
  sessionId: varchar("session_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  pageUrl: varchar("page_url", { length: 1000 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const pageViews = pgTable("page_views", {
  id: uuid("id").defaultRandom().primaryKey(),
  url: varchar("url", { length: 1000 }).notNull(),
  title: varchar("title", { length: 500 }),
  referrer: varchar("referrer", { length: 1000 }),
  sessionId: varchar("session_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  duration: integer("duration"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const searchLogs = pgTable("search_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  query: varchar("query", { length: 500 }).notNull(),
  results: integer("results"),
  filters: jsonb("filters"),
  userId: varchar("user_id", { length: 255 }),
  sessionId: varchar("session_id", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
