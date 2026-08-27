import type { ReactNode } from "react";
import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react/dist/ssr";

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  /** Percentage change. Positive is not automatically good — see `goodWhen`. */
  change?: number;
  /**
   * Which direction counts as good. Error rates going up are bad; revenue
   * going up is good. Defaults to up-is-good.
   */
  goodWhen?: "up" | "down";
  className?: string;
}

/**
 * A single metric.
 *
 * Uses tabular figures so a row of stats stays aligned as values change, and
 * pairs the trend colour with an arrow — colour alone does not convey
 * direction to a colour-blind reader.
 */
export function Stat({
  label,
  value,
  hint,
  change,
  goodWhen = "up",
  className = "",
}: StatProps) {
  const rising = typeof change === "number" && change > 0;
  const good =
    typeof change === "number" &&
    change !== 0 &&
    (goodWhen === "up" ? rising : !rising);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-xs tracking-wide text-base-content/60 uppercase">
        {label}
      </span>
      <span className="font-mono text-2xl tabular">{value}</span>
      <span className="flex items-center gap-1.5 text-xs text-base-content/60">
        {typeof change === "number" && change !== 0 && (
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              good ? "text-success" : "text-error"
            }`}
          >
            {rising ? (
              <TrendUpIcon size={12} aria-hidden="true" />
            ) : (
              <TrendDownIcon size={12} aria-hidden="true" />
            )}
            {rising ? "+" : ""}
            {change}%
          </span>
        )}
        {hint}
      </span>
    </div>
  );
}
