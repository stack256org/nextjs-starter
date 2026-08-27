#!/usr/bin/env node
/**
 * CLI entry point for the pgBoss worker process.
 * Run with: npx tsx src/lib/queue/worker.cli.ts  or  pnpm worker
 *
 * Loads .env.local automatically so the worker can read DATABASE_URL,
 * SMTP_* env vars, etc. when run outside of Next.js.
 */
import dotenv from "dotenv";
import { startWorker } from "./worker";

// Load environment variables from .env.local (Next.js convention).
// Must run before any module that reads process.env at import time.
dotenv.config({ path: ".env.local" });

startWorker().catch((err) => {
  console.error("❌ Worker crashed:", err);
  process.exit(1);
});
