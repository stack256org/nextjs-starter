import type { ReactNode } from "react";

export interface DividerProps {
  /** Optional label rendered in the middle of the rule. */
  children?: ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * A separating rule.
 *
 * Rendered with `role="separator"` when it carries no label, so screen
 * readers announce the break; a labelled divider is announced by its text
 * instead.
 */
export function Divider({
  children,
  orientation = "horizontal",
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    // A real <hr> rather than role="separator": the element already carries
    // that role, and `aria-orientation` tells assistive tech which way it runs.
    return (
      <hr
        aria-orientation="vertical"
        className={`h-auto w-px self-stretch border-0 bg-base-300 ${className}`}
      />
    );
  }

  if (!children) {
    return (
      <hr className={`border-0 border-t border-base-300 ${className}`} />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-base-300" aria-hidden="true" />
      <span className="text-xs text-base-content/60">{children}</span>
      <span className="h-px flex-1 bg-base-300" aria-hidden="true" />
    </div>
  );
}
