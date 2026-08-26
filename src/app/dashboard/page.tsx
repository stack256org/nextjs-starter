import { getSession } from "@/lib/auth/helpers";

export default async function DashboardPage() {
  const session = await getSession({ requireAuth: true });
  if (!session) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Welcome back, {session.user.name}! 👋</h2>
          <p className="opacity-70">
            This is your personal dashboard. From here you can manage
            your account, view your posts, and more.
          </p>

          <div className="card-actions justify-end">
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal w-full gap-4">
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
                d="M12 4.5v15M4.5 12h15"
              />
            </svg>
          </div>
          <div className="stat-title">Posts</div>
          <div className="stat-value text-primary">0</div>
          <div className="stat-desc">Total posts</div>
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
                d="M8.257 3.875a3.368 3.368 0 015.486 0L18 8.25a3.368 3.368 0 010 4.82l-2.25 2.25a3.368 3.368 0 01-4.82 0L6.25 13.75a3.368 3.368 0 010-4.82L8.257 3.875z"
              />
            </svg>
          </div>
          <div className="stat-title">Published</div>
          <div className="stat-value text-secondary">0</div>
          <div className="stat-desc">Published posts</div>
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
                d="M13 16h-1v-4h-1v-4h2v4h1v4zM12 11V7a5 5 0 00-5 5h10a5 5 0 00-5-5z"
              />
            </svg>
          </div>
          <div className="stat-title">Drafts</div>
          <div className="stat-value text-accent">0</div>
          <div className="stat-desc">Unpublished posts</div>
        </div>
      </div>
    </div>
  );
}
