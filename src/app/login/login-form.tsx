"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { AFTER_SIGN_IN_URL, MAGIC_LINK_EXPIRY_SECONDS } from "@/lib/auth/config";
import { Alert, Button, Input } from "@/components/ui";
import {
  EnvelopeSimpleIcon,
  GoogleLogoIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react/dist/ssr";

const EXPIRY_MINUTES = Math.round(MAGIC_LINK_EXPIRY_SECONDS / 60);

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email || isSending) return;

    setError(null);
    setIsSending(true);

    try {
      const { error: err } = await authClient.signIn.magicLink({
        email,
        // Without this BetterAuth falls back to "/", dropping the user on the
        // landing page — indistinguishable from a failed sign-in.
        callbackURL: AFTER_SIGN_IN_URL,
        newUserCallbackURL: AFTER_SIGN_IN_URL,
      });

      if (err) {
        setError(err.message ?? "We could not send the link. Try again.");
      } else {
        setSentTo(email);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We could not reach the server. Check your connection and try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setIsRedirecting(true);

    const { error: err } = await authClient.signIn.social({
      provider: "google",
      callbackURL: AFTER_SIGN_IN_URL,
      errorCallbackURL: "/login",
    });

    if (err) {
      setError(err.message ?? "Google sign-in failed.");
      setIsRedirecting(false);
    }
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <PaperPlaneTiltIcon size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium">Check your inbox</p>
          <p className="mt-1.5 text-sm text-base-content/70">
            We sent a sign-in link to <strong>{sentTo}</strong>. It works once
            and expires in {EXPIRY_MINUTES} minutes.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setSentTo(null);
            setError(null);
          }}
        >
          Use a different address
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <Alert tone="error" assertive>
          {error}
        </Alert>
      )}

      <form onSubmit={handleMagicLink} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startIcon={<EnvelopeSimpleIcon size={17} />}
        />

        <Button
          type="submit"
          variant="primary"
          block
          loading={isSending}
          disabled={isRedirecting}
        >
          {isSending ? "Sending" : "Email me a sign-in link"}
        </Button>
      </form>

      {/* Rendered only when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are both
          set — a Google button with no credentials behind it can never work. */}
      {googleEnabled && (
        <>
          <div className="divider my-0 text-xs text-base-content/50">or</div>
          <Button
            type="button"
            block
            onClick={handleGoogle}
            loading={isRedirecting}
            disabled={isSending}
          >
            <GoogleLogoIcon size={18} aria-hidden="true" />
            Continue with Google
          </Button>
        </>
      )}
    </div>
  );
}
