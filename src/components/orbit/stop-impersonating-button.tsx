"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

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
    <Button variant="warning" size="sm" onClick={handleStop}>
      Stop impersonating
    </Button>
  );
}
