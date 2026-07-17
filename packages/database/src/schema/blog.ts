import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { products } from "./products";

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  image: varchar("image", { length: 500 }),
  authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  publishedAt: timestamp("published_at", { mode: "date" }),
  isPublished: boolean("is_published").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const blogPostProducts = pgTable("blog_post_products", {
  blogPostId: uuid("blog_post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
}, (t) => ({
  primaryKey: { columns: [t.blogPostId, t.productId] },
}));

export const blogTags = pgTable("blog_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
});

export const blogPostTags = pgTable("blog_post_tags", {
  blogPostId: uuid("blog_post_id").notNull().references(() => blogPosts.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id").notNull().references(() => blogTags.id, { onDelete: "cascade" }),
}, (t) => ({
  primaryKey: { columns: [t.blogPostId, t.tagId] },
}));
