import { createAuthClient } from "better-auth/react";
import { adminClient, magicLinkClient } from "better-auth/client/plugins";
import { APP_URL } from "@/lib/auth/config";

/**
 * Typed BetterAuth client — use this everywhere in the app.
 *
 * The hooks (`useSession`, etc.) and methods (`signIn`, `signOut`,
 * `magicLink`, `admin`) are all available on this instance.
 */
export const authClient = createAuthClient({
  baseURL: APP_URL,
  plugins: [adminClient(), magicLinkClient()],
});

export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
