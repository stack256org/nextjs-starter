import { PgBoss } from "pg-boss";

/**
 * pgBoss instance — a PostgreSQL-based job queue.
 *
 * pgBoss stores its queue tables inside your existing PostgreSQL database,
 * so it uses the same DATABASE_URL.
 *
 * The PgBoss instance is created lazily inside `initQueue()` so that
 * environment variables are available regardless of import order (the
 * worker CLI loads .env.local before importing this module).
 *
 * Usage (sending a job):
 *   import { sendJob } from "@/lib/queue";
 *   await sendJob("send-email", { to: "user@example.com", ... });
 *
 * Usage (in a worker — see `./worker.ts`):
 *   import { registerWorker } from "@/lib/queue";
 *   await registerWorker("send-email", async (job) => { ... });
 */
let boss: PgBoss | null = null;
let started = false;

/**
 * Every queue the app uses. `initQueue()` creates them all up front so that
 * `boss.send()` works from the Next.js server process even though only the
 * worker process registers handlers.
 * Keep this in sync with `JobType` in ./jobs.ts.
 */
const QUEUE_NAMES = ["send-email"] as const;

/**
 * Returns the initialized pgBoss instance.
 * Throws if `initQueue()` hasn't been called yet.
 */
export function getBoss(): PgBoss {
  if (!boss) {
    throw new Error("pgBoss not initialized. Call initQueue() first.");
  }
  return boss;
}

/**
 * Initializes the pgBoss queue connection and creates queues.
 * Call this before sending or processing jobs (e.g. at app startup).
 * Safe to call multiple times — only starts once.
 */
export async function initQueue() {
  if (started) return;
  boss = new PgBoss(process.env.DATABASE_URL!);
  await boss.start();
  // Create queues so that boss.send() works even before the worker has
  // registered its handlers (e.g. on the Next.js web server process).
  await Promise.all(QUEUE_NAMES.map((name) => boss!.createQueue(name)));
  started = true;
  console.log("pgBoss queue initialized");
}

/**
 * Shut down the queue gracefully.
 */
export async function closeQueue() {
  if (!started || !boss) return;
  await boss.stop();
  started = false;
  boss = null;
  console.log("pgBoss queue stopped");
}
