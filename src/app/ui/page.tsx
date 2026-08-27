import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Gallery } from "./gallery";

/**
 * The component gallery.
 *
 * `robots: noindex, nofollow` keeps it out of search results — it's an
 * internal reference, not a public page. It stays reachable by URL so anyone
 * working on the app can check a component without running Storybook.
 */
export const metadata: Metadata = {
  title: "Components · Next.js Starter",
  description:
    "Every shared component in this starter: Headless UI behaviour, DaisyUI styling.",
  robots: { index: false, follow: false },
};

const CONTENTS = [
  { id: "button", label: "Button" },
  { id: "input", label: "Input and Textarea" },
  { id: "choice", label: "Checkbox, Radio, Toggle" },
  { id: "select", label: "Select and Combobox" },
  { id: "overlays", label: "Dropdown, Popover, Modal" },
  { id: "disclosure", label: "Tabs and Disclosure" },
  { id: "feedback", label: "Alert, Badge, Avatar" },
  { id: "states", label: "Loading and empty states" },
];

export default function UiPage() {
  return (
    <div className="min-h-[100dvh] bg-base-100">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-base-300 bg-base-100/95 px-4 backdrop-blur sm:px-6">
        <div className="flex flex-1 items-center gap-3">
          <Link href="/" className="font-semibold">
            Next.js Starter
          </Link>
          <span className="text-sm text-base-content/50">Components</span>
        </div>
        <ThemeToggle />
      </header>

      <div className="mx-auto flex max-w-6xl gap-12 px-4 py-10 sm:px-6">
        {/* Contents rail — asymmetric layout rather than a centred column. */}
        <nav
          aria-label="Components"
          className="sticky top-24 hidden h-fit w-52 shrink-0 lg:block"
        >
          <p className="mb-3 text-xs tracking-wide text-base-content/50 uppercase">
            On this page
          </p>
          <ul className="flex flex-col gap-1 border-l border-base-300">
            {CONTENTS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="-ml-px block border-l border-transparent py-1 pl-3 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-base-content"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main id="main" className="min-w-0 flex-1">
          <div className="mb-12 max-w-[62ch]">
            <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
            <p className="mt-3 text-base-content/70">
              Every shared component in this starter. Behaviour comes from
              Headless UI, so keyboard navigation, focus management and ARIA
              wiring are handled rather than reimplemented. Styling comes from
              DaisyUI semantic tokens, so switching the theme restyles all of it
              — try the toggle above, or pick another theme in{" "}
              <Link href="/dashboard/settings" className="link">
                settings
              </Link>
              .
            </p>
            <p className="mt-3 text-sm text-base-content/60">
              Import from{" "}
              <code className="rounded bg-base-200 px-1.5 py-0.5 font-mono text-xs">
                @/components/ui
              </code>
              . This page is excluded from search engines.
            </p>
          </div>

          <Gallery />
        </main>
      </div>
    </div>
  );
}
