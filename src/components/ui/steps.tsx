import { CheckIcon } from "@phosphor-icons/react/dist/ssr";

export interface Step {
  label: string;
  description?: string;
}

/**
 * Progress through a multi-step flow.
 *
 * Rendered as an ordered list so the sequence is conveyed structurally, with
 * `aria-current="step"` on the active one and a visually-hidden status for
 * each completed step — the tick alone is colour-and-shape only, which does
 * not reach a screen reader.
 */
export function Steps({
  steps,
  current,
  className = "",
}: {
  steps: Step[];
  /** Zero-based index of the active step. */
  current: number;
  className?: string;
}) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex flex-col gap-0 sm:flex-row sm:gap-2">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;

          return (
            <li key={step.label} className="flex flex-1 gap-3 sm:flex-col sm:gap-2">
              <div className="flex items-center gap-2 sm:contents">
                <span
                  className={`h-1 w-full rounded-full transition-colors ${
                    done || active ? "bg-primary" : "bg-base-300"
                  } hidden sm:block`}
                  aria-hidden="true"
                />
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium sm:hidden ${
                    done
                      ? "bg-primary text-primary-content"
                      : active
                        ? "bg-primary/15 text-primary"
                        : "bg-base-300 text-base-content/60"
                  }`}
                  aria-hidden="true"
                >
                  {done ? <CheckIcon size={12} weight="bold" /> : i + 1}
                </span>
              </div>

              <div className="pb-4 sm:pb-0" aria-current={active ? "step" : undefined}>
                <p
                  className={`text-sm font-medium ${
                    active ? "text-base-content" : "text-base-content/60"
                  }`}
                >
                  {step.label}
                  {done && <span className="sr-only"> (completed)</span>}
                  {active && <span className="sr-only"> (current step)</span>}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-base-content/60">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
