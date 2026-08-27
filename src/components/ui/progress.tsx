export interface ProgressProps {
  /** 0–100. Omit for an indeterminate bar. */
  value?: number;
  label?: string;
  /** Renders the percentage beside the label. */
  showValue?: boolean;
  tone?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

const toneClasses = {
  primary: "progress-primary",
  success: "progress-success",
  warning: "progress-warning",
  error: "progress-error",
} as const;

/**
 * A progress bar.
 *
 * Uses the native `<progress>` element, so screen readers announce the value
 * without any ARIA. Omitting `value` gives the indeterminate state, which the
 * element also handles natively.
 */
export function Progress({
  value,
  label,
  showValue = false,
  tone = "primary",
  size = "md",
  className = "",
}: ProgressProps) {
  const clamped =
    typeof value === "number"
      ? Math.min(100, Math.max(0, Math.round(value)))
      : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-4 text-sm">
          {label && <span className="font-medium">{label}</span>}
          {showValue && clamped !== undefined && (
            <span className="font-mono text-xs text-base-content/60">
              {clamped}%
            </span>
          )}
        </div>
      )}
      <progress
        className={`progress ${toneClasses[tone]} ${size === "sm" ? "h-1" : "h-2"} w-full`}
        // A `value`-less <progress> is indeterminate; passing undefined is
        // meaningful here, so it must not be defaulted to 0.
        value={clamped}
        max={100}
        aria-label={label ?? "Progress"}
      />
    </div>
  );
}
