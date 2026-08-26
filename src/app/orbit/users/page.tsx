import { getSession } from "@/lib/auth/helpers";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { ImpersonateButton } from "@/components/orbit/impersonate-button";
import { SetRoleButton } from "@/components/orbit/set-role-button";
import { Avatar } from "@/components/ui/avatar";

/**
 * Orbit admin — Users list page.
 *
 * Lists all users via BetterAuth's admin API with an impersonation
 * button (for admins) and a role toggle.
 */
export default async function OrbitUsersPage() {
  const session = await getSession({ requireAuth: true });
  if (!session) return null;

  const userRole = (session.user as { role?: string }).role;
  const { isAdminEmail } = await import("@/lib/auth/config");

  if (userRole !== "admin" && !isAdminEmail(session.user.email)) {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
  }

  const isImpersonating = !!(
    session.session as { impersonatedBy?: string }
  ).impersonatedBy;

  // Fetch all users via BetterAuth's admin API
  const usersList = (await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit: 100,
    },
  })) as unknown as { users: Array<Record<string, unknown>> };

  const userList = usersList?.users ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      {isImpersonating && (
        <div className="alert alert-warning">
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
              d="M13 16h-1v-4h-1v-4h2v4h1v4zM12 11V7a5 5 0 00-5 5h10a5 5 0 00-5-5z"
            />
          </svg>
          <span>
            You are currently impersonating a user. Actions performed are
            on behalf of that user.
          </span>
        </div>
      )}

      <div className="overflow-x-auto rounded-box border border-base-200 bg-base-100">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((u: Record<string, unknown>) => {
              const uId = String(u.id ?? "");
              const uName = String(u.name ?? "");
              const uEmail = String(u.email ?? "");
              const uRole = String(u.role ?? "user");
              const isCurrentUser = uId === session.user.id;
              const impersonatedByUserId = (
                session.session as { impersonatedBy?: string }
              )?.impersonatedBy;
              const isCurrentImpersonated =
                uId === impersonatedByUserId;

              return (
                <tr key={uId}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar src={u.image as string | null} name={uName || uEmail} size="sm" />
                      <div>
                        <div className="font-medium">
                          {uName || uEmail}
                        </div>
                        <div className="flex gap-1">
                          {isCurrentUser && (
                            <span className="badge badge-xs badge-primary">
                              You
                            </span>
                          )}
                          {isCurrentImpersonated && (
                            <span className="badge badge-xs badge-warning">
                              Impersonated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{uEmail}</td>
                  <td>
                    <span
                      className={`badge ${
                        uRole === "admin"
                          ? "badge-primary"
                          : "badge-ghost"
                      }`}
                    >
                      {uRole}
                    </span>
                  </td>
                  <td className="text-right space-x-1">
                    <SetRoleButton
                      userId={uId}
                      currentRole={uRole}
                      disabled={isCurrentUser || isCurrentImpersonated}
                    />
                    <ImpersonateButton
                      userId={uId}
                      disabled={
                        uRole === "admin" || isCurrentUser
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
