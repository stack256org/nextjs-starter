"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface OrbitSidebarProps {
  isImpersonating: boolean;
}

const navItems = [
  { label: "Dashboard", href: "/orbit", icon: "📊" },
  { label: "Users", href: "/orbit/users", icon: "👥" },
];

export function OrbitSidebar({ isImpersonating }: OrbitSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 bg-base-200 border-r overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-primary text-primary-content"
                : "hover:bg-base-300"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {isImpersonating && (
        <div className="p-4 border-t border-base-300">
          <div className="alert alert-warning py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.8 0a9 9 0 1112.72-6.01"
              />
            </svg>
            <span className="text-xs">
              Impersonating a user
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
