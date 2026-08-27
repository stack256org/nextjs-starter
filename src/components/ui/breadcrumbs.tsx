import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

export interface Crumb {
  label: string;
  /** Omit on the final crumb — the current page is not a link. */
  href?: string;
}

/**
 * Location within the hierarchy.
 *
 * Worth adding at three levels of depth or more; on a flat site it is noise.
 * The last crumb is plain text with `aria-current="page"` rather than a link
 * to the page you are already on.
 */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <CaretRightIcon
                  size={12}
                  className="shrink-0 text-base-content/40"
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-base-content"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-base-content/60 transition-colors hover:text-base-content"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
