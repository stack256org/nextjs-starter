"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth/server";

export interface ActionResult {
  ok: boolean;
  message: string;
}

/** Narrows BetterAuth / unknown errors down to a message safe to show a user. */
function toMessage(err: unknown, fallback: string): string {
  if (err instanceof APIError) return err.body?.message ?? fallback;
  if (err instanceof Error) return err.message;
  return fallback;
}

/**
 * Updates the signed-in user's profile (display name and avatar URL).
 * Called from the profile form on /dashboard/profile.
 */
export async function updateProfile(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();

  if (!name) {
    return { ok: false, message: "Display name can't be empty." };
  }
  if (name.length > 100) {
    return { ok: false, message: "Display name must be 100 characters or fewer." };
  }
  if (image && !/^https?:\/\//i.test(image)) {
    return { ok: false, message: "Avatar URL must start with http:// or https://" };
  }

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: { name, image: image || null },
    });
  } catch (err) {
    return { ok: false, message: toMessage(err, "Could not update your profile.") };
  }

  // The name and avatar appear in the navbar on every authenticated page.
  revalidatePath("/dashboard", "layout");
  revalidatePath("/orbit", "layout");
  return { ok: true, message: "Profile updated." };
}

/**
 * Signs the user out of every session except the current one — the standard
 * "I signed in somewhere I shouldn't have" escape hatch.
 *
 * Sessions are rows in the `sessions` table and BetterAuth validates the
 * cookie against that table on every request (there is no `cookieCache`
 * configured), so a revoked session stops working on its very next request
 * rather than whenever a cached copy happens to expire.
 */
export async function revokeOtherSessions(): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, message: "You are not signed in." };

  try {
    await auth.api.revokeOtherSessions({ headers: await headers() });
  } catch (err) {
    return { ok: false, message: toMessage(err, "Could not sign out other sessions.") };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true, message: "Signed out of every other session." };
}

/**
 * Signs the user out everywhere, including the device making the request.
 *
 * Use this when an account may be compromised: it deletes every session row,
 * so nothing survives — not even a stolen cookie, because the cookie is only
 * a pointer to a row that no longer exists.
 */
export async function revokeAllSessions(): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, message: "You are not signed in." };

  try {
    await auth.api.revokeSessions({ headers: await headers() });
  } catch (err) {
    return { ok: false, message: toMessage(err, "Could not sign out everywhere.") };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true, message: "Signed out on every device." };
}
