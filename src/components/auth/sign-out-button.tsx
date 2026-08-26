"use client";

import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

/**
 * A button that signs the user out and redirects to /login.
 */
export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="btn btn-ghost btn-sm w-full justify-start"
    >
      Sign out
    </button>
  );
}
