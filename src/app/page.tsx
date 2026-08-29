import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/helpers";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge, ButtonLink, Card, Container } from "@/components/ui";
import {
  DatabaseIcon,
  StackIcon,
  FingerprintIcon,
  PaletteIcon,
  ShieldCheckIcon,
  TerminalWindowIcon,
  ArrowRightIcon,
  SparkleIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Next.js Starter · Production Ready App Foundation" };

const features = [
  {
    icon: DatabaseIcon,
    title: "Drizzle on PostgreSQL",
    body: "Fully typed schema, generated migrations, and a connection pool wired into every server component, CLI script, and background worker.",
    badge: "PostgreSQL",
  },
  {
    icon: StackIcon,
    title: "pgBoss Job Queue",
    body: "Postgres-backed background jobs running in a dedicated process. Retry, cancel, and inspect jobs live in the Orbit admin area.",
    badge: "pgBoss",
  },
  {
    icon: FingerprintIcon,
    title: "BetterAuth & Security",
    body: "Magic links out of the box, Google OAuth, role gates, user impersonation, and database-backed sessions with immediate revocation.",
    badge: "BetterAuth",
  },
  {
    icon: PaletteIcon,
    title: "Headless UI + DaisyUI",
    body: "36 accessible components built on Headless UI primitives and DaisyUI semantic tokens. Live documentation and test gallery at /ui.",
    badge: "Tailwind v4",
  },
  {
    icon: ShieldCheckIcon,
    title: "Orbit Admin Suite",
    body: "Full-bleed admin console with role promotion, account banning, live queue metrics, and session inspection.",
    badge: "Admin UI",
  },
  {
    icon: EnvelopeSimpleIcon,
    title: "Asynchronous Email Delivery",
    body: "Nodemailer SMTP integration queued through the worker process so email delivery never blocks user web requests.",
    badge: "Nodemailer",
  },
];

const techStack = [
  "Next.js 16 (App Router)",
  "React 19",
  "TypeScript 7",
  "Tailwind CSS v4",
  "DaisyUI v5",
  "Drizzle ORM",
  "BetterAuth",
  "pgBoss",
  "Oxlint",
];

export default async function Home() {
  const session = await getSession();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-base-100">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-base-300/80 bg-base-100/90 backdrop-blur-md">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-90">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-content shadow-xs">
              N
            </span>
            <span>Next.js Starter</span>
          </Link>
          <nav aria-label="Main" className="flex items-center gap-2">
            <Link
              href="/ui"
              className="btn btn-ghost btn-sm text-xs font-medium text-base-content/80 hover:text-base-content"
            >
              UI Gallery
            </Link>
            <ThemeToggle />
            {session ? (
              <ButtonLink href="/dashboard" variant="primary" size="sm">
                Dashboard
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/login" variant="ghost" size="sm">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/register" variant="primary" size="sm">
                  Get started
                </ButtonLink>
              </>
            )}
          </nav>
        </Container>
      </header>

      <main id="main" className="flex-1">
        {/* ── Hero Section ── */}
        <section className="border-b border-base-300/60 bg-gradient-to-b from-base-200/40 via-base-100 to-base-100 py-12 sm:py-16 lg:py-20">
          <Container>
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
              <div className="flex flex-col items-start gap-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary">
                  <SparkleIcon size={14} weight="fill" />
                  <span>Production-Grade Architecture</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-base-content sm:text-5xl lg:text-6xl">
                  The parts you rebuild every time,{" "}
                  <span className="text-primary">already built</span>
                </h1>

                <p className="max-w-[56ch] text-base leading-relaxed text-base-content/75 sm:text-lg">
                  Passwordless auth, typed database layer, background job worker,
                  admin suite, and a cohesive themed component library — fully wired, tested,
                  and documented.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <ButtonLink
                    href={session ? "/dashboard" : "/register"}
                    variant="primary"
                    size="lg"
                    className="shadow-sm"
                  >
                    {session ? "Open Dashboard" : "Start with Template"}
                    <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
                  </ButtonLink>
                  <ButtonLink href="/ui" variant="outline" size="lg">
                    Explore Components
                  </ButtonLink>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-base-content/60">
                  <span className="flex items-center gap-1.5">
                    <CheckCircleIcon size={16} weight="fill" className="text-success" />
                    Strict TypeScript
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircleIcon size={16} weight="fill" className="text-success" />
                    Zero FOUC Themes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircleIcon size={16} weight="fill" className="text-success" />
                    PostgreSQL-Backed
                  </span>
                </div>
              </div>

              {/* Code / Architecture Card */}
              <div className="w-full">
                <div className="overflow-hidden rounded-box border border-base-300 bg-base-200/60 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between border-b border-base-300 bg-base-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-full bg-error/70" />
                      <span className="size-3 rounded-full bg-warning/70" />
                      <span className="size-3 rounded-full bg-success/70" />
                    </div>
                    <span className="font-mono text-xs text-base-content/60">src/lib/app.ts</span>
                    <TerminalWindowIcon size={16} className="text-base-content/40" />
                  </div>
                  <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-base-content/90">
                    <code>
                      <span className="text-primary/70">{"// 1. Type-safe Database & ORM"}</span>{"\n"}
                      <span className="text-secondary font-semibold">import</span> &#123; db &#125; <span className="text-secondary font-semibold">from</span> <span className="text-success">"@/lib/db"</span>;{"\n"}
                      <span className="text-secondary font-semibold">import</span> &#123; users &#125; <span className="text-secondary font-semibold">from</span> <span className="text-success">"@/lib/db/schema"</span>;{"\n\n"}
                      <span className="text-primary/70">{"// 2. Queue Asynchronous Work"}</span>{"\n"}
                      <span className="text-secondary font-semibold">import</span> &#123; sendJob &#125; <span className="text-secondary font-semibold">from</span> <span className="text-success">"@/lib/queue"</span>;{"\n"}
                      <span className="text-secondary font-semibold">await</span> sendJob(<span className="text-success">"send-email"</span>, &#123; to, subject &#125;);{"\n\n"}
                      <span className="text-primary/70">{"// 3. Composable Headless UI Elements"}</span>{"\n"}
                      <span className="text-secondary font-semibold">import</span> &#123; Button, Modal, Card &#125; <span className="text-secondary font-semibold">from</span> <span className="text-success">"@/components/ui"</span>;
                    </code>
                  </pre>
                  <div className="border-t border-base-300/80 bg-base-100/70 px-4 py-2.5 text-xs text-base-content/70">
                    <span className="font-medium text-base-content">Ready for production:</span> All layers verified end-to-end.
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Features Grid ── */}
        <section className="py-14 sm:py-20">
          <Container>
            <div className="mb-10 flex flex-col items-center text-center">
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                Battery-Included Features
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
                Everything required to ship fast
              </h2>
              <p className="mt-2 max-w-[56ch] text-sm text-base-content/70">
                Built with modern web standards and architectural separation so you can focus on building features.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: FeatureIcon, title, body, badge }) => (
                <Card key={title} hoverable padding="normal" className="flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FeatureIcon size={22} weight="duotone" aria-hidden="true" />
                      </div>
                      <Badge tone="ghost" size="xs">
                        {badge}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-base-content">{title}</h3>
                    <p className="text-sm leading-relaxed text-base-content/70">{body}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Tech Stack Band ── */}
        <section className="border-y border-base-300/80 bg-base-200/40 py-10">
          <Container className="flex flex-col items-center gap-5 text-center">
            <span className="text-xs font-semibold tracking-wider text-base-content/50 uppercase">
              Curated Modern Stack
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} tone="neutral" size="md" className="px-3 py-2 font-medium">
                  {tech}
                </Badge>
              ))}
            </div>
          </Container>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-base-300 bg-base-100">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-base-content/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base-content">Next.js Starter</span>
            <span>· MIT licensed</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-5">
            <Link href="/ui" className="link link-hover">
              Components
            </Link>
            <Link href="/login" className="link link-hover">
              Sign in
            </Link>
            <Link href="/register" className="link link-hover">
              Create an account
            </Link>
          </nav>
        </Container>
      </footer>
    </div>
  );
}

