import { UserSwitchIcon } from "@phosphor-icons/react/dist/ssr";
import { StopImpersonatingButton } from "@/components/orbit/stop-impersonating-button";

/**
 * A page-level banner shown whenever the current session is an impersonation.
 *
 * This has to render on the DASHBOARD as well as in Orbit: the moment an
 * admin impersonates a regular user, the admin-only Orbit routes reject the
 * borrowed session and bounce them to /dashboard.  If the only way out lived
 * in the Orbit topbar, the admin would be stuck as that user with no way back.
 */
export function ImpersonationBanner({ email }: { email: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-warning px-4 py-2 text-sm text-warning-content">
      <span className="flex items-center gap-2">
        <UserSwitchIcon size={18} weight="bold" aria-hidden="true" />
        You are viewing the app as <strong>{email}</strong>. Anything you do is
        recorded as them.
      </span>
      <StopImpersonatingButton size="xs" />
    </div>
  );
}
