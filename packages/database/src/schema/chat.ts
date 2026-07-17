import { index, pgTable, uuid, varchar, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  userName: varchar("user_name", { length: 255 }).notNull(),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  userPhone: varchar("user_phone", { length: 50 }),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  productContext: jsonb("product_context"),
  source: varchar("source", { length: 20 }).default("web").notNull(),
  assignedAdminId: uuid("assigned_admin_id").references(() => users.id, { onDelete: "set null" }),
  assignedAdminName: varchar("assigned_admin_name", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  lastMessageAt: timestamp("last_message_at", { mode: "date" }).defaultNow().notNull(),
  closedAt: timestamp("closed_at", { mode: "date" }),
  closedBy: uuid("closed_by").references(() => users.id, { onDelete: "set null" }),
  metadata: jsonb("metadata"),
}, (t) => [
  index("chat_sessions_status_idx").on(t.status),
  index("chat_sessions_user_id_idx").on(t.userId),
  index("chat_sessions_last_message_idx").on(t.lastMessageAt),
]);

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
  senderType: varchar("sender_type", { length: 20 }).notNull(),
  adminId: uuid("admin_id").references(() => users.id, { onDelete: "set null" }),
  messageType: varchar("message_type", { length: 20 }).default("text").notNull(),
  content: text("content").notNull(),
  attachmentUrl: varchar("attachment_url", { length: 1000 }),
  attachmentName: varchar("attachment_name", { length: 255 }),
  attachmentSize: integer("attachment_size"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  readAt: timestamp("read_at", { mode: "date" }),
}, (t) => [
  index("chat_messages_session_id_idx").on(t.sessionId),
  index("chat_messages_created_at_idx").on(t.createdAt),
]);
