import { pgSchema } from "drizzle-orm/pg-core";

export const catalog = pgSchema("catalog");
export const inventory = pgSchema("inventory");
export const sales = pgSchema("sales");
export const marketing = pgSchema("marketing");
export const content = pgSchema("content");
export const communication = pgSchema("communication");
export const analytics = pgSchema("analytics");
