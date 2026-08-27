#!/usr/bin/env node
/**
 * CLI entry point for the pgBoss worker process.
 * Run with: pnpm worker  (or: npx tsx src/lib/queue/worker.cli.ts)
 *
 * `@/lib/env/load` MUST stay the first import — see the comment in that file.
 * Sibling imports are evaluated in source order, so this guarantees
 * DATABASE_URL is populated before `@/lib/db` builds its connection pool.
 */
import "@/lib/env/load";
import { startWorker } from "./worker";

startWorker().catch((err) => {
  console.error("Worker crashed:", err);
  process.exit(1);
});
