import { getSession } from "@/lib/auth/helpers";
import { DashboardNavbar } from "@/components/dashboard-navbar";

/**
 * Dashboard layout — server-side session check + top navigation bar.
 *
 * The navigation lives in the top navbar (DaisyUI `navbar`).
 * Admin users see an extra "Orbit Admin" link in the top bar.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession({ requireAuth: true });
  if (!session) return null; // Unreachable — getSession redirects, but TS doesn't know

  return (
    <div className="min-h-screen bg-base-100">
      <DashboardNavbar
        user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
      />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
