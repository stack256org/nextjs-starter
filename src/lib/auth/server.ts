import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { admin } from "better-auth/plugins/admin";
import { sendMagicLinkEmail } from "@/lib/auth/send-magic-link-email";
import { APP_URL } from "@/lib/auth/config";

const isDev = process.env.NODE_ENV === "development";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  baseURL: isDev ? APP_URL : process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  basePath: "/api/auth",

  // ── Plugins ─────────────────────────────────────────────────
  // nextCookies() must be last — BetterAuth requires it to be
  // the final plugin so it can forward all Set-Cookie headers
  // to the Next.js response.
  plugins: [
    magicLink({
      sendMagicLink: async (data) => {
        await sendMagicLinkEmail(data.email, data.url);
      },
    }),
    // Admin plugin: role management, user listing, impersonation
    admin(),
    nextCookies(),
  ],

  // ── Social Providers (Google OAuth) ────────────────────────
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ["openid", "email", "profile"],
    },
  },

  // ── Session configuration ─────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24 * 7, // 7 days
    freshAge: 60 * 60 * 24, // 1 day
  },

  // ── Cookie security ───────────────────────────────────────
  cookies: {
    options: {
      httpOnly: true,
      secure: !isDev,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    },
  },
});

// Types re-exported for convenience across the app.
// `auth.$Infer.Session` returns `{ session, user }` — the admin plugin
// automatically extends `user` with `role` and `session` with
// `impersonatedBy` when the admin plugin is loaded.
export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
