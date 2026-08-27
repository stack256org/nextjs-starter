#!/usr/bin/env node
/**
 * CLI entry point for running database migrations programmatically.
 * Run with: pnpm db:migrate:run  (or: npx tsx src/lib/db/migrate.cli.ts)
 *
 * `@/lib/env/load` MUST stay the first import — see the comment in that file.
 */
import "@/lib/env/load";
import { runMigrations } from "./migrate";

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
