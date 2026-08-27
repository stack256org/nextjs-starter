"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  setUserRole,
  banUser,
  unbanUser,
  revokeUserSessions,
  type AdminActionResult,
} from "@/lib/auth/admin-actions";
import { Alert, Button, Modal, RadioGroup, Textarea } from "@/components/ui";

interface UserAdminPanelProps {
  userId: string;
  email: string;
  currentRole: string;
  banned: boolean;
  banReason: string | null;
  sessionCount: number;
  isSelf: boolean;
}

/**
 * Admin controls for a single user: role, ban state, and session revocation.
 *
 * Every action calls a Server Action that re-checks `requireAdmin()` — the
 * disabled states here are guidance, not the security boundary.
 */
export function UserAdminPanel({
  userId,
  email,
  currentRole,
  banned,
  banReason,
  sessionCount,
  isSelf,
}: UserAdminPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<AdminActionResult | null>(null);
  const [role, setRole] = useState(currentRole);
  const [banOpen, setBanOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [reason, setReason] = useState("");

  function run(fn: () => Promise<AdminActionResult>) {
    startTransition(async () => {
      const res = await fn();
      setResult(res);
      setBanOpen(false);
      setRevokeOpen(false);
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {result && (
        <Alert tone={result.ok ? "success" : "error"} assertive={!result.ok}>
          {result.message}
        </Alert>
      )}

      {/* ── Role ── */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold">Role</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Admins can reach Orbit, manage every user, and inspect the job
            queues. Changes take effect the next time this person signs in.
          </p>
        </div>

        <RadioGroup
          variant="card"
          value={role}
          onChange={setRole}
          disabled={isSelf || isPending}
          options={[
            {
              value: "user",
              label: "User",
              description: "Standard access to the dashboard only.",
            },
            {
              value: "admin",
              label: "Admin",
              description:
                "Full access to Orbit, including user management and queues.",
            },
          ]}
        />

        {isSelf ? (
          <p className="text-xs text-base-content/60">
            You can&apos;t change your own role here — that could lock the last
            admin out of Orbit. Use{" "}
            <code className="rounded bg-base-300 px-1">pnpm make:admin</code>{" "}
            instead.
          </p>
        ) : (
          <div>
            <Button
              variant="primary"
              size="sm"
              loading={isPending}
              disabled={role === currentRole}
              onClick={() =>
                run(() => setUserRole(userId, role as "user" | "admin"))
              }
            >
              {role === currentRole ? "No change" : `Save role: ${role}`}
            </Button>
          </div>
        )}
      </section>

      {/* ── Sessions ── */}
      <section className="flex flex-col gap-4 border-t border-base-300 pt-8">
        <div>
          <h2 className="text-sm font-semibold">Sessions</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Sessions live in the database, so revoking them signs this person
            out of every device on their next request — not whenever a cookie
            happens to expire.
          </p>
        </div>
        <div>
          <Button
            variant="error"
            size="sm"
            disabled={sessionCount === 0 || isPending}
            onClick={() => setRevokeOpen(true)}
          >
            {sessionCount === 0
              ? "No active sessions"
              : `Sign out of ${sessionCount} session${sessionCount === 1 ? "" : "s"}`}
          </Button>
        </div>
      </section>

      {/* ── Access ── */}
      <section className="flex flex-col gap-4 border-t border-base-300 pt-8">
        <div>
          <h2 className="text-sm font-semibold">Access</h2>
          <p className="mt-1 text-sm text-base-content/60">
            {banned
              ? "This account is banned. Sign-in attempts are rejected."
              : "Banning revokes every session immediately and blocks future sign-ins."}
          </p>
        </div>

        {banned && banReason && (
          <p className="rounded-box border border-base-300 bg-base-200 px-4 py-3 text-sm">
            <span className="font-medium">Reason: </span>
            {banReason}
          </p>
        )}

        <div>
          {banned ? (
            <Button
              size="sm"
              loading={isPending}
              onClick={() => run(() => unbanUser(userId))}
            >
              Lift ban
            </Button>
          ) : (
            <Button
              variant="error"
              size="sm"
              disabled={isSelf || isPending}
              onClick={() => setBanOpen(true)}
            >
              Ban this account
            </Button>
          )}
          {isSelf && !banned && (
            <p className="mt-2 text-xs text-base-content/60">
              You can&apos;t ban your own account.
            </p>
          )}
        </div>
      </section>

      {/* ── Confirmations ── */}
      <Modal
        isOpen={banOpen}
        onClose={() => setBanOpen(false)}
        title={`Ban ${email}?`}
        description="Their sessions are revoked immediately and they won't be able to sign back in until the ban is lifted."
      >
        <div className="flex flex-col gap-4">
          <Textarea
            label="Reason"
            description="Stored on the account and shown to other admins."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Repeated abuse reports from three separate customers."
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => setBanOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="error"
              loading={isPending}
              onClick={() => run(() => banUser(userId, reason))}
            >
              Ban account
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={revokeOpen}
        onClose={() => setRevokeOpen(false)}
        title="Sign out every session?"
        description={`${email} will be signed out on all devices. They can sign back in straight away.`}
      >
        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={() => setRevokeOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="error"
            loading={isPending}
            onClick={() => run(() => revokeUserSessions(userId))}
          >
            Sign them out
          </Button>
        </div>
      </Modal>
    </div>
  );
}
