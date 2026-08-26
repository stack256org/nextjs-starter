import { auth } from "@/lib/auth/server";

/**
 * Catch-all route handler that delegates every `/api/auth/*`
 * request to BetterAuth's framework-agnostic `auth.handler()`.
 *
 * BetterAuth takes care of parsing the body, validating the
 * request, running the appropriate handler, and setting
 * cookies via `nextCookies()`.
 */
export async function GET(request: Request) {
  return auth.handler(request);
}

export { GET as POST, GET as PUT, GET as PATCH, GET as DELETE };
