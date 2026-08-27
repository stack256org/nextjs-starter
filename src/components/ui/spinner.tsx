export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  /** Announced to screen readers. Pass null for decorative spinners. */
  label?: string | null;
  className?: string;
}

const sizeClasses = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
} as const;

/**
 * An indeterminate loading indicator.
 *
 * Prefer `Skeleton` for content that is about to appear — a shape matching the
 * incoming layout prevents the reflow a spinner cannot. Use this for actions
 * (a button mid-submit) where there is no layout to preview.
 */
export function Spinner({
  size = "md",
  label = "Loading",
  className = "",
}: SpinnerProps) {
  return (
    <span
      className={`loading loading-spinner ${sizeClasses[size]} ${className}`}
      role={label ? "status" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
    />
  );
}
