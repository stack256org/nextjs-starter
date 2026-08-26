"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react/dist/ssr";

/**
 * A theme toggle that switches between light and dark modes.
 *
 * Reads the active theme from `next-themes`, which in turn reads from:
 *   1. localStorage (the user's saved choice), then
 *   2. system preference (prefers-color-scheme: dark)
 *
 * Uses Phosphor icons for a crisp, consistent look.
 *
 * `suppressHydrationWarning` is set on the button because
 * `resolvedTheme` is `undefined` on the first server render but
 * resolves on the client (localStorage / system preference).
 * The ThemeProvider in layout already suppresses the `<html>`
 * attribute mismatch; here we suppress the icon mismatch.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn btn-ghost btn-circle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      suppressHydrationWarning
    >
      {isDark ? (
        <Sun key="theme-sun" size={20} weight="regular" aria-hidden="true" />
      ) : (
        <Moon key="theme-moon" size={20} weight="regular" aria-hidden="true" />
      )}
    </button>
  );
}
