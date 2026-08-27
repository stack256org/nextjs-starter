import type { ReactNode } from "react";

/**
 * A keyboard key.
 *
 * ```tsx
 * <Kbd>⌘</Kbd> <Kbd>K</Kbd>
 * ```
 */
export function Kbd({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={`kbd kbd-sm border-base-300 bg-base-200 font-mono ${className}`}
    >
      {children}
    </kbd>
  );
}

/**
 * A key combination, e.g. `["⌘", "K"]`.
 *
 * Joined with a thin separator so the parts read as one shortcut rather than
 * two independent keys.
 */
export function KbdCombo({
  keys,
  className = "",
}: {
  keys: string[];
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {keys.map((key, i) => (
        <span key={key} className="inline-flex items-center gap-1">
          {i > 0 && (
            <span className="text-xs text-base-content/40" aria-hidden="true">
              +
            </span>
          )}
          <Kbd>{key}</Kbd>
        </span>
      ))}
    </span>
  );
}
