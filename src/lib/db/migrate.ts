import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, closeDb } from "./index";

/**
 * Run pending migrations programmatically.
 *
 * Drizzle generates SQL migration files in `./src/lib/db/migrations/`
 * (run `npm run db:generate` to create them). This function applies
 * any unapplied migrations to the database.
 *
 * Usage:
 *   - CLI:    npm run db:migrate:run
 *   - Docker: node src/lib/db/migrate.cli.js (after build)
 *   - API:    import { runMigrations } from "@/lib/db/migrate"
 */
export async function runMigrations() {
  console.log("🔄 Running database migrations...");
  await migrate(db, { migrationsFolder: "./src/lib/db/migrations" });
  console.log("✅ Migrations applied successfully.");
  await closeDb();
}
