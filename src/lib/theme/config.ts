/**
 * Theme configuration shared by the server layout and the client provider.
 *
 * Keep `THEMES` in sync with the `@plugin "daisyui"` and
 * `@plugin "daisyui/theme"` blocks in `src/app/globals.css`. A name listed
 * here but not registered there produces no CSS and silently falls back.
 */

/**
 * The preference is stored in a cookie, not localStorage, so the server can
 * read it and put `data-theme` straight into the initial HTML. That removes
 * the usual inline "FOUC-prevention" script entirely — see ./provider.tsx.
 *
 * Not `httpOnly`: the client provider writes it when the user changes theme.
 * It holds a display preference, nothing sensitive.
 */
export const COOKIE_NAME = "theme";

/** One year, in seconds. */
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Selectable themes. `system` means "no explicit choice — follow the OS". */
export const THEMES = [
  "system",
  "light",
  "dark",
  "cupcake",
  "emerald",
  "synthwave",
  "valentine",
  "dim",
] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "system";

export function isTheme(value: string | undefined): value is Theme {
  return !!value && (THEMES as readonly string[]).includes(value);
}

/**
 * The value for the `data-theme` attribute, or `undefined` for `system`.
 *
 * Omitting the attribute is what makes `system` work with no JavaScript at
 * all: the dark theme is defined under
 * `@media (prefers-color-scheme: dark) { :root:not([data-theme]) }`, so the
 * browser resolves it from the OS setting. Setting `data-theme="light"` here
 * would pin it and break that.
 */
export function themeAttribute(theme: Theme): string | undefined {
  return theme === "system" ? undefined : theme;
}
