import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/helpers";
import { listQueues, QueueUnavailableError } from "@/lib/queue/admin";
import { Alert, Badge, ButtonLink, EmptyState } from "@/components/ui";
import { StackIcon, WarningIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Queues · Orbit Admin" };

export const dynamic = "force-dynamic";

export default async function QueuesPage() {
  await requireAdmin();

  let queues;
  try {
    queues = await listQueues();
  } catch (err) {
    if (!(err instanceof QueueUnavailableError)) throw err;

    return (
      <div className="flex flex-col gap-6">
        <PageHeading />
        <Alert tone="error" title="Can't reach the job queue" assertive>
          pgBoss could not be contacted. Check that PostgreSQL is running and
          that DATABASE_URL is correct.
        </Alert>
      </div>
    );
  }

  const totalFailed = queues.reduce((sum, q) => sum + q.failed, 0);
  const totalReady = queues.reduce((sum, q) => sum + q.ready, 0);
  const unhandled = queues.filter((q) => !q.hasHandler && q.ready > 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading />

      {totalFailed > 0 && (
        <Alert tone="warning" title={`${totalFailed} failed job${totalFailed === 1 ? "" : "s"}`}>
          Open the queue to inspect the error output and retry them.
        </Alert>
      )}

      {unhandled.length > 0 && (
        <Alert tone="warning" title="Jobs are waiting with no worker">
          {unhandled.map((q) => q.name).join(", ")} has queued jobs but no
          registered handler. Start the worker with `pnpm worker`, or register a
          handler in src/lib/queue/worker.ts.
        </Alert>
      )}

      {queues.length === 0 ? (
        <EmptyState
          icon={<StackIcon size={40} aria-hidden="true" />}
          title="No queues yet"
          description="Queues are created on startup from QUEUE_NAMES in src/lib/queue/index.ts. Start the app or the worker once and they'll appear here."
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Queue</th>
                <th className="text-right">Waiting</th>
                <th className="text-right">Running</th>
                <th className="text-right">Failed</th>
                <th className="text-right">Completed</th>
                <th className="text-right">Total</th>
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {queues.map((queue) => (
                <tr key={queue.name} className="hover:bg-base-200/60">
                  <td>
                    <Link
                      href={`/orbit/queues/${encodeURIComponent(queue.name)}`}
                      className="font-medium hover:underline"
                    >
                      {queue.name}
                    </Link>
                    <div className="mt-1 flex gap-1">
                      {queue.hasHandler ? (
                        <Badge tone="success">worker registered</Badge>
                      ) : (
                        <Badge tone="warning">
                          <WarningIcon size={11} aria-hidden="true" />
                          no handler
                        </Badge>
                      )}
                      {queue.deferred > 0 && (
                        <Badge tone="info">{queue.deferred} scheduled</Badge>
                      )}
                    </div>
                  </td>
                  <td className="text-right">{queue.ready}</td>
                  <td className="text-right">{queue.active}</td>
                  <td
                    className={`text-right ${queue.failed > 0 ? "font-semibold text-error" : ""}`}
                  >
                    {queue.failed}
                  </td>
                  <td className="text-right text-base-content/60">
                    {queue.completed}
                  </td>
                  <td className="text-right text-base-content/60">
                    {queue.total}
                  </td>
                  <td className="text-right">
                    <ButtonLink
                      href={`/orbit/queues/${encodeURIComponent(queue.name)}`}
                      size="sm"
                    >
                      Inspect
                    </ButtonLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-base-content/60">
        {totalReady === 0
          ? "Nothing is waiting to be processed."
          : `${totalReady} job${totalReady === 1 ? "" : "s"} waiting across all queues.`}{" "}
        Counts are read live from pgBoss on each request.
      </p>
    </div>
  );
}

function PageHeading() {
  return (
    <header>
      <h1 className="text-2xl font-semibold">Queues</h1>
      <p className="mt-1 text-sm text-base-content/70">
        Background jobs processed by the pgBoss worker.
      </p>
    </header>
  );
}
