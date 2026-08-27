"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

/**
 * Ends the current impersonation session and returns the admin to their own
 * session.  Calls BetterAuth's `stopImpersonating` endpoint, then does a full
 * refresh so every Server Component re-reads the restored session.
 */
export function StopImpersonatingButton({
  size = "sm",
}: {
  size?: "xs" | "sm" | "md";
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStop() {
    setIsPending(true);
    setError(null);

    const { error: err } = await authClient.admin.stopImpersonating();

    if (err) {
      setError(err.message ?? "Could not stop impersonating.");
      setIsPending(false);
      return;
    }

    // Back to Orbit — the admin's own session can reach it again.
    router.replace("/orbit/users");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-error">{error}</span>}
      <Button size={size} onClick={handleStop} disabled={isPending}>
        {isPending ? "Stopping…" : "Stop impersonating"}
      </Button>
    </div>
  );
}
