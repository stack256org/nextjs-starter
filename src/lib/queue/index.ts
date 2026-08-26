import { PgBoss } from "pg-boss";

/**
 * pgBoss instance — a PostgreSQL-based job queue.
 *
 * pgBoss stores its queue tables inside your existing PostgreSQL database,
 * so it uses the same DATABASE_URL (or PGBOSS_DATABASE_URL if set separately).
 *
 * Usage (sending a job):
 *   import { boss } from "@/lib/queue";
 *   await boss.send("my-job", { data: "value" });
 *
 * Usage (in a worker — see `./worker.ts`):
 *   import { registerWorker } from "@/lib/queue";
 *   await registerWorker("my-job", async (job) => { ... });
 */
export const boss = new PgBoss(process.env.PGBOSS_DATABASE_URL || process.env.DATABASE_URL!);

/**
 * Initializes the pgBoss queue connection.
 * Call this before sending or processing jobs (e.g. at app startup).
 */
export async function initQueue() {
  await boss.start();
  console.log("✅ pgBoss queue initialized");
}

/**
 * Shut down the queue gracefully.
 */
export async function closeQueue() {
  await boss.stop();
  console.log("🛑 pgBoss queue stopped");
}
