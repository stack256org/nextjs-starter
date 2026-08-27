import { getBoss, initQueue } from "./index";
import type { Job, SendOptions } from "pg-boss";

/**
 * Job type definitions for the pgBoss queue.
 * Add new job types here as your application grows — the name must also be
 * registered in `QUEUE_NAMES` (src/lib/queue/index.ts) so the queue exists
 * before anything tries to send to it.
 */
export type JobType = "send-email";

/** A handler function that processes a single queued job. */
export type JobHandler<T extends object = object> = (
  job: Job<T>,
) => Promise<void>;

/**
 * Send a job to the pgBoss queue.
 *
 * The queue is lazily initialized on first use, so this can be called from
 * any server-side context (Route Handlers, Server Actions, BetterAuth
 * callbacks) without pre-starting pgBoss.
 *
 * @example
 *   await sendJob("send-email", { to: "user@example.com", subject: "Welcome!" });
 */
export async function sendJob<T extends object = object>(
  name: JobType,
  data: T,
  opts?: SendOptions,
) {
  await initQueue();
  await getBoss().send(name, data, opts);
}

/**
 * Register a job handler with the pgBoss worker.
 *
 * pgBoss hands the callback a *batch* of jobs; we unwrap it so each handler
 * deals with a single job.  If the handler throws, the error propagates so
 * pgBoss can apply its retry policy.
 */
export async function registerWorker<T extends object = object>(
  name: JobType,
  handler: JobHandler<T>,
) {
  // `boss.work()` is async — awaiting it means a failed registration surfaces
  // at startup instead of becoming an unhandled rejection.
  await getBoss().work<T, void>(name, async (jobs) => {
    // Deliberately sequential: a batch is processed one job at a time so a
    // failure stops the batch instead of racing the rest through.
    for (const job of jobs) {
      try {
        // oxlint-disable-next-line no-await-in-loop
        await handler(job);
      } catch (err) {
        console.error(`Job "${name}" failed:`, err);
        throw err; // Let pgBoss handle retries
      }
    }
  });
  console.log(`Worker registered for job type: "${name}"`);
}
