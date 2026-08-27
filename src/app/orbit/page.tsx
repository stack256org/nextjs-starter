import type { Metadata } from "next";
import Link from "next/link";
import { count, gt, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";
import { listQueues, QueueUnavailableError } from "@/lib/queue/admin";
import { displayName } from "@/lib/auth/config";
import { formatDate } from "@/lib/format/session";
import { Alert, Avatar, Badge, EmptyState } from "@/components/ui";
import { UsersIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Overview · Orbit Admin" };

export const dynamic = "force-dynamic";

const RECENT_WINDOW_DAYS = 7;

export default async function OrbitPage() {
  await requireAdmin();

  // oxlint-disable-next-line purity
  const now = new Date();
  const since = new Date(now.getTime() - RECENT_WINDOW_DAYS * 86_400_000);

  const [[userStats], [sessionStats], recentUsers, queues] = await Promise.all([
    db
      .select({
        total: count(),
        admins: sql<number>`count(*) filter (where ${users.role} = 'admin')::int`,
        banned: sql<number>`count(*) filter (where ${users.banned})::int`,
        recent: sql<number>`count(*) filter (where ${users.createdAt} >= ${since})::int`,
      })
      .from(users),
    db
      .select({ active: count() })
      .from(sessions)
      .where(gt(sessions.expiresAt, now)),
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} desc`)
      .limit(5),
    listQueues().catch((err) => {
      if (err instanceof QueueUnavailableError) return null;
      throw err;
    }),
  ]);

  const failedJobs = queues?.reduce((n, q) => n + q.failed, 0) ?? 0;
  const waitingJobs = queues?.reduce((n, q) => n + q.ready, 0) ?? 0;

  const metrics = [
    { label: "Users", value: userStats?.total ?? 0 },
    { label: "Admins", value: userStats?.admins ?? 0 },
    { label: "Active sessions", value: sessionStats?.active ?? 0 },
    { label: `New in ${RECENT_WINDOW_DAYS}d`, value: userStats?.recent ?? 0 },
    { label: "Jobs waiting", value: waitingJobs },
    { label: "Jobs failed", value: failedJobs, alert: failedJobs > 0 },
  ];

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1.5 text-sm text-base-content/70">
          Who is using this instance, and what the workers are doing.
        </p>
      </header>

      {queues === null && (
        <Alert tone="error" title="Can't reach the job queue" assertive>
          Queue figures are unavailable. Check that PostgreSQL is running.
        </Alert>
      )}

      {(userStats?.banned ?? 0) > 0 && (
        <Alert tone="warning" title={`${userStats!.banned} banned account${userStats!.banned === 1 ? "" : "s"}`}>
          Banned accounts cannot sign in. Review them on the users page.
        </Alert>
      )}

      {/* Metrics in a rule-separated band — no card boxes. */}
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-box bg-base-300 sm:grid-cols-3 lg:grid-cols-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-base-100 px-4 py-5">
            <dt className="text-xs tracking-wide text-base-content/60 uppercase">
              {metric.label}
            </dt>
            <dd
              className={`mt-1.5 font-mono text-2xl ${metric.alert ? "text-error" : ""}`}
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ── Newest users ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Newest users</h2>
            <Link
              href="/orbit/users"
              className="inline-flex items-center gap-1 text-sm text-base-content/70 transition-colors hover:text-base-content"
            >
              All users
              <ArrowRightIcon size={13} aria-hidden="true" />
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <EmptyState
              icon={<UsersIcon size={36} aria-hidden="true" />}
              title="Nobody has signed up yet"
              description="Accounts appear the first time someone completes a sign-in."
            />
          ) : (
            <ul className="divide-y divide-base-300 border-y border-base-300">
              {recentUsers.map((user) => (
                <li key={user.id}>
                  <Link
                    href={`/orbit/users/${user.id}`}
                    className="flex items-center gap-3 py-3 transition-colors hover:bg-base-200/60"
                  >
                    <Avatar
                      src={user.image}
                      name={displayName(user)}
                      size="sm"
                      shape="squircle"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {displayName(user)}
                      </span>
                      <span className="block truncate text-xs text-base-content/60">
                        {user.email}
                      </span>
                    </span>
                    {user.role === "admin" && <Badge tone="primary">admin</Badge>}
                    <span className="text-xs text-base-content/50">
                      {formatDate(user.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Queues ── */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Queues</h2>
            <Link
              href="/orbit/queues"
              className="inline-flex items-center gap-1 text-sm text-base-content/70 transition-colors hover:text-base-content"
            >
              Manage jobs
              <ArrowRightIcon size={13} aria-hidden="true" />
            </Link>
          </div>

          {!queues || queues.length === 0 ? (
            <p className="border-y border-base-300 py-4 text-sm text-base-content/60">
              {queues === null
                ? "Unavailable while the queue is unreachable."
                : "No queues registered yet."}
            </p>
          ) : (
            <ul className="divide-y divide-base-300 border-y border-base-300">
              {queues.map((queue) => (
                <li key={queue.name}>
                  <Link
                    href={`/orbit/queues/${encodeURIComponent(queue.name)}`}
                    className="flex items-center gap-3 py-3 transition-colors hover:bg-base-200/60"
                  >
                    <span className="min-w-0 flex-1 truncate font-mono text-sm">
                      {queue.name}
                    </span>
                    {queue.failed > 0 && (
                      <Badge tone="error">{queue.failed} failed</Badge>
                    )}
                    {queue.ready > 0 && (
                      <Badge tone="info">{queue.ready} waiting</Badge>
                    )}
                    {!queue.hasHandler && (
                      <Badge tone="warning">no handler</Badge>
                    )}
                    <span className="font-mono text-xs text-base-content/50">
                      {queue.total}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
