"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/helpers";
import { actOnJobs, type JobAction } from "./admin";

export interface QueueActionResult {
  ok: boolean;
  message: string;
}

const PAST_TENSE: Record<JobAction, string> = {
  retry: "queued for retry",
  cancel: "cancelled",
  resume: "resumed",
  delete: "deleted",
};

/**
 * Applies an action to selected jobs.
 *
 * Every call re-checks `requireAdmin()`. A Server Action is a public HTTP
 * endpoint — the fact that the button rendering it only appears inside an
 * admin page is a UI detail, not authorisation.
 */
export async function runJobAction(
  queue: string,
  jobIds: string[],
  action: JobAction,
): Promise<QueueActionResult> {
  await requireAdmin();

  if (jobIds.length === 0) {
    return { ok: false, message: "No jobs selected." };
  }

  try {
    await actOnJobs(queue, jobIds, action);
  } catch (err) {
    console.error(`Job action "${action}" failed on queue "${queue}":`, err);
    return {
      ok: false,
      message:
        err instanceof Error
          ? `Could not ${action} the selected jobs: ${err.message}`
          : `Could not ${action} the selected jobs.`,
    };
  }

  revalidatePath("/orbit/queues");
  revalidatePath(`/orbit/queues/${queue}`);

  const count = jobIds.length;
  return {
    ok: true,
    message: `${count} job${count === 1 ? "" : "s"} ${PAST_TENSE[action]}.`,
  };
}
