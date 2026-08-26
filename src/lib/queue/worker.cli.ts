#!/usr/bin/env node
/**
 * CLI entry point for the pgBoss worker process.
 * Run with: npx tsx src/lib/queue/worker.cli.ts  or  npm run worker
 */
import { startWorker } from "./worker";

startWorker().catch((err) => {
  console.error("❌ Worker crashed:", err);
  process.exit(1);
});
