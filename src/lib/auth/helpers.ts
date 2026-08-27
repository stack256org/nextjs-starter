import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
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
 * Returns `true` if the current user has the "admin" role in the database.
 * Roles are checked solely via the `role` column on the `users` table.
 * Use the `make-admin` CLI command to promote a user to admin.
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const userRole = (session.user as { role?: string }).role;
  return userRole === "admin";
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
