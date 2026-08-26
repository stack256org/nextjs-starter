"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react/dist/ssr";
import { useId, useState } from "react";

/**
 * A theme toggle that switches between light and dark modes.
 *
 * Reads the active theme from `next-themes`, which in turn reads from:
 *   1. localStorage (the user's saved choice), then
 *   2. system preference (prefers-color-scheme: dark)
 *
 * Uses Phosphor icons for a crisp, consistent look.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const id = useId();

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTheme(isDark ? "light" : "dark");
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        /* Sun icon — currently dark, click for light */
        <Sun
          key={`sun-${id}`}
          size={20}
          weight="regular"
          aria-hidden="true"
        />
      ) : (
        /* Moon icon — currently light, click for dark */
        <Moon
          key={`moon-${id}`}
          size={20}
          weight="regular"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
