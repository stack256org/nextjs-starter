import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Builds the href for a page number — keeps filters in the query string. */
  buildHref: (page: number) => string;
  /** Total row count, shown alongside the page position. */
  totalItems?: number;
  itemNoun?: string;
  className?: string;
}

/**
 * Page navigation, rendered as links rather than buttons.
 *
 * Links mean each page is shareable, opens in a new tab, and works with the
 * browser's back button — none of which a button with an onClick gives you.
 * Out-of-range controls render as disabled spans, so they are neither
 * focusable nor followable.
 */
export function Pagination({
  page,
  totalPages,
  buildHref,
  totalItems,
  itemNoun = "item",
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-between gap-3 ${className}`}
    >
      <p className="text-sm text-base-content/60">
        Page {page} of {totalPages}
        {typeof totalItems === "number" && (
          <>
            {" · "}
            {totalItems} {itemNoun}
            {totalItems === 1 ? "" : "s"}
          </>
        )}
      </p>

      <div className="join">
        <PageLink
          href={buildHref(page - 1)}
          disabled={atStart}
          label="Previous page"
        >
          <CaretLeftIcon size={13} aria-hidden="true" />
          Previous
        </PageLink>
        <PageLink href={buildHref(page + 1)} disabled={atEnd} label="Next page">
          Next
          <CaretRightIcon size={13} aria-hidden="true" />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const classes = "btn btn-sm join-item";

  if (disabled) {
    return (
      <span className={`${classes} btn-disabled`} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={label}>
      {children}
    </Link>
  );
}
