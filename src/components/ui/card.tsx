import type { ReactNode } from "react";

/**
 * A surface with its own elevation.
 *
 * Use a card only when elevation communicates hierarchy — a thing that sits
 * *above* the page. For peers in a list, rules (`divide-y`) and whitespace
 * read better and weigh less; boxing everything in cards is the fastest way
 * to make a layout look generic.
 *
 * `overflow-hidden` is always on: children that reach the edge (a table, an
 * image, a full-width header) would otherwise square off the rounded corners.
 */
export interface CardProps {
  children: ReactNode;
  /** `flush` removes padding, for cards holding a table or media. */
  padding?: "none" | "normal";
  className?: string;
}

export function Card({
  children,
  padding = "normal",
  className = "",
}: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-box border border-base-300 bg-base-100 ${
        padding === "normal" ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  actions,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-start justify-between gap-x-6 gap-y-2 ${className}`}
    >
      <div className="min-w-0">
        <h3 className="font-medium">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-base-content/70">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
