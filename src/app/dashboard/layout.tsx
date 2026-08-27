import { getViewer } from "@/lib/auth/helpers";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { ImpersonationBanner } from "@/components/impersonation-banner";

/**
 * Dashboard layout — server-side session check + top navigation bar.
 *
 * The impersonation banner renders here as well as in Orbit: an admin who
 * impersonates a regular user is bounced out of the admin-only routes, so the
 * "stop impersonating" control has to be reachable from the dashboard too.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isImpersonating } = await getViewer();

  return (
    <div className="min-h-[100dvh] bg-base-100">
      {isImpersonating && <ImpersonationBanner email={user.email} />}
      <DashboardNavbar user={user} />
      <main id="main" className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        {children}
      </main>
    </div>
  );
}
