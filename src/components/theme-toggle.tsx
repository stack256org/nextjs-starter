"use client";

import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * A theme toggle that switches between light and dark modes.
 *
 * The active theme is only knowable in the browser (it comes from
 * localStorage or `prefers-color-scheme`), so the server has no way to pick
 * the right icon.  Rendering a guess produces a React hydration mismatch —
 * and `suppressHydrationWarning` does NOT help here: it only covers an
 * element's own attributes and text, not the `<path d="...">` inside the
 * icon's SVG child.
 *
 * So we render a fixed placeholder until hydration completes, then swap in the
 * real icon.  Server and client agree on the first paint, and the button keeps its
 * exact size so nothing shifts.
 */
export function ThemeToggle() {
  const hydrated = useHydrated();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (!hydrated) {
    return (
      <button
        type="button"
        className="btn btn-ghost btn-circle"
        aria-label="Toggle theme"
        // Disabled until the theme is known so a click can't set the wrong one.
        disabled
      >
        <span className="size-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn btn-ghost btn-circle"
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <SunIcon size={20} aria-hidden="true" />
      ) : (
        <MoonIcon size={20} aria-hidden="true" />
      )}
    </button>
  );
}
