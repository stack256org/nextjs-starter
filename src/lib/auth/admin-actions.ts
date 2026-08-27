"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth/server";
import { requireAdmin } from "@/lib/auth/helpers";

export interface AdminActionResult {
  ok: boolean;
  message: string;
}

function toMessage(err: unknown, fallback: string): string {
  if (err instanceof APIError) return err.body?.message ?? fallback;
  if (err instanceof Error) return err.message;
  return fallback;
}

/**
 * Every action here re-checks `requireAdmin()`.
 *
 * A Server Action compiles to a public HTTP endpoint. The fact that the button
 * calling it only renders inside an admin page is a UI detail, not
 * authorisation — anyone can POST to the action id directly.
 */

/** Promotes or demotes a user. */
export async function setUserRole(
  userId: string,
  role: "user" | "admin",
): Promise<AdminActionResult> {
  const session = await requireAdmin();

  if (userId === session.user.id) {
    // Demoting yourself can strand the last admin outside Orbit, and the only
    // way back in is the make:admin CLI.
    return {
      ok: false,
      message: "You can't change your own role. Use `pnpm make:admin` instead.",
    };
  }

  try {
    await auth.api.setRole({
      headers: await headers(),
      body: { userId, role },
    });
  } catch (err) {
    return { ok: false, message: toMessage(err, "Could not change this user's role.") };
  }

  revalidatePath("/orbit/users");
  revalidatePath(`/orbit/users/${userId}`);
  return {
    ok: true,
    message:
      role === "admin"
        ? "User promoted to admin. They must sign out and back in for it to take effect."
        : "Admin access removed.",
  };
}

/** Bans a user, optionally with a reason and an expiry. */
export async function banUser(
  userId: string,
  reason: string,
): Promise<AdminActionResult> {
  const session = await requireAdmin();

  if (userId === session.user.id) {
    return { ok: false, message: "You can't ban yourself." };
  }

  try {
    await auth.api.banUser({
      headers: await headers(),
      body: { userId, banReason: reason || "No reason given" },
    });
  } catch (err) {
    return { ok: false, message: toMessage(err, "Could not ban this user.") };
  }

  revalidatePath("/orbit/users");
  revalidatePath(`/orbit/users/${userId}`);
  return { ok: true, message: "User banned and their sessions revoked." };
}

/** Lifts a ban. */
export async function unbanUser(userId: string): Promise<AdminActionResult> {
  await requireAdmin();

  try {
    await auth.api.unbanUser({
      headers: await headers(),
      body: { userId },
    });
  } catch (err) {
    return { ok: false, message: toMessage(err, "Could not unban this user.") };
  }

  revalidatePath("/orbit/users");
  revalidatePath(`/orbit/users/${userId}`);
  return { ok: true, message: "Ban lifted." };
}

/** Signs a user out of every device. */
export async function revokeUserSessions(
  userId: string,
): Promise<AdminActionResult> {
  await requireAdmin();

  try {
    await auth.api.revokeUserSessions({
      headers: await headers(),
      body: { userId },
    });
  } catch (err) {
    return { ok: false, message: toMessage(err, "Could not revoke sessions.") };
  }

  revalidatePath(`/orbit/users/${userId}`);
  return { ok: true, message: "All sessions for this user were revoked." };
}
