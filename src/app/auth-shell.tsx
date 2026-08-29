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
      <header className="border-b border-base-300/60 bg-base-100/90 backdrop-blur-md">
        <Container className="flex h-16 items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded bg-primary font-mono text-xs font-bold text-primary-content">
              N
            </span>
            <span>Next.js Starter</span>
          </Link>
          <div className="flex-1" />
          <ThemeToggle />
        </Container>
      </header>

      <Container as="main" id="main" className="flex flex-1 items-center justify-center py-8 sm:py-12 lg:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-16">
          <div className="w-full">
            <div className="rounded-box border border-base-300 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-base-content">{title}</h1>
                <p className="mt-1.5 text-sm text-base-content/70">{subtitle}</p>
              </div>
              {children}
            </div>
          </div>

          {aside && (
            <aside className="hidden flex-col justify-center gap-6 lg:flex">
              <div>
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  {aside.heading}
                </span>
                <ul className="mt-4 flex flex-col gap-3">
                  {aside.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 rounded-field border border-base-300/80 bg-base-200/40 p-3.5"
                    >
                      <CheckIcon
                        size={18}
                        weight="bold"
                        className="mt-0.5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-relaxed text-base-content/80">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {aside.footnote && (
                <p className="max-w-[46ch] text-xs leading-relaxed text-base-content/50">
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
