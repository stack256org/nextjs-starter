"use client";

import type { ReactNode } from "react";
import { XIcon } from "@phosphor-icons/react/dist/ssr";

export interface TagProps {
  children: ReactNode;
  /** Renders a remove control. Omit for a static label. */
  onRemove?: () => void;
  /** Used in the remove button's accessible name. */
  label?: string;
  tone?: "neutral" | "primary" | "success" | "warning" | "error";
  className?: string;
}

const toneClasses = {
  neutral: "bg-base-200 text-base-content",
  primary: "bg-primary/12 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/12 text-error",
} as const;

/**
 * A removable label — a filter chip, a selected recipient, a keyword.
 *
 * Distinct from `Badge`, which is a read-only status marker. If it can be
 * dismissed, it is a Tag; if it only reports state, it is a Badge.
 *
 * The remove button gets its own accessible name ("Remove design") rather
 * than a bare "×", which is meaningless read aloud.
 */
export function Tag({
  children,
  onRemove,
  label,
  tone = "neutral",
  className = "",
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-selector py-1 pl-2.5 text-xs font-medium ${
        onRemove ? "pr-1" : "pr-2.5"
      } ${toneClasses[tone]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label ?? String(children)}`}
          className="flex size-4 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-base-content/15"
        >
          <XIcon size={10} weight="bold" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
