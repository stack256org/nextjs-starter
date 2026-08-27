import { requireAdmin } from "@/lib/auth/helpers";
import { displayName } from "@/lib/auth/config";
import { OrbitSidebar, OrbitMobileNav } from "@/components/orbit/orbit-nav";
import { OrbitTopbar } from "@/components/orbit/orbit-topbar";

/**
 * Orbit Admin layout — server-side admin gate + navigation.
 *
 * Deliberately full-bleed: this is an admin console, and the user list, job
 * browser and metric bands all benefit from the whole viewport. The `Container`
 * used on the public and dashboard pages is intentionally NOT applied here —
 * the sidebar sits flush against the left edge and `main` takes the rest.
 *
 * `requireAdmin()` redirects anyone whose `role` column isn't "admin",
 * including an admin who is currently impersonating a regular user (the
 * borrowed session carries the impersonated user's role). That's deliberate:
 * an impersonation session must not hold admin powers. The way back is the
 * impersonation banner, which renders on the dashboard.
 *
 * NOTE: do NOT pin a `data-theme` here. DaisyUI resolves theme variables from
 * the nearest ancestor carrying `data-theme`, so a hard-coded value on this
 * wrapper overrides the one ThemeScript writes on <html> and the theme
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
      {/* min-h keeps the sidebar's right border running the full viewport
          height instead of stopping wherever the content happens to end. */}
      <div className="flex min-h-[calc(100dvh-4rem)]">
        <OrbitSidebar />
        <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
