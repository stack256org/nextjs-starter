/**
 * Auth configuration values shared between server and client.
 * This file contains NO server-side imports (no BetterAuth, no Drizzle)
 * so it can be safely imported from Client Components.
 */

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";

/**
 * Comma-separated list of emails that should automatically receive the
 * "admin" role on sign-up. e.g.  ADMIN_EMAILS=you@my.com
 *
 * Read from `NEXT_PUBLIC_` prefix so the client can also test this
 * without a server round-trip.
 */
const adminEmails: string[] = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || ""
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Returns `true` if the given email belongs to a configured admin.
 * Safe to call from both server and client code.
 */
export function isAdminEmail(email: string): boolean {
  return adminEmails.includes(email.toLowerCase());
}
