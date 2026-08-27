import { PgBoss } from "pg-boss";

/**
 * pgBoss instance — a PostgreSQL-based job queue.
 *
 * pgBoss stores its queue tables inside your existing PostgreSQL database,
 * so it uses the same DATABASE_URL (or PGBOSS_DATABASE_URL if set separately).
 *
 * Usage (sending a job):
 *   import { sendJob } from "@/lib/queue";
 *   await sendJob("send-email", { to: "user@example.com", ... });
 *
 * Usage (in a worker — see `./worker.ts`):
 *   import { registerWorker } from "@/lib/queue";
 *   await registerWorker("send-email", async (job) => { ... });
 */
export const boss = new PgBoss(process.env.PGBOSS_DATABASE_URL || process.env.DATABASE_URL!);

let started = false;

/**
 * Initializes the pgBoss queue connection.
 * Call this before sending or processing jobs (e.g. at app startup).
 * Safe to call multiple times — only starts once.
 */
export async function initQueue() {
  if (started) return;
  await boss.start();
  started = true;
  console.log("✅ pgBoss queue initialized");
}

/**
 * Shut down the queue gracefully.
 */
export async function closeQueue() {
  if (!started) return;
  await boss.stop();
  started = false;
  console.log("🛑 pgBoss queue stopped");
}
