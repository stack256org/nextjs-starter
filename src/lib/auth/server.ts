import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { admin } from "better-auth/plugins/admin";
import { sendMagicLinkEmail } from "@/lib/auth/send-magic-link-email";
import {
  APP_URL,
  MAGIC_LINK_EXPIRY_SECONDS,
  displayNameFromEmail,
} from "@/lib/auth/config";

const isDev = process.env.NODE_ENV === "development";

if (!process.env.APP_SECRET) {
  // Without a secret BetterAuth cannot sign session cookies. In dev it falls
  // back to a random value per process, which silently invalidates every
  // session on restart — fail loudly instead of debugging phantom logouts.
  throw new Error(
    "APP_SECRET is not set. Generate one with `openssl rand -base64 32` " +
      "and add it to .env.local.",
  );
}

/**
 * Google OAuth is optional. Declaring the provider with empty credentials
 * makes BetterAuth log "missing clientId or clientSecret" on every single
 * request and leaves a Sign-in button that can never work, so only register
 * it when both values are actually present.  `isGoogleEnabled` drives the
 * login page so the button is hidden rather than broken.
 */
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
export const isGoogleEnabled = Boolean(googleClientId && googleClientSecret);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  baseURL: APP_URL,
  secret: process.env.APP_SECRET,
  basePath: "/api/auth",

  // ── Plugins ─────────────────────────────────────────────────
  // nextCookies() must be last — BetterAuth requires it to be the final
  // plugin so it can forward all Set-Cookie headers to the Next.js response.
  plugins: [
    magicLink({
      expiresIn: MAGIC_LINK_EXPIRY_SECONDS,
      sendMagicLink: async (data) => {
        await sendMagicLinkEmail(data.email, data.url);
      },
    }),
    // Admin plugin: role management, user listing, impersonation
    admin(),
    nextCookies(),
  ],

  // ── Social Providers (Google OAuth) ────────────────────────
  socialProviders: isGoogleEnabled
    ? {
        google: {
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
          scope: ["openid", "email", "profile"],
        },
      }
    : {},

  // ── Database hooks ─────────────────────────────────────────
  databaseHooks: {
    user: {
      create: {
        // Magic-link signups carry no name, which leaves `name` as an empty
        // string and renders as "Welcome back, !".  Seed a sensible default
        // from the email local-part; the user can change it on /dashboard/profile.
        before: async (user) => {
          if (user.name?.trim()) return;
          return { data: { ...user, name: displayNameFromEmail(user.email) } };
        },
      },
    },
  },

  // ── Session configuration ─────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 7, // 7 days
    freshAge: 60 * 60 * 24, // 1 day
  },

  // ── Cookie security ───────────────────────────────────────
  // These live under `advanced` — a top-level `cookies` key is NOT a
  // BetterAuth option and is silently ignored.
  advanced: {
    useSecureCookies: !isDev,
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
    },
  },
});

// Types re-exported for convenience across the app.
// `auth.$Infer.Session` returns `{ session, user }` — the admin plugin
// automatically extends `user` with `role` and `session` with
// `impersonatedBy` when the admin plugin is loaded.
export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
