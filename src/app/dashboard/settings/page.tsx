import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { ThemePicker } from "./theme-picker";
import { SessionList } from "./session-list";

export const metadata: Metadata = { title: "Settings · Next.js Starter" };

export const dynamic = "force-dynamic";

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
    <div className="flex max-w-2xl flex-col gap-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1.5 text-sm text-base-content/70">
          Appearance and account security.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="font-medium">Appearance</h2>
          <p className="mt-1 max-w-[62ch] text-sm text-base-content/70">
            Stored in this browser, so it does not follow you to other devices.
          </p>
        </div>
        <ThemePicker />
      </section>

      <section className="flex flex-col gap-4 border-t border-base-300 pt-10">
        <div>
          <h2 className="font-medium">Active sessions</h2>
          <p className="mt-1 max-w-[62ch] text-sm text-base-content/70">
            Every device signed in as{" "}
            <span className="font-medium">{session.user.email}</span>. Sessions
            are stored in the database and checked on every request, so signing
            one out takes effect immediately.
          </p>
        </div>
        <SessionList sessions={sessions} />
      </section>
    </div>
  );
}
