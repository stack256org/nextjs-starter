import { boss } from "./index";
import type { Job, SendOptions } from "pg-boss";

/**
 * Job type definitions for the pgBoss queue.
 * Add new job types here as your application grows.
 */
export type JobType = "send-email" | "process-post";

/**
 * A handler function that processes a single queued job.
 */
export type JobHandler<T extends object = object> = (
  job: Job<T>,
) => Promise<void>;

/**
 * Send a job to the pgBoss queue.
 *
 * @example
 *   await sendJob("send-email", { userId: 1, subject: "Welcome!" });
 *
 * @param name   - Job type (queue name)
 * @param data   - Payload to pass to the job handler (must be an object)
 * @param opts   - Optional scheduling/retention options
 */
export async function sendJob<T extends object = object>(
  name: JobType,
  data: T,
  opts?: SendOptions,
) {
  await boss.send(name, data, opts);
}

/**
 * Register a job handler with the pgBoss worker.
 *
 * When a job of this type is dequeued, the handler is called with each job.
 * If the handler throws, pgBoss will automatically retry based on `retryLimit`.
 *
 * @example
 *   registerWorker("send-email", async (job) => {
 *     const { userId, subject } = job.data;
 *     await emailService.send(userId, subject);
 *   });
 *
 * @param name     - Job type (queue name)
 * @param handler  - Function called when one or more jobs are dequeued
 */
export function registerWorker<T extends object = object>(
  name: JobType,
  handler: JobHandler<T>,
) {
  // boss.work with ReqData=T, ResData=void
  // The handler receives an array of jobs; we iterate and call the user handler per-job.
  boss.work<T, void>(name, async (jobs) => {
    for (const job of jobs) {
      try {
        await handler(job);
      } catch (err) {
        console.error(`❌ Job "${name}" failed:`, err);
        throw err; // Let pgBoss handle retries
      }
    }
  });
  console.log(`✅ Worker registered for job type: "${name}"`);
}
