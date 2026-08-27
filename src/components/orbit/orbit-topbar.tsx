"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth/client";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { StopImpersonatingButton } from "@/components/orbit/stop-impersonating-button";

interface OrbitTopbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
  isImpersonating: boolean;
}

export function OrbitTopbar({ user, isImpersonating }: OrbitTopbarProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <div className="navbar bg-base-100 shadow-sm border-b px-4 h-16">
      {/* ── Left: brand ── */}
      <div className="flex-1">
        <span className="text-xl font-semibold text-primary">
          ⚡ Orbit Admin
        </span>
      </div>

      {/* ── Center: impersonation indicator ── */}
      {isImpersonating && (
        <div className="badge badge-warning">
          Impersonating {user.name}
        </div>
      )}

      {/* ── Right: actions ── */}
      <div className="flex items-center gap-2">
        {isImpersonating && <StopImpersonatingButton />}
        <ThemeToggle />

        <Dropdown
          placement="bottom-end"
          trigger={
            <Avatar src={user.image} name={user.name ?? user.email} size="md" />
          }
        >
          <DropdownItem href="/orbit/settings">Settings</DropdownItem>
          <DropdownSeparator />
          <DropdownItem href="/dashboard">
            User Dashboard
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}
