"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { useState } from "react";

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

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled || isLoading}
      className={`btn ${
        currentRole === "admin"
          ? "btn-primary btn-sm"
          : "btn-ghost btn-sm"
      }`}
      title={
        currentRole === "admin"
          ? "Demote to user"
          : "Promote to admin"
      }
    >
      {isLoading ? (
        <span className="loading-spinner loading-xs"></span>
      ) : currentRole === "admin" ? (
        "👑 Admin"
      ) : (
        "Make Admin"
      )}
    </button>
  );
}
