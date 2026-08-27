import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/helpers";
import {
  isJobState,
  listJobs,
  listQueues,
  QueueUnavailableError,
} from "@/lib/queue/admin";
import {
  Alert,
  Badge,
  ButtonLink,
  MetricBand,
  Page,
  PageHeader,
} from "@/components/ui";
import { JobTable } from "./job-table";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

interface PageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ state?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  return { title: `${decodeURIComponent(name)} · Queues · Orbit Admin` };
}

export default async function QueueDetailPage({ params, searchParams }: PageProps) {
  await requireAdmin();

  const { name: rawName } = await params;
  const queueName = decodeURIComponent(rawName);
  const { state: rawState, page: rawPage } = await searchParams;

  const state = rawState && isJobState(rawState) ? rawState : undefined;
  const page = Math.max(1, Number(rawPage) || 1);

  let queue;
  let result;
  try {
    const queues = await listQueues();
    queue = queues.find((q) => q.name === queueName);
    if (!queue) notFound();

    result = await listJobs({
      queue: queueName,
      state,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    });
  } catch (err) {
    if (!(err instanceof QueueUnavailableError)) throw err;
    return (
      <Page>
        <PageHeader
          title={queueName}
          backTo={{ href: "/orbit/queues", label: "All queues" }}
        />
        <Alert tone="error" title="Can't reach the job queue" assertive>
          pgBoss could not be contacted. Check that PostgreSQL is running.
        </Alert>
      </Page>
    );
  }

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  // `dynamic = "force-dynamic"` means this component runs once per request, so
  // reading the clock produces a fresh value rather than a baked-in constant.
  // oxlint-disable-next-line purity
  const renderedAt = Date.now();

  const metrics = [
    { label: "Waiting", value: queue.ready },
    // Deferred jobs are queued but dated in the future, so they show in
    // neither "waiting" nor "running" — without this row they look lost.
    { label: "Scheduled", value: queue.deferred },
    { label: "Running", value: queue.active },
    { label: "Failed", value: queue.failed, alert: queue.failed > 0 },
    { label: "Completed", value: queue.completed },
    { label: "Cancelled", value: queue.cancelled },
  ];

  return (
    <Page>
      <PageHeader
        title={<span className="font-mono">{queue.name}</span>}
        backTo={{ href: "/orbit/queues", label: "All queues" }}
        description={
          queue.hasHandler
            ? "A worker handler is registered for this queue."
            : "No worker handler is registered — jobs here will never be processed."
        }
        meta={
          queue.hasHandler ? (
            <Badge tone="success">worker registered</Badge>
          ) : (
            <Badge tone="warning">no handler</Badge>
          )
        }
      />

      <MetricBand metrics={metrics} />

      <JobTable queue={queue.name} jobs={result.jobs} renderedAt={renderedAt} />

      {totalPages > 1 && (
        <nav className="flex items-center justify-between" aria-label="Job pages">
          <span className="text-sm text-base-content/60">
            Page {page} of {totalPages} · {result.total} job
            {result.total === 1 ? "" : "s"}
          </span>
          <div className="join">
            <ButtonLink
              href={buildHref(queue.name, state, page - 1)}
              size="sm"
              className="join-item"
              disabled={page <= 1}
            >
              Previous
            </ButtonLink>
            <ButtonLink
              href={buildHref(queue.name, state, page + 1)}
              size="sm"
              className="join-item"
              disabled={page >= totalPages}
            >
              Next
            </ButtonLink>
          </div>
        </nav>
      )}
    </Page>
  );
}

function buildHref(queue: string, state: string | undefined, page: number) {
  const params = new URLSearchParams();
  if (state) params.set("state", state);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/orbit/queues/${encodeURIComponent(queue)}${query ? `?${query}` : ""}`;
}

