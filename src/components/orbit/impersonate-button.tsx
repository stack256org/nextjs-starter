"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      Impersonate
    </Button>
  );
}
