import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { displayName } from "@/lib/auth/config";
import { formatDate } from "@/lib/format/session";
import { Badge, Page, PageHeader, Section } from "@/components/ui";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Profile · Next.js Starter" };

export const dynamic = "force-dynamic";

/** Human labels for BetterAuth's internal provider ids. */
const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  credential: "Email and password",
};

/**
 * Profile is identity — who you are and how you sign in.
 * Preferences and security live on Settings, so the two never overlap.
 */
export default async function ProfilePage() {
  const session = await getSession({ requireAuth: true });
  if (!session) return null;

  // A magic-link-only user has no rows here — expected, not an error.
  const accounts = await auth.api
    .listUserAccounts({ headers: await headers() })
    .catch(() => []);

  return (
    <Page className="max-w-2xl">
      <PageHeader
        title="Profile"
        description="How you appear across the app."
      />

      <ProfileForm
        name={displayName(session.user)}
        email={session.user.email}
        image={session.user.image ?? null}
      />

      <Section
        divided
        title="Sign-in methods"
        description="How you get into this account."
      >
        <ul className="divide-y divide-base-300 border-y border-base-300">
          <li className="flex items-center justify-between gap-4 py-3.5">
            <span className="text-sm font-medium">Magic link</span>
            <span className="text-xs text-base-content/60">
              {session.user.email}
            </span>
          </li>
          {accounts.map((account) => (
            <li
              key={account.id}
              className="flex items-center justify-between gap-4 py-3.5"
            >
              <span className="text-sm font-medium">
                {PROVIDER_LABELS[account.providerId] ?? account.providerId}
              </span>
              <span className="text-xs text-base-content/60">
                Linked {formatDate(account.createdAt)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <span className="text-base-content/70">
            Member since {formatDate(session.user.createdAt)}
          </span>
          <Badge tone={session.user.emailVerified ? "success" : "warning"}>
            {session.user.emailVerified ? "Email verified" : "Email unverified"}
          </Badge>
        </div>
      </Section>
    </Page>
  );
}
