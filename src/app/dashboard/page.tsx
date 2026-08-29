import type { Metadata } from "next";
import { headers } from "next/headers";
import { getViewer } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { describeUserAgent, formatDate, formatDateTime } from "@/lib/format/session";
import {
  Badge,
  ButtonLink,
  DetailList,
  Page,
  PageHeader,
  Section,
} from "@/components/ui";

export const metadata: Metadata = { title: "Dashboard · Next.js Starter" };

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ welcome?: string }>;
}

/**
 * The signed-in home screen.
 *
 * A dashboard should show state, not navigation — account links live in the
 * avatar menu, not as tiles here. With no product data in a starter, the
 * honest thing to show is the account's own state: who you are, where you're
 * signed in, and what to build next.
 *
 * Replace the "Start here" section with your product's real content; the
 * account summary above it is worth keeping.
 */
export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { session, user, isAdmin } = await getViewer();

  // Set by AFTER_SIGN_UP_URL, which BetterAuth uses only on the request that
  // creates the account.
  const isNew = (await searchParams).welcome === "1";

  const sessions = await auth.api
    .listSessions({ headers: await headers() })
    .catch(() => []);

  const otherDevices = sessions.filter((s) => s.token !== session.session.token);

  return (
    <Page>
      <PageHeader
        title={
          isNew
            ? `You're all set, ${user.name.split(" ")[0]}`
            : `Welcome back, ${user.name.split(" ")[0]}`
        }
        description={
          isNew
            ? "Your account is ready. Here's what it looks like."
            : "Your account at a glance."
        }
        meta={
          <>
            <Badge tone={isAdmin ? "primary" : "ghost"}>{user.role}</Badge>
            <Badge tone={session.user.emailVerified ? "success" : "warning"}>
              {session.user.emailVerified ? "Email verified" : "Email unverified"}
            </Badge>
          </>
        }
      />

      <DetailList
        items={[
          { label: "Signed in as", value: user.email },
          { label: "Member since", value: formatDate(session.user.createdAt) },
          {
            label: "Active sessions",
            value: `${sessions.length} device${sessions.length === 1 ? "" : "s"}`,
          },
          {
            label: "This session expires",
            value: formatDate(session.session.expiresAt),
          },
        ]}
      />

      <Section
        title="Where you're signed in"
        description="Sessions are stored in the database and checked on every request, so signing one out takes effect immediately."
        actions={
          <ButtonLink href="/dashboard/settings" size="sm">
            Manage sessions
          </ButtonLink>
        }
      >
        <ul className="divide-y divide-base-300 border-y border-base-300">
          <li className="flex flex-wrap items-center justify-between gap-3 py-3.5">
            <span className="flex items-center gap-2 text-sm">
              <span className="font-medium">
                {describeUserAgent(session.session.userAgent)}
              </span>
              <Badge tone="primary">This device</Badge>
            </span>
            <span className="text-xs text-base-content/60">
              Since {formatDateTime(session.session.createdAt)}
            </span>
          </li>
          {otherDevices.slice(0, 3).map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3.5"
            >
              <span className="text-sm font-medium">
                {describeUserAgent(s.userAgent)}
              </span>
              <span className="text-xs text-base-content/60">
                Since {formatDateTime(s.createdAt)}
              </span>
            </li>
          ))}
        </ul>
        {otherDevices.length > 3 && (
          <p className="text-xs text-base-content/60">
            and {otherDevices.length - 3} more.
          </p>
        )}
      </Section>

      <Section
        divided
        title="Start here"
        description="This starter ships the plumbing and no product. Delete this section and build your application in its place."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
            <h3 className="text-sm font-semibold text-base-content">1. Add a database table</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              Edit <Code>src/lib/db/schema.ts</Code>, then run{" "}
              <Code>pnpm db:generate</Code> and <Code>pnpm db:migrate</Code>.
            </p>
          </div>
          <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
            <h3 className="text-sm font-semibold text-base-content">2. Add a background job</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              Name it in <Code>src/lib/queue/jobs.ts</Code> and handle it in{" "}
              <Code>worker.ts</Code>. Inspect live queue depth in Orbit.
            </p>
          </div>
          <div className="rounded-box border border-base-300 bg-base-100 p-5 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-sm">
            <h3 className="text-sm font-semibold text-base-content">3. Build a feature view</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              Compose <Code>Page</Code>, <Code>PageHeader</Code> and{" "}
              <Code>Section</Code> from <Code>@/components/ui</Code>.
            </p>
          </div>
        </div>
      </Section>
    </Page>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs text-base-content/90">
      {children}
    </code>
  );
}
