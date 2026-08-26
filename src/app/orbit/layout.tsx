import { getSession } from "@/lib/auth/helpers";
import { OrbitSidebar } from "@/components/orbit/orbit-sidebar";
import { OrbitTopbar } from "@/components/orbit/orbit-topbar";

/**
 * Orbit Admin layout — server-side admin check + sidebar navigation.
 *
 * The sidebar (DaisyUI `Menu` in a `Drawer`) holds the admin nav.
 * The topbar shows the current user or the "you are impersonating"
 * banner when an admin is impersonating someone.
 *
 * The `dim` DaisyUI theme is applied for a dark, admin-style look.
 */
export default async function OrbitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession({ requireAuth: true });
  if (!session) return null;

  // Server-side admin gate
  const userRole = (session.user as { role?: string }).role;
  const { isAdminEmail } = await import("@/lib/auth/config");

  if (userRole !== "admin" && !isAdminEmail(session.user.email)) {
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
  }

  const isImpersonating = !!(
    session.session as { impersonatedBy?: string }
  ).impersonatedBy;

  return (
    <div
      className="min-h-screen bg-base-300"
      data-theme="dim"
    >
      <OrbitTopbar
        user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
        isImpersonating={isImpersonating}
      />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <OrbitSidebar isImpersonating={isImpersonating} />
        <main className="flex-1 overflow-y-auto p-6 bg-base-100">
          {children}
        </main>
      </div>
    </div>
  );
}
