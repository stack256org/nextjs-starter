import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth, type Session } from "@/lib/auth/server";
import { AFTER_SIGN_IN_URL, displayName } from "@/lib/auth/config";

/**
 * Returns the current session + user from the server side.
 * Pass `{ requireAuth: true }` to redirect to /login if there is no session.
 */
export async function getSession(opts?: { requireAuth?: boolean }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (opts?.requireAuth && !session) {
    redirect("/login");
  }

  return session;
}

/** The role stored on the user row — `"user"` or `"admin"`. */
export function roleOf(session: Session | null): string {
  return (session?.user as { role?: string } | undefined)?.role ?? "user";
}

/**
 * The id of the admin who started impersonating, or `null` when this is an
 * ordinary session.
 *
 * Note this is the ADMIN's id, not the impersonated user's — the impersonated
 * user is `session.user`. Getting that backwards badges the wrong row in the
 * users table.
 */
export function impersonatorIdOf(session: Session | null): string | null {
  return (
    (session?.session as { impersonatedBy?: string | null } | undefined)
      ?.impersonatedBy ?? null
  );
}

/** Everything a layout needs to render the header for the current session. */
export async function getViewer() {
  const session = await getSession({ requireAuth: true });
  if (!session) redirect("/login");

  return {
    session,
    user: {
      id: session.user.id,
      name: displayName(session.user),
      email: session.user.email,
      image: session.user.image ?? null,
      role: roleOf(session),
    },
    isAdmin: roleOf(session) === "admin",
    isImpersonating: impersonatorIdOf(session) !== null,
  };
}

/**
 * Returns `true` if the current user has the "admin" role in the database.
 * Roles are checked solely via the `role` column on the `users` table.
 * Use `pnpm make:admin <email>` to promote the first user.
 */
export async function isAdmin(): Promise<boolean> {
  return roleOf(await getSession()) === "admin";
}

/**
 * Server-side guard for admin-only routes. Redirects non-admins to the
 * dashboard. Call this at the top of an admin `layout.tsx` or `page.tsx`.
 */
export async function requireAdmin() {
  const session = await getSession({ requireAuth: true });

  if (roleOf(session) !== "admin") {
    redirect(AFTER_SIGN_IN_URL);
  }

  return session!;
}
