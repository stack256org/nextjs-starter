import type { ReactNode } from "react";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

/* ─────────────────────────── Alert ─────────────────────────── */

export type AlertTone = "info" | "success" | "warning" | "error";

const alertConfig = {
  info: { className: "alert-info", Icon: InfoIcon },
  success: { className: "alert-success", Icon: CheckCircleIcon },
  warning: { className: "alert-warning", Icon: WarningIcon },
  error: { className: "alert-error", Icon: XCircleIcon },
} as const;

export interface AlertProps {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** `role="alert"` interrupts a screen reader; use it only for errors. */
  assertive?: boolean;
}

export function Alert({
  tone = "info",
  title,
  children,
  className = "",
  assertive = false,
}: AlertProps) {
  const { className: toneClass, Icon } = alertConfig[tone];

  return (
    <div
      role={assertive ? "alert" : "status"}
      className={`alert ${toneClass} ${className}`}
    >
      <Icon size={20} aria-hidden="true" className="shrink-0" />
      <div className="flex flex-col gap-0.5 text-left">
        {title && <span className="font-medium">{title}</span>}
        {children && <span className="text-sm opacity-90">{children}</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────── Badge ─────────────────────────── */

export type BadgeTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "ghost";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "badge-neutral",
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  ghost: "badge-ghost",
};

export interface BadgeProps {
  tone?: BadgeTone;
  size?: "xs" | "sm" | "md" | "lg";
  outline?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({
  tone = "ghost",
  size = "sm",
  outline = false,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`badge badge-${size} ${badgeTones[tone]} ${
        outline ? "badge-outline" : ""
      } ${className}`}
    >
      {children}
    </span>
  );
}

/* ───────────────────────── Skeleton ────────────────────────── */

/**
 * A loading placeholder shaped like the content it replaces.
 *
 * Matching the real layout keeps the page from reflowing when data lands,
 * which a centred spinner cannot do.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_unused, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/** A skeleton shaped like a data table, for `loading.tsx` files. */
export function SkeletonTable({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-box border border-base-300"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex gap-4 border-b border-base-300 bg-base-200 px-4 py-3">
        {Array.from({ length: columns }, (_unused, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_row, r) => (
        <div key={r} className="flex gap-4 border-b border-base-300 px-4 py-4 last:border-b-0">
          {Array.from({ length: columns }, (_cell, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/* ──────────────────────── Empty state ──────────────────────── */

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * A composed empty state — says what is missing and how to fix it, rather
 * than leaving a blank region.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-box border border-dashed border-base-300 px-6 py-14 text-center ${className}`}
    >
      {icon && <div className="text-base-content/40">{icon}</div>}
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        {description && (
          <p className="mx-auto max-w-[48ch] text-sm text-base-content/60">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
