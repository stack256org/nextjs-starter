"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps next-themes' ThemeProvider and suppresses the hydration warning
 * that React 19 raises about the inline FOUC-prevention script.
 *
 * The `attribute` array sets BOTH:
 *   - "class"      → enables Tailwind's `dark:` variant
 *   - "data-theme" → enables DaisyUI's per-theme CSS variables
 *
 * `defaultTheme="system"` follows the user's OS preference on first visit;
 * after they pick one, the choice is stored in localStorage and respected
 * on every subsequent visit.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      attribute={["class", "data-theme"]}
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={{ suppressHydrationWarning: true }}
    >
      {children}
    </NextThemesProvider>
  );
}
