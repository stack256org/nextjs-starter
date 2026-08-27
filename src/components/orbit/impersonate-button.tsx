"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { UserSwitchIcon } from "@phosphor-icons/react/dist/ssr";

interface ImpersonateButtonProps {
  userId: string;
  disabled?: boolean;
}

/**
 * Calls BetterAuth's `admin.impersonateUser` endpoint.  On success the session
 * cookie is swapped to the impersonated user, whose role is no longer "admin"
 * — so Orbit will bounce us to the dashboard, where the impersonation banner
 * provides the way back.
 */
export function ImpersonateButton({ userId, disabled }: ImpersonateButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImpersonate() {
    setIsPending(true);
    setError(null);

    const { error: err } = await authClient.admin.impersonateUser({ userId });

    if (err) {
      setError(err.message ?? "Impersonation failed.");
      setIsPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <Button
        size="sm"
        onClick={handleImpersonate}
        disabled={disabled || isPending}
        title="View the app as this user"
      >
        <UserSwitchIcon size={16} aria-hidden="true" />
        {isPending ? "Switching…" : "Impersonate"}
      </Button>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
