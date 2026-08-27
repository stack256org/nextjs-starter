import { cookies } from "next/headers";
import { COOKIE_NAME, DEFAULT_THEME, isTheme, type Theme } from "./config";

/**
 * Reads the theme preference on the server so the root layout can render
 * `data-theme` into the initial HTML.
 *
 * This is what removes the inline FOUC script: the correct theme is present
 * in the very first byte of the response, so there is nothing to flash and
 * nothing for React to reconcile.
 */
export async function getThemePreference(): Promise<Theme> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  return isTheme(value) ? value : DEFAULT_THEME;
}
