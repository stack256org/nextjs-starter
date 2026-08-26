"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { StopImpersonatingButton } from "@/components/orbit/stop-impersonating-button";
import { Avatar } from "@/components/avatar";

interface OrbitTopbarProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  isImpersonating: boolean;
}

export function OrbitTopbar({ user, isImpersonating }: OrbitTopbarProps) {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b px-4 h-16">
      <div className="flex-1">
        <span className="text-xl font-semibold text-primary">
          ⚡ Orbit Admin
        </span>
      </div>

      {isImpersonating && (
        <div className="badge badge-warning">
          Impersonating {user.name}
        </div>
      )}

      <div className="flex items-center gap-2">
        {isImpersonating && <StopImpersonatingButton />}
        <ThemeToggle />
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <Avatar src={user.image} name={user.name ?? user.email} />
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <span className="text-xs opacity-60">{user.email}</span>
            </li>
            <li>
              <a href="/dashboard" className="text-sm">
                User Dashboard
              </a>
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
