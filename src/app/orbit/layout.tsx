import { requireAdmin } from "@/lib/auth/helpers";
import { displayName } from "@/lib/auth/config";
import { OrbitSidebar, OrbitMobileNav } from "@/components/orbit/orbit-nav";
import { OrbitTopbar } from "@/components/orbit/orbit-topbar";

/**
 * Orbit Admin layout — server-side admin gate + navigation.
 *
 * `requireAdmin()` redirects anyone whose `role` column isn't "admin",
 * including an admin who is currently impersonating a regular user (the
 * borrowed session carries the impersonated user's role). That's deliberate:
 * an impersonation session must not hold admin powers. The way back is the
 * impersonation banner, which renders on the dashboard.
 *
 * NOTE: do NOT pin a `data-theme` here. DaisyUI resolves theme variables from
 * the nearest ancestor carrying `data-theme`, so a hard-coded value on this
 * wrapper overrides the one `next-themes` writes on <html> and the theme
 * toggle silently stops working throughout Orbit.
 */
export default async function OrbitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  const user = {
    id: session.user.id,
    name: displayName(session.user),
    email: session.user.email,
    image: session.user.image ?? null,
  };

  return (
    <div className="min-h-[100dvh] bg-base-100">
      <OrbitTopbar user={user} />
      <OrbitMobileNav />
      <div className="flex">
        <OrbitSidebar />
        <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
