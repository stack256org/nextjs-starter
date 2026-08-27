import type { Metadata } from "next";
import Link from "next/link";
import { count, gt, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";
import { listQueues, QueueUnavailableError } from "@/lib/queue/admin";
import { displayName } from "@/lib/auth/config";
import { formatDate } from "@/lib/format/session";
import {
  Alert,
  Avatar,
  Badge,
  EmptyState,
  MetricBand,
  Page,
  PageHeader,
  Section,
} from "@/components/ui";
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
    <Page>
      <PageHeader
        title="Overview"
        description="Who is using this instance, and what the workers are doing."
      />

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

      <MetricBand metrics={metrics} />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ── Newest users ── */}
        <Section
          title="Newest users"
          actions={
            <Link
              href="/orbit/users"
              className="inline-flex items-center gap-1 text-sm text-base-content/70 transition-colors hover:text-base-content"
            >
              All users
              <ArrowRightIcon size={13} aria-hidden="true" />
            </Link>
          }
        >

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
        </Section>

        {/* ── Queues ── */}
        <Section
          title="Queues"
          actions={
            <Link
              href="/orbit/queues"
              className="inline-flex items-center gap-1 text-sm text-base-content/70 transition-colors hover:text-base-content"
            >
              Manage jobs
              <ArrowRightIcon size={13} aria-hidden="true" />
            </Link>
          }
        >

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
        </Section>
      </div>
    </Page>
  );
}
