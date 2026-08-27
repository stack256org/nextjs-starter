import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { displayName } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { describeUserAgent, formatDateTime, formatDate } from "@/lib/format/session";
import { Avatar, Badge, EmptyState } from "@/components/ui";
import { ImpersonateButton } from "@/components/orbit/impersonate-button";
import { UserAdminPanel } from "./user-admin-panel";
import {
  ArrowLeftIcon,
  DevicesIcon,
  MonitorIcon,
} from "@phosphor-icons/react/dist/ssr";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const [user] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, id));

  if (!user) return { title: "User not found · Orbit Admin" };
  return { title: `${displayName(user)} · Users · Orbit Admin` };
}

export default async function UserDetailPage({ params }: PageProps) {
  const session = await requireAdmin();
  const { id } = await params;

  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) notFound();

  const [rawSessions, accounts] = await Promise.all([
    auth.api
      .listUserSessions({ headers: await headers(), body: { userId: id } })
      .then((r) => (r as unknown as { sessions?: SessionRow[] }).sessions ?? [])
      .catch(() => [] as SessionRow[]),
    auth.api
      .listUserAccounts({ headers: await headers(), query: { userId: id } })
      .catch(() => []),
  ]);

  // Runs per request — see `dynamic = "force-dynamic"` above.
  // oxlint-disable-next-line purity
  const now = Date.now();
  const activeSessions = rawSessions.filter(
    (s) => new Date(s.expiresAt).getTime() > now,
  );

  const isSelf = user.id === session.user.id;
  const name = displayName(user);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/orbit/users"
        className="inline-flex w-fit items-center gap-1 text-sm text-base-content/70 transition-colors hover:text-base-content"
      >
        <ArrowLeftIcon size={14} aria-hidden="true" />
        All users
      </Link>

      {/* ── Identity ── */}
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar src={user.image} name={name} size="2xl" shape="squircle" />
          <div>
            <h1 className="text-2xl font-semibold">{name}</h1>
            <p className="text-sm text-base-content/70">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge tone={user.role === "admin" ? "primary" : "ghost"}>
                {user.role}
              </Badge>
              {isSelf && <Badge tone="info">You</Badge>}
              {user.banned && <Badge tone="error">Banned</Badge>}
              <Badge tone={user.emailVerified ? "success" : "warning"}>
                {user.emailVerified ? "Email verified" : "Email unverified"}
              </Badge>
            </div>
          </div>
        </div>

        <ImpersonateButton
          userId={user.id}
          disabled={user.role === "admin" || isSelf || Boolean(user.banned)}
        />
      </header>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-base-300 py-5 text-sm sm:grid-cols-4">
        <Detail label="Joined" value={formatDate(user.createdAt)} />
        <Detail label="Last updated" value={formatDate(user.updatedAt)} />
        <Detail
          label="Active sessions"
          value={String(activeSessions.length)}
        />
        <Detail
          label="Sign-in methods"
          value={
            accounts.length === 0
              ? "Magic link only"
              : accounts.map((a) => a.providerId).join(", ")
          }
        />
      </dl>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* ── Sessions ── */}
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold">Login sessions</h2>
            <p className="mt-1 text-sm text-base-content/60">
              Every device with a live session for this account. Each row is a
              row in the <code className="rounded bg-base-300 px-1">sessions</code>{" "}
              table, validated on every request.
            </p>
          </div>

          {activeSessions.length === 0 ? (
            <EmptyState
              icon={<DevicesIcon size={36} aria-hidden="true" />}
              title="No active sessions"
              description="This person isn't signed in anywhere right now."
            />
          ) : (
            <ul className="divide-y divide-base-300 rounded-box border border-base-300">
              {activeSessions.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-start justify-between gap-3 px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <MonitorIcon
                      size={18}
                      className="mt-0.5 shrink-0 text-base-content/50"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {describeUserAgent(s.userAgent)}
                        {s.impersonatedBy && (
                          <Badge tone="warning">impersonation</Badge>
                        )}
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-base-content/60">
                        {s.ipAddress || "unknown IP"}
                      </div>
                      <div className="mt-1 text-xs text-base-content/60">
                        Started {formatDateTime(s.createdAt)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-base-content/60">
                    Expires {formatDateTime(s.expiresAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Admin controls ── */}
        <aside className="lg:border-l lg:border-base-300 lg:pl-8">
          <UserAdminPanel
            userId={user.id}
            email={user.email}
            currentRole={user.role}
            banned={Boolean(user.banned)}
            banReason={user.banReason}
            sessionCount={activeSessions.length}
            isSelf={isSelf}
          />
        </aside>
      </div>
    </div>
  );
}

interface SessionRow {
  id: string;
  createdAt: string | Date;
  expiresAt: string | Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-base-content/60 uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
