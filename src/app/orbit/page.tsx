import { getSession } from "@/lib/auth/helpers";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { Users, FileText, Shield } from "@phosphor-icons/react/dist/ssr";

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
            <Users size={32} />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{totalUsers}</div>
          <div className="stat-desc">Registered users</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-secondary">
            <FileText size={32} />
          </div>
          <div className="stat-title">Total Posts</div>
          <div className="stat-value text-secondary">{totalPosts}</div>
          <div className="stat-desc">Blog posts</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-accent">
            <Shield size={32} />
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
            <a href="/orbit/users" className="btn btn-primary">
              Manage Users
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
