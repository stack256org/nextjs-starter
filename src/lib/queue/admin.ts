import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { getBoss, initQueue } from "./index";
import type {
  JobAction,
  JobState,
  JobSummary,
  QueueSummary,
} from "./types";

// Re-exported so server-side callers have one import site. Client Components
// must import these from "./types" directly — importing from here pulls `pg`
// into the browser bundle.
export type { JobAction, JobState, JobSummary, QueueSummary };
export { JOB_STATES, isJobState, allowedActions } from "./types";

/**
 * Read/write access to the pgBoss job tables for the Orbit admin UI.
 *
 * Server-only: every export here touches the database directly and must never
 * be imported from a Client Component. Callers are Server Components and the
 * Server Actions in ./actions.ts, both of which enforce `requireAdmin()`.
 *
 * Listing is done with SQL against `pgboss.job` rather than `boss.findJobs()`,
 * because that API filters only by id/key/data and cannot filter by state or
 * paginate — both of which a job browser needs.
 *
 * Mutations go through pgBoss's own methods (`retry`, `cancel`, `resume`,
 * `deleteJob`) so its state machine and bookkeeping stay consistent.
 */

/** Queues the worker registers handlers for — see src/lib/queue/index.ts. */
const HANDLED_QUEUES = new Set<string>(["send-email"]);

/**
 * pgBoss creates its own maintenance queues (`__pgboss__send-it`, and others
 * depending on version). They are internal plumbing, always show as
 * "no handler", and are not something an operator should act on — so they are
 * hidden from the admin UI.
 */
const INTERNAL_QUEUE_PREFIX = "__pgboss__";

function isInternalQueue(name: string): boolean {
  return name.startsWith(INTERNAL_QUEUE_PREFIX);
}

export class QueueUnavailableError extends Error {
  constructor(cause: unknown) {
    super("Could not reach the job queue.");
    this.name = "QueueUnavailableError";
    this.cause = cause;
  }
}

/**
 * Per-queue counts broken out by state.
 *
 * One grouped query over `pgboss.job` rather than N calls to
 * `getQueueStats()`, and it includes `cancelled`, which `QueueResult` omits.
 */
export async function listQueues(): Promise<QueueSummary[]> {
  try {
    await initQueue();
    const registered = await getBoss().getQueues();

    const { rows } = await db.execute<{
      name: string;
      state: string;
      deferred: number;
      n: number;
    }>(sql`
      select
        name,
        state::text as state,
        count(*) filter (where start_after > now())::int as deferred,
        count(*)::int as n
      from pgboss.job
      group by name, state
    `);

    const byName = new Map<string, QueueSummary>();
    const blank = (name: string): QueueSummary => ({
      name,
      ready: 0,
      deferred: 0,
      active: 0,
      completed: 0,
      failed: 0,
      cancelled: 0,
      total: 0,
      hasHandler: HANDLED_QUEUES.has(name),
    });

    // Seed from the queue registry so a queue with no jobs still appears.
    for (const queue of registered) {
      if (isInternalQueue(queue.name)) continue;
      byName.set(queue.name, blank(queue.name));
    }

    for (const row of rows) {
      if (isInternalQueue(row.name)) continue;
      const summary = byName.get(row.name) ?? blank(row.name);
      const n = Number(row.n);
      const deferred = Number(row.deferred);

      switch (row.state) {
        case "created":
        case "retry":
          summary.ready += n - deferred;
          summary.deferred += deferred;
          break;
        case "active":
          summary.active += n;
          break;
        case "completed":
          summary.completed += n;
          break;
        case "failed":
          summary.failed += n;
          break;
        case "cancelled":
          summary.cancelled += n;
          break;
      }
      summary.total += n;
      byName.set(row.name, summary);
    }

    return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    throw new QueueUnavailableError(err);
  }
}

export interface ListJobsOptions {
  queue: string;
  state?: JobState;
  limit?: number;
  offset?: number;
}

export interface ListJobsResult {
  jobs: JobSummary[];
  total: number;
}

/** One page of jobs for a queue, newest first. */
export async function listJobs({
  queue,
  state,
  limit = 25,
  offset = 0,
}: ListJobsOptions): Promise<ListJobsResult> {
  try {
    const stateFilter = state
      ? sql`and state = ${state}::pgboss.job_state`
      : sql``;

    const { rows } = await db.execute<{
      id: string;
      name: string;
      state: string;
      priority: number;
      retry_count: number;
      retry_limit: number;
      created_on: Date;
      start_after: Date;
      started_on: Date | null;
      completed_on: Date | null;
      data: unknown;
      output: unknown;
      total: number;
    }>(sql`
      select
        id, name, state::text as state, priority,
        retry_count, retry_limit,
        created_on, start_after, started_on, completed_on,
        data, output,
        count(*) over ()::int as total
      from pgboss.job
      where name = ${queue}
      ${stateFilter}
      order by created_on desc
      limit ${limit} offset ${offset}
    `);

    return {
      total: rows.length > 0 ? Number(rows[0]!.total) : 0,
      jobs: rows.map((row) => ({
        id: row.id,
        name: row.name,
        state: row.state as JobState,
        priority: row.priority,
        retryCount: row.retry_count,
        retryLimit: row.retry_limit,
        createdOn: new Date(row.created_on).toISOString(),
        startAfter: new Date(row.start_after).toISOString(),
        startedOn: row.started_on ? new Date(row.started_on).toISOString() : null,
        completedOn: row.completed_on
          ? new Date(row.completed_on).toISOString()
          : null,
        data: row.data,
        output: row.output,
      })),
    };
  } catch (err) {
    throw new QueueUnavailableError(err);
  }
}

/**
 * Applies an action to one or more jobs through pgBoss's own API, so its
 * state machine stays consistent.
 */
export async function actOnJobs(
  queue: string,
  ids: string[],
  action: JobAction,
): Promise<void> {
  if (ids.length === 0) return;

  await initQueue();
  const boss = getBoss();

  switch (action) {
    case "retry":
      await boss.retry(queue, ids);
      return;
    case "cancel":
      await boss.cancel(queue, ids);
      return;
    case "resume":
      await boss.resume(queue, ids);
      return;
    case "delete":
      await boss.deleteJob(queue, ids);
      return;
  }
}

