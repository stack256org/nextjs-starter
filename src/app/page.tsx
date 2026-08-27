import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/helpers";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink, Container } from "@/components/ui";
import {
  DatabaseIcon,
  StackIcon,
  FingerprintIcon,
  PaletteIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Next.js Starter" };

const features = [
  {
    icon: DatabaseIcon,
    title: "Drizzle on PostgreSQL",
    body: "A typed schema, generated migrations, and a connection pool that is already wired into every server component and CLI.",
  },
  {
    icon: StackIcon,
    title: "pgBoss job queue",
    body: "Background work runs in its own process against the same database. Retry, cancel and inspect any job from the admin area.",
  },
  {
    icon: FingerprintIcon,
    title: "BetterAuth",
    body: "Magic links out of the box, Google OAuth when you add credentials, plus roles, impersonation and database-backed sessions.",
  },
  {
    icon: PaletteIcon,
    title: "Headless UI and DaisyUI",
    body: "Accessible behaviour from Headless UI, theming from DaisyUI tokens. Every component is documented on one page.",
  },
];

/**
 * Public landing page.
 *
 * A Server Component so it can read the session — showing "Sign in" to
 * someone who is already signed in is the most common reason a working login
 * looks broken.
 */
export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-base-100">
      <header className="border-b border-base-300/60">
        <Container className="flex h-16 items-center gap-4">
        <span className="flex-1 font-semibold">Next.js Starter</span>
        <nav aria-label="Main" className="flex items-center gap-1">
          <ThemeToggle />
          <ButtonLink
            href={session ? "/dashboard" : "/login"}
            variant="primary"
            size="sm"
          >
            {session ? "Dashboard" : "Sign in"}
          </ButtonLink>
        </nav>
        </Container>
      </header>

      <Container as="main" id="main" className="flex-1">
        {/* Left-aligned, asymmetric hero — not a centred column. */}
        <section className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="max-w-[22ch]">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              The parts you rebuild every time, already built
            </h1>
          </div>

          <div className="flex flex-col gap-6 lg:pt-2">
            <p className="max-w-[58ch] text-lg leading-relaxed text-base-content/70">
              Auth, a typed database layer, a background worker, an admin area
              and a themed component set — wired together, tested end to end,
              and documented. Clone it and start on the part that is actually
              yours.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href={session ? "/dashboard" : "/login"}
                variant="primary"
              >
                {session ? "Open the dashboard" : "Get started"}
                <ArrowRightIcon size={16} aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* Two-column zig-zag, separated by rules rather than boxed in cards. */}
        <section className="border-t border-base-300 py-16">
          <h2 className="mb-10 text-sm tracking-wide text-base-content/50 uppercase">
            What is included
          </h2>
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {features.map(({ icon: FeatureIcon, title, body }) => (
              <div key={title} className="flex gap-4">
                <FeatureIcon
                  size={22}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-medium">{title}</h3>
                  <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-base-content/70">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>

      <footer className="border-t border-base-300">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-base-content/60">
          <span>MIT licensed. Use it for anything.</span>
          <nav aria-label="Footer" className="flex gap-5">
            <Link href="/login" className="link link-hover">
              Sign in
            </Link>
          </nav>
        </Container>
      </footer>
    </div>
  );
}
