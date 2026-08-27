"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  revokeAllSessions,
  revokeOtherSessions,
  type ActionResult,
} from "@/lib/auth/actions";
import { describeUserAgent, formatDateTime } from "@/lib/format/session";
import { Alert, Badge, Button, Modal } from "@/components/ui";
import { MonitorIcon } from "@phosphor-icons/react/dist/ssr";

interface SessionRow {
  id: string;
  createdAt: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  isCurrent: boolean;
}

type Scope = "others" | "all";

export function SessionList({ sessions }: { sessions: SessionRow[] }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState<Scope | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const otherCount = sessions.filter((s) => !s.isCurrent).length;

  function run(scope: Scope) {
    startTransition(async () => {
      const res =
        scope === "all" ? await revokeAllSessions() : await revokeOtherSessions();
      setResult(res);
      setConfirming(null);
      if (res.ok) {
        // "All" revokes this session too, so the next navigation lands on /login.
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <ul className="divide-y divide-base-300 border-y border-base-300">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="flex flex-wrap items-start justify-between gap-3 py-4"
          >
            <div className="flex items-start gap-3">
              <MonitorIcon
                size={18}
                className="mt-0.5 shrink-0 text-base-content/50"
                aria-hidden="true"
              />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {describeUserAgent(session.userAgent)}
                  {session.isCurrent && <Badge tone="primary">This device</Badge>}
                </div>
                <div className="mt-0.5 font-mono text-xs text-base-content/60">
                  {session.ipAddress || "unknown IP"}
                </div>
                <div className="mt-1 text-xs text-base-content/60">
                  Signed in {formatDateTime(session.createdAt)}
                </div>
              </div>
            </div>
            <span className="text-xs text-base-content/60">
              Expires {formatDateTime(session.expiresAt)}
            </span>
          </li>
        ))}
      </ul>

      {result && (
        <Alert tone={result.ok ? "success" : "error"} assertive={!result.ok}>
          {result.message}
        </Alert>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setConfirming("others")}
          disabled={otherCount === 0 || isPending}
        >
          {otherCount === 0
            ? "No other sessions"
            : `Sign out ${otherCount} other session${otherCount === 1 ? "" : "s"}`}
        </Button>
        <Button
          size="sm"
          variant="error"
          onClick={() => setConfirming("all")}
          disabled={isPending}
        >
          Sign out everywhere
        </Button>
      </div>

      <Modal
        isOpen={confirming !== null}
        onClose={() => setConfirming(null)}
        title={
          confirming === "all"
            ? "Sign out on every device?"
            : "Sign out other sessions?"
        }
        description={
          confirming === "all"
            ? "Every session is deleted, including this one. You will be asked to sign in again."
            : "Every device except this one is signed out. You stay signed in here."
        }
      >
        <div className="flex justify-end gap-2">
          <Button size="sm" onClick={() => setConfirming(null)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="error"
            loading={isPending}
            onClick={() => confirming && run(confirming)}
          >
            {confirming === "all" ? "Sign out everywhere" : "Sign them out"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
