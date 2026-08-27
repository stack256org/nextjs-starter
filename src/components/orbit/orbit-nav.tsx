"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  UsersIcon,
  StackIcon,
} from "@phosphor-icons/react/dist/ssr";

export const ORBIT_NAV = [
  { label: "Overview", href: "/orbit", icon: ChartBarIcon },
  { label: "Users", href: "/orbit/users", icon: UsersIcon },
  { label: "Queues", href: "/orbit/queues", icon: StackIcon },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/orbit" ? pathname === href : pathname.startsWith(href);
}

/**
 * Sidebar navigation for Orbit Admin — desktop only.
 *
 * @see OrbitMobileNav for the small-screen equivalent.
 */
export function OrbitSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-base-300 md:block">
      <nav aria-label="Orbit admin" className="sticky top-16 p-3">
        <ul className="menu w-full gap-0.5">
          {ORBIT_NAV.map(({ label, href, icon: ItemIcon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className={isActive(pathname, href) ? "menu-active" : ""}
              >
                <ItemIcon size={17} aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

/**
 * Horizontal nav shown instead of the sidebar on small screens.
 *
 * Without it an admin on a phone can reach /orbit but has no way to get to
 * Users or Queues — the sidebar is the only link to them.
 */
export function OrbitMobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Orbit admin"
      className="sticky top-16 z-20 border-b border-base-300 bg-base-100/95 backdrop-blur md:hidden"
    >
      <ul className="flex overflow-x-auto">
        {ORBIT_NAV.map(({ label, href, icon: ItemIcon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors ${
                  active
                    ? "border-primary font-medium text-base-content"
                    : "border-transparent text-base-content/60 hover:text-base-content"
                }`}
              >
                <ItemIcon size={16} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
