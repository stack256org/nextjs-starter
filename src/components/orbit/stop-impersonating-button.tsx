"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

/**
 * Ends the current impersonation session and returns the admin
 * to their own session.  Calls BetterAuth's `stopImpersonating`
 * endpoint and refetches the session.
 */
export function StopImpersonatingButton() {
  const router = useRouter();

  async function handleStop() {
    await authClient.admin.stopImpersonating();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleStop}
      className="btn btn-warning btn-sm"
    >
      Stop impersonating
    </button>
  );
}
