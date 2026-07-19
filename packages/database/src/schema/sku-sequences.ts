import { varchar, integer } from "drizzle-orm/pg-core";
import { catalog } from "./__schemas";

export const skuSequences = catalog.table("sku_sequences", {
  prefix: varchar("prefix", { length: 20 }).primaryKey(),
  lastNum: integer("last_num").notNull().default(0),
});
