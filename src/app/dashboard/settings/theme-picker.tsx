"use client";

import { useTheme } from "next-themes";
import { Select } from "@/components/ui/select";
import { useHydrated } from "@/lib/hooks/use-hydrated";

/**
 * Theme names registered with the DaisyUI plugin in `src/app/globals.css`.
 * Keep the two lists in sync — a name that isn't registered there produces
 * no CSS and silently falls back to the default theme.
 */
const THEME_OPTIONS = [
  { value: "system", label: "Match system" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "cupcake", label: "Cupcake" },
  { value: "emerald", label: "Emerald" },
  { value: "synthwave", label: "Synthwave" },
  { value: "valentine", label: "Valentine" },
  { value: "dim", label: "Dim" },
];

export function ThemePicker() {
  const hydrated = useHydrated();
  const { theme, setTheme, resolvedTheme } = useTheme();
  // The stored theme only exists in the browser, so render the control in a
  // neutral state until hydration rather than guessing and mismatching.

  return (
    <div className="max-w-xs">
      <Select
        label="Theme"
        value={hydrated ? (theme ?? "system") : undefined}
        placeholder="Loading…"
        onChange={setTheme}
        options={THEME_OPTIONS}
        disabled={!hydrated}
      />
      <p className="mt-2 text-xs opacity-60">
        {hydrated && theme === "system"
          ? `Following your system setting (currently ${resolvedTheme}).`
          : "Saved in this browser only."}
      </p>
    </div>
  );
}
