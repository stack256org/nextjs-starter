import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Shared PostgreSQL connection pool.
 * Drizzle ORM uses node-postgres (pg) under the hood.
 *
 * In production, set DATABASE_URL in your environment.
 * Example: postgres://user:password@host:5432/database
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: adjust pool size for your workload
  // max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
});

/**
 * Drizzle ORM instance bound to the PostgreSQL pool.
 *
 * Import this `db` instance in your Server Components or API routes:
 *
 * ```ts
 * import { db } from "@/lib/db";
 * import { users } from "@/lib/db/schema";
 *
 * const allUsers = await db.select().from(users);
 * ```
 */
export const db = drizzle(pool, { schema });

/**
 * Gracefully close the connection pool (useful in tests or shutdown hooks).
 */
export async function closeDb() {
  await pool.end();
}
