/**
 * Auth configuration values shared between server and client.
 * This file contains NO server-side imports (no BetterAuth, no Drizzle)
 * so it can be safely imported from Client Components.
 */

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";

/** Where a user lands after a successful sign-in. */
export const AFTER_SIGN_IN_URL = "/dashboard";

/**
 * How long a magic link stays valid, in seconds.
 *
 * Passed explicitly to the magic-link plugin AND used in the email copy, so
 * the stated expiry can never drift from the real one. (It previously said
 * "30 minutes" while BetterAuth's default was 5.)
 */
export const MAGIC_LINK_EXPIRY_SECONDS = 60 * 10;

/** Where a user lands after signing out. */
export const AFTER_SIGN_OUT_URL = "/login";

/**
 * Derives a human-ish display name from an email address, e.g.
 * `ada.lovelace@example.com` → `Ada Lovelace`.
 *
 * Magic-link and OAuth signups don't always supply a name; without this the
 * UI renders "Welcome back, !".  Used as a database-hook default on user
 * creation and as a render-time fallback for rows created before that hook.
 */
export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(" ") || email;
}

/**
 * The name to show for a user, falling back to their email local-part when
 * the stored `name` is blank.
 */
export function displayName(user: {
  name?: string | null;
  email: string;
}): string {
  return user.name?.trim() || displayNameFromEmail(user.email);
}
