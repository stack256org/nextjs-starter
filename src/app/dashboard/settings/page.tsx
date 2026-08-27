import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { Page, PageHeader, Section } from "@/components/ui";
import { ThemePicker } from "./theme-picker";
import { SessionList } from "./session-list";

export const metadata: Metadata = { title: "Settings · Next.js Starter" };

export const dynamic = "force-dynamic";

/**
 * Settings is preferences and security — how the app behaves for you, and
 * who is currently signed in. Identity lives on Profile.
 */
export default async function SettingsPage() {
  const session = await getSession({ requireAuth: true });
  if (!session) return null;

  const rawSessions = await auth.api
    .listSessions({ headers: await headers() })
    .catch(() => []);

  const sessions = rawSessions
    .map((s) => ({
      id: s.id,
      createdAt: new Date(s.createdAt).toISOString(),
      expiresAt: new Date(s.expiresAt).toISOString(),
      ipAddress: s.ipAddress ?? null,
      userAgent: s.userAgent ?? null,
      isCurrent: s.token === session.session.token,
    }))
    .sort((a, b) => Number(b.isCurrent) - Number(a.isCurrent));

  return (
    <Page className="max-w-2xl">
      <PageHeader
        title="Settings"
        description="Appearance and account security."
      />

      <Section
        title="Appearance"
        description="Stored in this browser, so it does not follow you to other devices."
      >
        <ThemePicker />
      </Section>

      <Section
        divided
        title="Active sessions"
        description={
          <>
            Every device signed in as{" "}
            <span className="font-medium">{session.user.email}</span>. Sessions
            live in the database and are checked on every request, so signing
            one out takes effect immediately.
          </>
        }
      >
        <SessionList sessions={sessions} />
      </Section>
    </Page>
  );
}
