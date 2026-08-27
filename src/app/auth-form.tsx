"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import {
  AFTER_SIGN_IN_URL,
  AFTER_SIGN_UP_URL,
  MAGIC_LINK_EXPIRY_SECONDS,
} from "@/lib/auth/config";
import { Alert, Button, Divider, Input } from "@/components/ui";
import {
  EnvelopeSimpleIcon,
  GoogleLogoIcon,
  PaperPlaneTiltIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";

const EXPIRY_MINUTES = Math.round(MAGIC_LINK_EXPIRY_SECONDS / 60);

export type AuthMode = "sign-in" | "register";

export interface AuthFormProps {
  mode: AuthMode;
  googleEnabled: boolean;
}

/**
 * The shared sign-in / registration form.
 *
 * Both modes send the same magic link — the difference is what is collected
 * and how it is framed. Registration additionally asks for a display name,
 * which BetterAuth applies only when the account is created; on an existing
 * account it is ignored, so registering twice cannot overwrite a name the
 * person has since changed on their profile.
 *
 * Deliberately, neither mode tells you whether an account already exists.
 * "That email isn't registered" is account enumeration: it lets anyone test
 * addresses against your user list. Every magic-link product behaves this way,
 * and the copy is written to stay truthful under it — sign-in never claims the
 * account must already exist.
 */
export function AuthForm({ mode, googleEnabled }: AuthFormProps) {
  const isRegister = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || isSending) return;

    setError(null);
    setIsSending(true);

    try {
      const { error: err } = await authClient.signIn.magicLink({
        email,
        // Applied only when the account is created.
        ...(isRegister && name.trim() ? { name: name.trim() } : {}),
        // Without an explicit callback BetterAuth falls back to "/", dropping
        // the user on the landing page — indistinguishable from a failure.
        callbackURL: AFTER_SIGN_IN_URL,
        // Only used when the account is created, so a first-time visitor is
        // greeted rather than welcomed "back".
        newUserCallbackURL: AFTER_SIGN_UP_URL,
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
      errorCallbackURL: mode === "register" ? "/register" : "/login",
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
            We sent a link to <strong>{sentTo}</strong>.{" "}
            {isRegister
              ? "Open it to finish setting up your account."
              : "Open it and you'll be signed in."}{" "}
            It works once and expires in {EXPIRY_MINUTES} minutes.
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {isRegister && (
          <Input
            label="Your name"
            name="name"
            autoComplete="name"
            placeholder="Amara Okonkwo"
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            startIcon={<UserIcon size={17} />}
            description="Shown to teammates and on your profile. You can change it later."
          />
        )}

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
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
          {isSending
            ? "Sending"
            : isRegister
              ? "Create account"
              : "Email me a sign-in link"}
        </Button>
      </form>

      {/* Rendered only when GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are both
          set — a Google button with no credentials behind it can never work. */}
      {googleEnabled && (
        <>
          <Divider>or</Divider>
          <Button
            type="button"
            block
            onClick={handleGoogle}
            loading={isRedirecting}
            disabled={isSending}
          >
            <GoogleLogoIcon size={18} aria-hidden="true" />
            {isRegister ? "Sign up with Google" : "Continue with Google"}
          </Button>
        </>
      )}

      <p className="text-center text-sm text-base-content/60">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="link link-hover text-base-content">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="link link-hover text-base-content">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
