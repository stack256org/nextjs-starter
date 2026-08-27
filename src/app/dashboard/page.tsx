import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { getViewer } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import {
  UserCircleIcon,
  GearSixIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Dashboard · Next.js Starter" };

export default async function DashboardPage() {
  const { user, isAdmin } = await getViewer();

  const sessionCount = await auth.api
    .listSessions({ headers: await headers() })
    .then((s) => s.length)
    .catch(() => null);

  const shortcuts = [
    {
      href: "/dashboard/profile",
      title: "Profile",
      description: "Your display name and avatar.",
      icon: UserCircleIcon,
    },
    {
      href: "/dashboard/settings",
      title: "Settings",
      description:
        sessionCount === null
          ? "Theme and account security."
          : `Theme, plus ${sessionCount} active session${sessionCount === 1 ? "" : "s"}.`,
      icon: GearSixIcon,
    },
    {
      href: "/ui",
      title: "Components",
      description: "Every shared component, documented.",
      icon: SquaresFourIcon,
    },
    ...(isAdmin
      ? [
          {
            href: "/orbit",
            title: "Orbit Admin",
            description: "Users, roles and the job queues.",
            icon: ShieldCheckIcon,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1.5 text-sm text-base-content/70">
          Signed in as {user.email}.
        </p>
      </header>

      {/* Rules rather than cards — nothing here needs elevation. */}
      <section>
        <h2 className="mb-1 text-sm tracking-wide text-base-content/50 uppercase">
          Your account
        </h2>
        <ul className="divide-y divide-base-300 border-y border-base-300">
          {shortcuts.map(({ href, title, description, icon: CardIcon }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-4 py-4 transition-colors hover:bg-base-200/60"
              >
                <CardIcon
                  size={20}
                  className="shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-base-content/70">
                    {description}
                  </span>
                </span>
                <ArrowRightIcon
                  size={16}
                  className="shrink-0 text-base-content/30 transition-transform group-hover:translate-x-0.5 group-hover:text-base-content/60"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-[68ch]">
        <h2 className="mb-1 text-sm tracking-wide text-base-content/50 uppercase">
          Build from here
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-base-content/70">
          This starter ships auth, a database layer, a job queue and a themed
          component set — but no product. Replace this page with whatever
          you&apos;re building.
        </p>
        <dl className="mt-5 flex flex-col gap-4 text-sm">
          <div>
            <dt className="font-medium">Add a table</dt>
            <dd className="mt-0.5 text-base-content/70">
              Edit{" "}
              <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs">
                src/lib/db/schema.ts
              </code>
              , then run{" "}
              <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs">
                pnpm db:generate
              </code>{" "}
              and{" "}
              <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs">
                pnpm db:migrate
              </code>
              .
            </dd>
          </div>
          <div>
            <dt className="font-medium">Add a background job</dt>
            <dd className="mt-0.5 text-base-content/70">
              Name it in{" "}
              <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs">
                src/lib/queue/jobs.ts
              </code>{" "}
              and handle it in{" "}
              <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs">
                worker.ts
              </code>
              .
            </dd>
          </div>
          <div>
            <dt className="font-medium">Build a screen</dt>
            <dd className="mt-0.5 text-base-content/70">
              Import from{" "}
              <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs">
                @/components/ui
              </code>{" "}
              — see the{" "}
              <Link href="/ui" className="link">
                component reference
              </Link>
              .
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
