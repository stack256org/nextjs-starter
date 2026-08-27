import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { displayName } from "@/lib/auth/config";
import { formatDate } from "@/lib/format/session";
import { Avatar, Badge, EmptyState } from "@/components/ui";
import { UsersIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = { title: "Users · Orbit Admin" };

export const dynamic = "force-dynamic";

interface AdminUser {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role?: string | null;
  banned?: boolean | null;
  emailVerified?: boolean;
  createdAt: string | Date;
}

/**
 * Orbit admin — user list.
 *
 * Rows link through to the detail page, which is where role, ban state and
 * session controls live. Keeping actions off the list means no accidental
 * privilege change from a mis-click while scanning.
 */
export default async function OrbitUsersPage() {
  const session = await requireAdmin();

  const result = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
  });

  const userList = (result as unknown as { users?: AdminUser[] }).users ?? [];
  const adminCount = userList.filter((u) => u.role === "admin").length;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="mt-1 text-sm text-base-content/70">
          {userList.length} account{userList.length === 1 ? "" : "s"},{" "}
          {adminCount} with admin access. Select anyone to manage their role,
          sessions and access.
        </p>
      </header>

      {userList.length === 0 ? (
        <EmptyState
          icon={<UsersIcon size={40} aria-hidden="true" />}
          title="Nobody has signed up yet"
          description="Accounts appear here the first time someone completes a magic-link sign-in."
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {userList.map((u) => {
                const role = u.role ?? "user";
                const isCurrentUser = u.id === session.user.id;
                const name = displayName({ name: u.name, email: u.email });

                return (
                  <tr key={u.id} className="hover:bg-base-200/60">
                    <td>
                      <Link
                        href={`/orbit/users/${u.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar
                          src={u.image ?? null}
                          name={name}
                          size="md"
                          shape="squircle"
                        />
                        <span>
                          <span className="font-medium hover:underline">
                            {name}
                          </span>
                          <span className="mt-0.5 flex gap-1">
                            {isCurrentUser && <Badge tone="info">You</Badge>}
                            {u.banned && <Badge tone="error">Banned</Badge>}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="text-sm text-base-content/80">{u.email}</td>
                    <td>
                      <Badge tone={role === "admin" ? "primary" : "ghost"}>
                        {role}
                      </Badge>
                    </td>
                    <td className="text-xs text-base-content/60">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/orbit/users/${u.id}`}
                        className="inline-flex items-center gap-1 text-sm text-base-content/70 transition-colors hover:text-base-content"
                      >
                        Manage
                        <CaretRightIcon size={13} aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
