import { getSession } from "@/lib/auth/helpers";
import { Button } from "@/components/ui/button";
import { FileText, Rocket, File } from "@phosphor-icons/react/dist/ssr";

export default async function DashboardPage() {
  const session = await getSession({ requireAuth: true });
  if (!session) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            Welcome back, {session.user.name}! 👋
          </h2>
          <p className="opacity-70">
            This is your personal dashboard. From here you can manage
            your account, view your posts, and more.
          </p>

          <div className="card-actions justify-end">
            <Button variant="primary">Get Started</Button>
          </div>
        </div>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal w-full gap-4">
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-primary">
            <FileText size={32} />
          </div>
          <div className="stat-title">Posts</div>
          <div className="stat-value text-primary">0</div>
          <div className="stat-desc">Total posts</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-secondary">
            <Rocket size={32} />
          </div>
          <div className="stat-title">Published</div>
          <div className="stat-value text-secondary">0</div>
          <div className="stat-desc">Published posts</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-accent">
            <File size={32} />
          </div>
          <div className="stat-title">Drafts</div>
          <div className="stat-value text-accent">0</div>
          <div className="stat-desc">Unpublished posts</div>
        </div>
      </div>
    </div>
  );
}
