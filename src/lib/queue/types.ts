/**
 * Queue types and pure helpers, safe to import from Client Components.
 *
 * Kept separate from ./admin.ts on purpose: that module opens a database
 * connection, and importing anything from it — even a type — drags `pg` into
 * the browser bundle and fails the build.
 */

/** The states a pgBoss job can be in. */
export const JOB_STATES = [
  "created",
  "retry",
  "active",
  "completed",
  "cancelled",
  "failed",
] as const;

export type JobState = (typeof JOB_STATES)[number];

export function isJobState(value: string): value is JobState {
  return (JOB_STATES as readonly string[]).includes(value);
}

export type JobAction = "retry" | "cancel" | "resume" | "delete";

export interface QueueSummary {
  name: string;
  /** Jobs waiting that are runnable right now. */
  ready: number;
  /** Jobs waiting whose `startAfter` is in the future. */
  deferred: number;
  active: number;
  completed: number;
  failed: number;
  cancelled: number;
  total: number;
  /** True when this queue has a handler registered in the worker. */
  hasHandler: boolean;
}

export interface JobSummary {
  id: string;
  name: string;
  state: JobState;
  priority: number;
  retryCount: number;
  retryLimit: number;
  createdOn: string;
  startAfter: string;
  startedOn: string | null;
  completedOn: string | null;
  data: unknown;
  output: unknown;
}

/**
 * Which actions make sense for a job in a given state.
 *
 * Offering an action pgBoss will reject produces a confusing failure, so the
 * UI only renders what can actually succeed.
 */
export function allowedActions(state: JobState): JobAction[] {
  switch (state) {
    case "failed":
      return ["retry", "delete"];
    case "created":
    case "retry":
      return ["cancel", "delete"];
    case "active":
      return ["cancel"];
    case "cancelled":
      return ["resume", "delete"];
    case "completed":
      return ["retry", "delete"];
  }
}
