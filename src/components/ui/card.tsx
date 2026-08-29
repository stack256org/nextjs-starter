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
  padding?: "none" | "normal" | "compact";
  /** Adds interactive hover elevation and border highlight. */
  hoverable?: boolean;
  /** Visual variant: default (bordered surface), subtle (soft fill), ghost (border only). */
  variant?: "default" | "subtle" | "ghost";
  className?: string;
}

export function Card({
  children,
  padding = "normal",
  hoverable = false,
  variant = "default",
  className = "",
}: CardProps) {
  const paddingClass =
    padding === "normal" ? "p-5 sm:p-6" : padding === "compact" ? "p-3 sm:p-4" : "";

  const variantClass =
    variant === "subtle"
      ? "bg-base-200/60 border border-base-300/80"
      : variant === "ghost"
        ? "bg-transparent border border-base-300"
        : "bg-base-100 border border-base-300 shadow-xs";

  const hoverClass = hoverable
    ? "transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    : "";

  return (
    <div
      className={`overflow-hidden rounded-box ${variantClass} ${paddingClass} ${hoverClass} ${className}`}
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
