"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { EnvelopeSimple, GoogleLogo, SpinnerGap } from "@phosphor-icons/react/dist/ssr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setIsSending(true);
    try {
      const { error: err } = await authClient.signIn.magicLink({
        email,
      });
      if (err) {
        setError(err.message ?? "Something went wrong");
      } else {
        setHasSent(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSending(false);
    }
  }

  async function handleGoogle() {
    setGoogleError(null);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/login?error=google",
      });
    } catch (e) {
      setGoogleError(
        e instanceof Error ? e.message : "Google sign-in failed",
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="w-full max-w-md">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl justify-center">
              Sign in to Next.js Starter
            </h2>
            <p className="text-center text-sm opacity-70">
              Enter your email to receive a magic link, or use Google.
            </p>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            {googleError && (
              <div className="alert alert-error mt-4">
                <span>{googleError}</span>
              </div>
            )}

            {hasSent ? (
              <div className="alert alert-success mt-4">
                <div className="flex flex-col">
                  <span>Magic link sent to {email}!</span>
                  <span className="text-xs">
                    Check your inbox and click the link to sign in.
                    In development the link is logged to the console.
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <div className="relative">
                    <EnvelopeSimple
                      size={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 z-10"
                    />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="input input-bordered w-full pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <SpinnerGap
                        size={16}
                        className="animate-spin"
                      />
                      Sending…
                    </>
                  ) : (
                    "Send magic link"
                  )}
                </button>
              </form>
            )}

            <div className="divider my-6">or</div>

            <button
              type="button"
              onClick={handleGoogle}
              className="btn btn-primary w-full"
            >
              <GoogleLogo size={20} />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
