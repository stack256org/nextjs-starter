"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth/client";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";

interface DashboardNavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
}

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Posts", href: "/dashboard/posts" },
];

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isUserAdmin = user.role === "admin";

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <div className="navbar bg-base-100 shadow-sm border-b px-4 h-16">
      {/* ── Left: brand + nav ── */}
      <div className="flex-1 px-2 mx-2 text-lg font-semibold">
        <Link href="/dashboard">Next.js Starter</Link>
      </div>

      <div className="flex-none hidden sm:flex gap-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`btn btn-ghost btn-sm ${
              pathname === item.href ? "btn-active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}

        {/* Admin link shown only to admins */}
        {isUserAdmin && (
          <Link
            href="/orbit"
            className="btn btn-ghost btn-sm"
          >
            Orbit Admin
          </Link>
        )}
      </div>

      {/* ── Right: theme + user menu ── */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Dropdown
          placement="bottom-end"
          trigger={
            <Avatar src={user.image} name={user.name ?? user.email} size="md" />
          }
        >
          <DropdownItem href="/dashboard/profile">Profile</DropdownItem>
          <DropdownItem href="/dashboard/settings">Settings</DropdownItem>
          <DropdownSeparator />
          <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}
