import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * The shared frame for /login and /register.
 *
 * Split layout rather than a centred card: the form sits on the left and the
 * right column carries the reassurance. On a sign-up page that column is doing
 * real work — it answers "what am I getting into?" at the moment the question
 * is being asked — and keeping both pages in the same frame means moving
 * between them doesn't feel like landing somewhere else.
 *
 * The aside is hidden below `lg`, where a single column is the only sensible
 * layout and the form is what matters.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  aside,
}: {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  aside?: { heading: string; points: string[]; footnote?: string };
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-base-100">
      <header className="border-b border-base-300/60">
        <Container className="flex h-16 items-center gap-4">
          <Link href="/" className="flex-1 font-semibold">
            Next.js Starter
          </Link>
          <ThemeToggle />
        </Container>
      </header>

      <Container as="main" id="main" className="flex flex-1 items-center py-12">
        <div className="grid w-full items-stretch gap-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-24">
          <div className="w-full self-center">
            <div className="mb-7">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-1.5 text-sm text-base-content/70">{subtitle}</p>
            </div>
            {children}
          </div>

          {/* `self-stretch` plus an inner centre keeps the rule spanning the
              whole row rather than floating at the height of its own text. */}
          {aside && (
            <aside className="hidden self-stretch border-l border-base-300 pl-12 lg:flex lg:flex-col lg:justify-center">
              <h2 className="text-sm tracking-wide text-base-content/50 uppercase">
                {aside.heading}
              </h2>
              <ul className="mt-5 flex flex-col gap-3.5">
                {aside.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <CheckIcon
                      size={16}
                      weight="bold"
                      className="mt-0.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="max-w-[46ch] text-sm leading-relaxed text-base-content/80">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              {aside.footnote && (
                <p className="mt-6 max-w-[46ch] text-xs leading-relaxed text-base-content/50">
                  {aside.footnote}
                </p>
              )}
            </aside>
          )}
        </div>
      </Container>
    </div>
  );
}
