"use client";

import { useTheme } from "@/lib/theme/provider";
import { THEMES, type Theme } from "@/lib/theme/config";
import { Select } from "@/components/ui";

/**
 * Theme options.
 *
 * Sourced from `THEMES` so this list can never drift from the ones actually
 * registered with the DaisyUI plugin in `globals.css`.
 */
const LABELS: Record<Theme, string> = {
  system: "Match system",
  light: "Light",
  dark: "Dark",
  cupcake: "Cupcake",
  emerald: "Emerald",
  synthwave: "Synthwave",
  valentine: "Valentine",
  dim: "Dim",
};

const OPTIONS = THEMES.map((value) => ({ value, label: LABELS[value] }));

export function ThemePicker() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="max-w-xs">
      <Select
        label="Theme"
        value={theme}
        onChange={(value) => setTheme(value as Theme)}
        options={OPTIONS}
      />
      <p suppressHydrationWarning className="mt-2 text-xs text-base-content/60">
        {theme === "system"
          ? `Following your system setting (currently ${resolvedTheme}).`
          : "Saved to a cookie, so it applies before the page paints."}
      </p>
    </div>
  );
}
