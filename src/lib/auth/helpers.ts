import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { isAdminEmail } from "@/lib/auth/config";
import { headers } from "next/headers";

/**
 * Returns the current session + user from the server side.
 * Pass `{ requireAuth: true }` to redirect to /login if there is no session.
 */
export async function getSession(
  opts?: { requireAuth?: boolean },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (opts?.requireAuth && !session) {
    redirect("/login");
  }

  return session;
}

/**
 * Returns `true` if the current user has admin access — either their
 * email is in `ADMIN_EMAILS` or their database role is `"admin"`.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const userRole = (session.user as { role?: string }).role;
  if (userRole === "admin") return true;
  if (isAdminEmail(session.user.email)) return true;

  return false;
}

/**
 * Server-side guard: redirects to /dashboard if the current
 * user is NOT an admin. Call this in `layout.tsx` or `page.tsx`.
 */
export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/dashboard");
  }
  return await getSession();
}
