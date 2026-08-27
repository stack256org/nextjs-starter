"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth/client";
import { AFTER_SIGN_OUT_URL } from "@/lib/auth/config";
import { Avatar, ButtonLink, Container } from "@/components/ui";
import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownHeader,
} from "@/components/ui/dropdown";

interface DashboardNavbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
}

const navItems = [{ label: "Dashboard", href: "/dashboard" }];

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isUserAdmin = user.role === "admin";

  async function handleSignOut() {
    await authClient.signOut();
    router.push(AFTER_SIGN_OUT_URL);
    router.refresh();
  }

  return (
    // Full-bleed chrome, container-aligned contents — so the brand lines up
    // with the page heading underneath it.
    <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <Container className="flex h-16 items-center gap-4">
      <div className="flex flex-1 items-center gap-6">
        <Link href="/dashboard" className="font-semibold">
          Next.js Starter
        </Link>

        <nav aria-label="Main" className="hidden gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`btn btn-ghost btn-sm ${
                pathname === item.href ? "btn-active" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-1">
        {/* Admins only. Kept beside the theme toggle rather than in the
            account menu: it is a destination, not an account action. */}
        {isUserAdmin && (
          <ButtonLink href="/orbit" variant="ghost" size="sm">
            <ShieldCheckIcon size={17} aria-hidden="true" />
            Orbit
          </ButtonLink>
        )}

        <ThemeToggle />

        <Dropdown
          label="Account menu"
          trigger={
            <Avatar src={user.image} name={user.name} size="md" shape="squircle" />
          }
        >
          <DropdownHeader>{user.email}</DropdownHeader>
          <DropdownItem href="/dashboard/profile">Profile</DropdownItem>
          <DropdownItem href="/dashboard/settings">Settings</DropdownItem>
          <DropdownSeparator />
          <DropdownItem onClick={handleSignOut} destructive>
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
      </Container>
    </header>
  );
}
