"use client";

import { useTheme } from "@/lib/theme/provider";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";

/**
 * Switches between light and dark.
 *
 * When the preference is an explicit theme the server already knows it (from
 * the cookie), so the correct icon renders on the first pass. When it is
 * "system" the OS preference is unknowable server-side, so the icon can
 * change on hydration — `suppressHydrationWarning` on the wrapper is not
 * enough for that, since it does not cover the `<path d>` inside the SVG, so
 * the icon is rendered inside a `<span>` that carries the flag for its whole
 * subtree.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
    >
      <span suppressHydrationWarning className="flex">
        {isDark ? (
          <SunIcon size={19} aria-hidden="true" />
        ) : (
          <MoonIcon size={19} aria-hidden="true" />
        )}
      </span>
    </Button>
  );
}
