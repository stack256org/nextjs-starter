"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { User } from "@phosphor-icons/react/dist/ssr";

interface ImpersonateButtonProps {
  userId: string;
  disabled?: boolean;
}

/**
 * Calls BetterAuth's `admin.impersonateUser` endpoint.
 * After a successful call the session cookie is swapped to the
 * impersonated user and the page auto-refreshes.
 */
export function ImpersonateButton({ userId, disabled }: ImpersonateButtonProps) {
  const router = useRouter();

  async function handleImpersonate() {
    const result = await authClient.admin.impersonateUser({
      userId,
    });

    if (result.error) {
      console.error("Impersonation failed:", result.error);
      return;
    }

    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleImpersonate}
      disabled={disabled}
      title="Impersonate this user"
    >
      <User size={16} />
      Impersonate
    </Button>
  );
}
