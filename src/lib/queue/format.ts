import type { JobState } from "./types";
import type { BadgeTone } from "@/components/ui";

/** Badge colour for each pgBoss job state. */
export const JOB_STATE_TONE: Record<JobState, BadgeTone> = {
  created: "info",
  retry: "warning",
  active: "primary",
  completed: "success",
  cancelled: "ghost",
  failed: "error",
};

/** Plain-language description of each state, for the filter UI. */
export const JOB_STATE_LABEL: Record<JobState, string> = {
  created: "Waiting",
  retry: "Retrying",
  active: "Running",
  completed: "Completed",
  cancelled: "Cancelled",
  failed: "Failed",
};

/** Compact relative time, e.g. "4m ago", "in 2h". */
export function relativeTime(iso: string, now: number): string {
  const diff = new Date(iso).getTime() - now;
  const abs = Math.abs(diff);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [1000, "second"],
    [60_000, "minute"],
    [3_600_000, "hour"],
    [86_400_000, "day"],
  ];

  let value = Math.round(diff / 1000);
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [ms, u] of units) {
    if (abs >= ms) {
      value = Math.round(diff / ms);
      unit = u;
    }
  }

  return new Intl.RelativeTimeFormat(undefined, { style: "narrow" }).format(
    value,
    unit,
  );
}

/** How long a job took, or null if it never completed. */
export function durationMs(
  startedOn: string | null,
  completedOn: string | null,
): number | null {
  if (!startedOn || !completedOn) return null;
  return new Date(completedOn).getTime() - new Date(startedOn).getTime();
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60_000)}m`;
}
