"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  COOKIE_MAX_AGE,
  COOKIE_NAME,
  themeAttribute,
  type Theme,
} from "./config";

/**
 * Theme state for the client.
 *
 * The *initial* theme comes from the server — the root layout reads the cookie
 * and renders `data-theme` into the HTML — so this provider only handles
 * changes. There is deliberately no inline FOUC script: React 19 warns
 * ("Encountered a script tag while rendering React component") about a
 * `<script>` anywhere in the React tree, including one rendered by a Server
 * Component, because the tag is still hydrated on the client.
 *
 * `system` is represented by the *absence* of `data-theme`, which lets the
 * `@media (prefers-color-scheme: dark)` rules in globals.css resolve it with
 * no JavaScript at all.
 */

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeToSystem(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const readSystem = () =>
  window.matchMedia(DARK_QUERY).matches ? "dark" : "light";

const serverSystem = () => "light";

/** Suppresses transitions for one frame so a theme switch doesn't animate. */
function withoutTransitions(change: () => void) {
  const style = document.createElement("style");
  style.append(
    document.createTextNode("*,*::before,*::after{transition:none !important}"),
  );
  document.head.appendChild(style);

  change();

  // Force a reflow so the suppression actually applies, then restore.
  void window.getComputedStyle(style).opacity;
  document.head.removeChild(style);
}

interface ThemeContextValue {
  /** The stored preference, which may be `"system"`. */
  theme: Theme;
  /** The theme actually in effect — `"system"` resolved against the OS. */
  resolvedTheme: string;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  /** Read from the cookie by the root layout. */
  initialTheme: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // `matchMedia` is an external store, so this is the right primitive: it
  // reads during render, subscribes for changes, and has a server snapshot.
  const system = useSyncExternalStore(
    subscribeToSystem,
    readSystem,
    serverSystem,
  );

  const resolvedTheme = theme === "system" ? system : theme;

  const setTheme = useCallback((next: Theme) => {
    // `SameSite=Lax` so the preference survives normal navigation; not
    // `Secure` here because local development is served over http.
    document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;

    withoutTransitions(() => {
      const attribute = themeAttribute(next);
      if (attribute) {
        document.documentElement.setAttribute("data-theme", attribute);
      } else {
        // Removing the attribute hands control back to prefers-color-scheme.
        document.documentElement.removeAttribute("data-theme");
      }
    });

    setThemeState(next);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
