#!/usr/bin/env node
/**
 * CLI entry point for running database migrations programmatically.
 * Run with: npx tsx src/lib/db/migrate.cli.ts  or  npm run db:migrate:run
 */
import { runMigrations } from "./migrate";

runMigrations().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
