import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { displayName } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  describeUserAgent,
  formatDateTime,
  formatDate,
  formatIpAddress,
} from "@/lib/format/session";
import {
  Avatar,
  Badge,
  DetailList,
  EmptyState,
  Page,
  PageHeader,
  Section,
} from "@/components/ui";
import { ImpersonateButton } from "@/components/orbit/impersonate-button";
import { UserAdminPanel } from "./user-admin-panel";
import { DevicesIcon, MonitorIcon } from "@phosphor-icons/react/dist/ssr";

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
    <Page>
      <PageHeader
        backTo={{ href: "/orbit/users", label: "All users" }}
        title={
          <span className="flex items-center gap-3">
            <Avatar src={user.image} name={name} size="xl" shape="squircle" />
            <span className="min-w-0">
              <span className="block truncate">{name}</span>
              <span className="block truncate text-sm font-normal text-base-content/70">
                {user.email}
              </span>
            </span>
          </span>
        }
        meta={
          <>
            <Badge tone={user.role === "admin" ? "primary" : "ghost"}>
              {user.role}
            </Badge>
            {isSelf && <Badge tone="info">You</Badge>}
            {user.banned && <Badge tone="error">Banned</Badge>}
            <Badge tone={user.emailVerified ? "success" : "warning"}>
              {user.emailVerified ? "Email verified" : "Email unverified"}
            </Badge>
          </>
        }
        actions={
          <ImpersonateButton
            userId={user.id}
            disabled={user.role === "admin" || isSelf || Boolean(user.banned)}
          />
        }
      />

      <DetailList
        items={[
          { label: "Joined", value: formatDate(user.createdAt) },
          { label: "Last updated", value: formatDate(user.updatedAt) },
          { label: "Active sessions", value: String(activeSessions.length) },
          {
            label: "Sign-in methods",
            value:
              accounts.length === 0
                ? "Magic link only"
                : accounts.map((a) => a.providerId).join(", "),
          },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* ── Sessions ── */}
        <Section
          title="Login sessions"
          description="Every device with a live session for this account. Each row is a row in the sessions table, validated on every request."
        >

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
                        {formatIpAddress(s.ipAddress)}
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
        </Section>

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
    </Page>
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

