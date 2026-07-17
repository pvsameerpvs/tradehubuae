import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

function createPool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export const db = drizzle(createPool(), { schema });

export type DB = typeof db;
export { schema };
export * from "./schema/index.js";
