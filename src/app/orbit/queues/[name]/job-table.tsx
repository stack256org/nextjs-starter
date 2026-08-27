"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { runJobAction } from "@/lib/queue/actions";
// From ./types, not ./admin — ./admin opens a database connection and would
// be pulled into the browser bundle by this Client Component.
import {
  allowedActions,
  type JobAction,
  type JobState,
  type JobSummary,
} from "@/lib/queue/types";
import {
  JOB_STATE_LABEL,
  JOB_STATE_TONE,
  durationMs,
  formatDuration,
  relativeTime,
} from "@/lib/queue/format";
import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Checkbox,
  EmptyState,
  Modal,
  DisclosureItem,
} from "@/components/ui";
import {
  ArrowClockwiseIcon,
  ProhibitIcon,
  TrashIcon,
  PlayIcon,
  TrayIcon,
} from "@phosphor-icons/react/dist/ssr";

interface JobTableProps {
  queue: string;
  jobs: JobSummary[];
  /** Server render time, so relative timestamps don't differ across hydration. */
  renderedAt: number;
}

/*
 * The empty state lives INSIDE this component rather than replacing it in the
 * page. Acting on the last matching job empties the filter, and if the page
 * swapped in an empty state the whole client component would unmount — taking
 * the "3 jobs queued for retry" confirmation with it, so a successful action
 * would look like nothing happened.
 */

const ACTION_META: Record<
  JobAction,
  { label: string; Icon: typeof ArrowClockwiseIcon; destructive?: boolean }
> = {
  retry: { label: "Retry", Icon: ArrowClockwiseIcon },
  resume: { label: "Resume", Icon: PlayIcon },
  cancel: { label: "Cancel", Icon: ProhibitIcon },
  delete: { label: "Delete", Icon: TrashIcon, destructive: true },
};

export function JobTable({ queue, jobs, renderedAt }: JobTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [confirming, setConfirming] = useState<JobAction | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedJobs = jobs.filter((job) => selected.has(job.id));

  /** Actions valid for every selected job — never offer one that would fail. */
  const bulkActions =
    selectedJobs.length === 0
      ? []
      : (Object.keys(ACTION_META) as JobAction[]).filter((action) =>
          selectedJobs.every((job) => allowedActions(job.state).includes(action)),
        );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === jobs.length ? new Set() : new Set(jobs.map((j) => j.id)),
    );
  }

  function run(action: JobAction, ids: string[]) {
    startTransition(async () => {
      const res = await runJobAction(queue, ids, action);
      setResult(res);
      setConfirming(null);
      if (res.ok) {
        setSelected(new Set());
        router.refresh();
      }
    });
  }

  function setStateFilter(state: JobState | "all") {
    const params = new URLSearchParams(searchParams.toString());
    if (state === "all") params.delete("state");
    else params.set("state", state);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeFilter = searchParams.get("state") ?? "all";

  return (
    <div className="flex flex-col gap-4">
      {/* ── State filter ── */}
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Filter jobs by state</legend>
        <FilterChip
          label="All"
          active={activeFilter === "all"}
          onClick={() => setStateFilter("all")}
        />
        {(Object.keys(JOB_STATE_LABEL) as JobState[]).map((state) => (
          <FilterChip
            key={state}
            label={JOB_STATE_LABEL[state]}
            active={activeFilter === state}
            onClick={() => setStateFilter(state)}
          />
        ))}
      </fieldset>

      {result && (
        <Alert tone={result.ok ? "success" : "error"} assertive={!result.ok}>
          {result.message}
        </Alert>
      )}

      {/* ── Bulk action bar ── */}
      {selectedJobs.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-box border border-base-300 bg-base-200 px-4 py-3">
          <span className="text-sm font-medium">
            {selectedJobs.length} selected
          </span>
          <div className="flex flex-wrap gap-2">
            {bulkActions.length === 0 ? (
              <span className="text-xs text-base-content/60">
                No action applies to every selected job.
              </span>
            ) : (
              bulkActions.map((action) => {
                const { label, Icon, destructive } = ACTION_META[action];
                return (
                  <Button
                    key={action}
                    size="sm"
                    variant={destructive ? "error" : undefined}
                    loading={isPending && confirming === action}
                    onClick={() =>
                      destructive
                        ? setConfirming(action)
                        : run(action, [...selected])
                    }
                  >
                    <Icon size={14} aria-hidden="true" />
                    {label}
                  </Button>
                );
              })
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={() => setSelected(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      {/* ── Table ── */}
      {jobs.length === 0 ? (
        <EmptyState
          icon={<TrayIcon size={38} aria-hidden="true" />}
          title={
            activeFilter === "all"
              ? "No jobs in this queue"
              : `No ${JOB_STATE_LABEL[activeFilter as JobState].toLowerCase()} jobs`
          }
          description={
            activeFilter === "all"
              ? `Nothing has been sent to ${queue}. Jobs appear here as soon as something calls sendJob().`
              : "Nothing matches this filter right now."
          }
          action={
            activeFilter === "all" ? undefined : (
              <ButtonLink
                href={`/orbit/queues/${encodeURIComponent(queue)}`}
                size="sm"
              >
                Show all jobs
              </ButtonLink>
            )
          }
        />
      ) : (
      <div className="overflow-x-auto rounded-box border border-base-300">
        <table className="table">
          <thead>
            <tr>
              <th className="w-10">
                <Checkbox
                  checked={selected.size === jobs.length && jobs.length > 0}
                  indeterminate={selected.size > 0 && selected.size < jobs.length}
                  onChange={toggleAll}
                  label={<span className="sr-only">Select all jobs</span>}
                />
              </th>
              <th>Job</th>
              <th>State</th>
              <th className="text-right">Attempts</th>
              <th className="text-right">Created</th>
              <th className="text-right">Duration</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const actions = allowedActions(job.state);
              const took = durationMs(job.startedOn, job.completedOn);

              return (
                <tr key={job.id} className="align-top hover:bg-base-200/60">
                  <td>
                    <Checkbox
                      checked={selected.has(job.id)}
                      onChange={() => toggle(job.id)}
                      label={
                        <span className="sr-only">
                          Select job {job.id.slice(0, 8)}
                        </span>
                      }
                    />
                  </td>
                  <td>
                    <code className="font-mono text-xs">{job.id.slice(0, 8)}</code>
                    <div className="mt-1 max-w-md">
                      <DisclosureItem
                        title={
                          <span className="text-xs opacity-70">
                            Payload{job.output ? " and output" : ""}
                          </span>
                        }
                        className="border-0 bg-transparent"
                      >
                        <pre className="overflow-x-auto rounded-field bg-base-300 p-3 font-mono text-xs">
                          {JSON.stringify(
                            job.output ? { data: job.data, output: job.output } : job.data,
                            null,
                            2,
                          )}
                        </pre>
                      </DisclosureItem>
                    </div>
                  </td>
                  <td>
                    <Badge tone={JOB_STATE_TONE[job.state]}>
                      {JOB_STATE_LABEL[job.state]}
                    </Badge>
                  </td>
                  <td className="text-right tabular">
                    {job.retryCount}/{job.retryLimit}
                  </td>
                  <td className="text-right text-xs text-base-content/60">
                    {relativeTime(job.createdOn, renderedAt)}
                  </td>
                  <td className="text-right text-xs text-base-content/60 tabular">
                    {took === null ? "—" : formatDuration(took)}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      {actions.map((action) => {
                        const { label, Icon, destructive } = ACTION_META[action];
                        return (
                          <Button
                            key={action}
                            size="sm"
                            variant="ghost"
                            title={label}
                            disabled={isPending}
                            onClick={() => run(action, [job.id])}
                            className={destructive ? "text-error" : ""}
                          >
                            <Icon size={14} aria-hidden="true" />
                            <span className="sr-only">
                              {label} job {job.id.slice(0, 8)}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      <Modal
        isOpen={confirming !== null}
        onClose={() => setConfirming(null)}
        title="Delete these jobs?"
        description={`${selectedJobs.length} job${selectedJobs.length === 1 ? "" : "s"} will be removed permanently. This can't be undone.`}
      >
        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={() => setConfirming(null)}>
            Keep them
          </Button>
          <Button
            size="sm"
            variant="error"
            loading={isPending}
            onClick={() => confirming && run(confirming, [...selected])}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button size="sm" variant={active ? "primary" : undefined} onClick={onClick}>
      {label}
    </Button>
  );
}
