import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/server";

/**
 * Catch-all route handler that delegates every `/api/auth/*` request to
 * BetterAuth.
 *
 * `toNextJsHandler` is BetterAuth's own Next.js adapter — it exports the
 * correct GET/POST pair rather than re-exporting one function under every
 * HTTP verb, and it keeps cookie forwarding consistent with `nextCookies()`.
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
