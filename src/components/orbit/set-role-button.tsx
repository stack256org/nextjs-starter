"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SetRoleButtonProps {
  userId: string;
  currentRole: string;
  disabled?: boolean;
}

/**
 * Toggles a user's role between "user" and "admin".
 * Uses BetterAuth's `admin.setRole` endpoint.
 */
export function SetRoleButton({
  userId,
  currentRole,
  disabled,
}: SetRoleButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    if (isLoading) return;
    setIsLoading(true);

    const newRole = currentRole === "admin" ? "user" : "admin";
    const result = await authClient.admin.setRole({
      userId,
      role: newRole,
    });

    if (result.error) {
      console.error("Failed to set role:", result.error);
    } else {
      router.refresh();
    }

    setIsLoading(false);
  }

  const isAdmin = currentRole === "admin";

  return (
    <Button
      variant={isAdmin ? "primary" : "ghost"}
      size="sm"
      onClick={handleToggle}
      disabled={disabled || isLoading}
      title={isAdmin ? "Demote to user" : "Promote to admin"}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : isAdmin ? (
        "👑 Admin"
      ) : (
        "Make Admin"
      )}
    </Button>
  );
}
