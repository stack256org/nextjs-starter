import type { Metadata } from "next";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { displayName } from "@/lib/auth/config";
import { formatDate } from "@/lib/format/session";
import { Badge } from "@/components/ui";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Profile · Next.js Starter" };

export const dynamic = "force-dynamic";

/** Human labels for BetterAuth's internal provider ids. */
const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  credential: "Email and password",
};

export default async function ProfilePage() {
  const session = await getSession({ requireAuth: true });
  if (!session) return null;

  // A magic-link-only user has no rows here — that's expected, not an error.
  const accounts = await auth.api
    .listUserAccounts({ headers: await headers() })
    .catch(() => []);

  return (
    <div className="flex max-w-2xl flex-col gap-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1.5 text-sm text-base-content/70">
          How you appear across the app.
        </p>
      </header>

      <ProfileForm
        name={displayName(session.user)}
        email={session.user.email}
        image={session.user.image ?? null}
      />

      <section className="flex flex-col gap-4 border-t border-base-300 pt-10">
        <div>
          <h2 className="font-medium">Sign-in methods</h2>
          <p className="mt-1 text-sm text-base-content/70">
            How you get into this account.
          </p>
        </div>

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

        <dl className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <div>
            <dt className="text-xs tracking-wide text-base-content/50 uppercase">
              Member since
            </dt>
            <dd className="mt-1">{formatDate(session.user.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-base-content/50 uppercase">
              Email status
            </dt>
            <dd className="mt-1">
              <Badge tone={session.user.emailVerified ? "success" : "warning"}>
                {session.user.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
