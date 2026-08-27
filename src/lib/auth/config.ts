/**
 * Auth configuration values shared between server and client.
 * This file contains NO server-side imports (no BetterAuth, no Drizzle)
 * so it can be safely imported from Client Components.
 */

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";
