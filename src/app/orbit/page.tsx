import { getSession } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { count } from "drizzle-orm";

/**
 * Orbit admin dashboard — key metrics at a glance.
 */
export default async function OrbitPage() {
  const session = await getSession({ requireAuth: true });
  if (!session) return null;

  const isImpersonating = !!(
    session.session as { impersonatedBy?: string }
  ).impersonatedBy;

  const [userCount, postCount] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(posts),
  ]);

  const totalUsers = userCount[0]?.count ?? 0;
  const totalPosts = postCount[0]?.count ?? 0;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orbit Admin Dashboard</h1>
        {isImpersonating && (
          <span className="text-sm opacity-60">
            Currently impersonating a user
          </span>
        )}
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full gap-4">
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 11-4 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{totalUsers}</div>
          <div className="stat-desc">Registered users</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.235 13.75A9 9 0 1110.25 5a9 9 0 019 8.75z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12h1m1 0l-3-3m3 3l-3 3"
              />
            </svg>
          </div>
          <div className="stat-title">Total Posts</div>
          <div className="stat-value text-secondary">{totalPosts}</div>
          <div className="stat-desc">Blog posts</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2l4 -4m5.6 -4.4v10.801m-10.2 0.2"
              />
            </svg>
          </div>
          <div className="stat-title">Admin Emails</div>
          <div className="stat-value break-all text-xs">
            {adminEmail || "(none set)"}
          </div>
          <div className="stat-desc">
            Set ADMIN_EMAILS env var to promote users
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-xl mt-6">
        <div className="card-body">
          <h2 className="card-title">Admin Quick Actions</h2>
          <div className="card-actions">
            <a href="/orbit/users" className="btn btn-outline">
              Manage Users
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
