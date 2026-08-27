import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * Page layout primitives.
 *
 * Every screen in the app is assembled from these, so headings, spacing and
 * section rhythm are defined once instead of re-invented per page. When you
 * add a screen, reach for `Page` → `PageHeader` → `Section` before writing a
 * bare `<div className="flex flex-col gap-6">`.
 *
 * The vertical scale is fixed at three steps so pages stay comparable:
 *   tight   gap-4   related controls
 *   normal  gap-6   blocks inside a section   (default)
 *   loose   gap-10  top-level page sections
 */

const gapClasses = {
  tight: "gap-4",
  normal: "gap-6",
  loose: "gap-10",
} as const;

export type Gap = keyof typeof gapClasses;

/** A vertical stack on the shared spacing scale. */
export function Stack({
  children,
  gap = "normal",
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  gap?: Gap;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag className={`flex flex-col ${gapClasses[gap]} ${className}`}>
      {children}
    </Tag>
  );
}

/**
 * The root of a page's content — sets the outer rhythm between sections.
 *
 * ```tsx
 * <Page>
 *   <PageHeader title="Users" description="…" actions={<Button>Invite</Button>} />
 *   <Section title="Active">…</Section>
 * </Page>
 * ```
 */
export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Stack gap="loose" className={className}>{children}</Stack>;
}

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons or links aligned to the end of the title row. */
  actions?: ReactNode;
  /** Renders a back link above the title, for detail pages. */
  backTo?: { href: string; label: string };
  /** Status chips shown under the title. */
  meta?: ReactNode;
}

/**
 * The standard page heading block.
 *
 * Always renders the `h1`, so heading order is correct on every page without
 * each one remembering to do it.
 */
export function PageHeader({
  title,
  description,
  actions,
  backTo,
  meta,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      {backTo && (
        <Link
          href={backTo.href}
          className="inline-flex w-fit items-center gap-1 text-sm text-base-content/60 transition-colors hover:text-base-content"
        >
          <CaretLeftIcon size={13} aria-hidden="true" />
          {backTo.label}
        </Link>
      )}

      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1.5 max-w-[68ch] text-sm text-base-content/70">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>

      {meta && <div className="flex flex-wrap gap-1.5">{meta}</div>}
    </header>
  );
}

export interface SectionProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  /** Draws a rule above the section — use to separate top-level blocks. */
  divided?: boolean;
  className?: string;
}

/**
 * A titled block of content. Renders an `h2`, so the heading hierarchy stays
 * sequential under `PageHeader`'s `h1`.
 */
export function Section({
  title,
  description,
  actions,
  children,
  divided = false,
  className = "",
}: SectionProps) {
  return (
    <section
      className={`flex flex-col gap-4 ${divided ? "border-t border-base-300 pt-10" : ""} ${className}`}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            {title && <h2 className="font-medium">{title}</h2>}
            {description && (
              <p className="mt-1 max-w-[68ch] text-sm text-base-content/70">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * A key/value block — the standard way to present read-only record details.
 *
 * Numbers use tabular figures via `globals.css`, so columns line up.
 */
export function DetailList({
  items,
  columns = 4,
  className = "",
}: {
  /** `label` doubles as the React key, so keep labels unique within a list. */
  items: { label: string; value: ReactNode }[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <dl
      className={`grid grid-cols-2 gap-x-8 gap-y-4 border-y border-base-300 py-5 ${cols} ${className}`}
    >
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs tracking-wide text-base-content/60 uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 truncate text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * A band of metrics separated by rules rather than boxed in cards.
 *
 * Cards imply elevation; these are peers, so hairlines are the honest
 * separator and they read as one group.
 */
export function MetricBand({
  metrics,
  className = "",
}: {
  /** `label` doubles as the React key, so keep labels unique within a band. */
  metrics: { label: string; value: ReactNode; alert?: boolean }[];
  className?: string;
}) {
  return (
    <dl
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-box bg-base-300 sm:grid-cols-3 lg:grid-cols-6 ${className}`}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-base-100 px-4 py-5">
          <dt className="text-xs tracking-wide text-base-content/60 uppercase">
            {metric.label}
          </dt>
          <dd
            className={`mt-1.5 font-mono text-2xl ${metric.alert ? "text-error" : ""}`}
          >
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
