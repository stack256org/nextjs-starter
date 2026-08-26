"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar } from "@/components/avatar";
import { isAdminEmail } from "@/lib/auth/config";

interface DashboardNavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Posts", href: "/dashboard/posts" },
];

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const pathname = usePathname();
  const isUserAdmin = isAdminEmail(user.email);

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
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
          >
            <Avatar src={user.image} name={user.name ?? user.email} />
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <span className="text-xs opacity-60">
                {user.email}
              </span>
            </li>
            <li>
              <SignOutButton />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
