import { getViewer } from "@/lib/auth/helpers";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { Container } from "@/components/ui";

/**
 * Dashboard layout — server-side session check + top navigation bar.
 *
 * The navbar and this `main` share the same `Container`, so the brand in the
 * bar sits on the same left edge as the page heading below it.
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
      <Container as="main" id="main" className="py-10">
        {children}
      </Container>
    </div>
  );
}
