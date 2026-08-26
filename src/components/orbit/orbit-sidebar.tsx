"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WarningIcon } from "@phosphor-icons/react/dist/ssr";

interface OrbitSidebarProps {
  isImpersonating: boolean;
}

const navItems = [
  { label: "Dashboard", href: "/orbit", icon: "📊" },
  { label: "Users", href: "/orbit/users", icon: "👥" },
];

/**
 * Sidebar navigation for Orbit Admin.
 *
 * Uses DaisyUI `menu` component (vertical, responsive) for the nav list,
 * and `alert` component for the impersonation warning.
 *
 * @see https://daisyui.com/components/menu/
 * @see https://daisyui.com/components/alert/
 */
export function OrbitSidebar({ isImpersonating }: OrbitSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 bg-base-200 border-r overflow-y-auto">
      <nav className="p-4">
        <ul className="menu menu-vertical gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 ${
                  pathname === item.href ? "active" : ""
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isImpersonating && (
        <div className="p-4 border-t border-base-300">
          <div className="alert alert-warning py-2">
            <WarningIcon size={20} />
            <span className="text-xs">
              Impersonating a user
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
