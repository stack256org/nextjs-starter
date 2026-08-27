"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth/client";
import { AFTER_SIGN_OUT_URL } from "@/lib/auth/config";
import { Avatar, Badge } from "@/components/ui";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownHeader,
} from "@/components/ui/dropdown";

interface OrbitTopbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function OrbitTopbar({ user }: OrbitTopbarProps) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push(AFTER_SIGN_OUT_URL);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-base-300 bg-base-100/95 px-4 backdrop-blur">
      <div className="flex flex-1 items-center gap-2.5">
        <Link href="/orbit" className="font-semibold">
          Orbit
        </Link>
        <Badge tone="primary" outline>
          admin
        </Badge>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />

        <Dropdown
          label="Account menu"
          trigger={<Avatar src={user.image} name={user.name} size="md" shape="squircle" />}
        >
          <DropdownHeader>{user.email}</DropdownHeader>
          <DropdownItem href="/dashboard">Dashboard</DropdownItem>
          <DropdownItem href="/dashboard/profile">Profile</DropdownItem>
          <DropdownItem href="/dashboard/settings">Settings</DropdownItem>
          <DropdownSeparator />
          <DropdownItem onClick={handleSignOut} destructive>
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
