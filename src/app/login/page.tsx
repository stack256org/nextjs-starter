import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/helpers";
import { isGoogleEnabled } from "@/lib/auth/server";
import { AFTER_SIGN_IN_URL } from "@/lib/auth/config";
import { AuthShell } from "../auth-shell";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = {
  title: "Sign in · Next.js Starter",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Someone who is already signed in has no business on the sign-in page.
  if (await getSession()) {
    redirect(AFTER_SIGN_IN_URL);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        isGoogleEnabled
          ? "Sign in with a link sent to your email, or continue with Google."
          : "Enter your email and we'll send you a link that signs you in."
      }
      aside={{
        heading: "Signing in",
        points: [
          "No password to remember, and none to leak. The link works once and expires in ten minutes.",
          "Your session lives in the database, so signing out on one device takes effect everywhere immediately.",
          "You can see every device you're signed in on, and revoke any of them, from your settings.",
        ],
      }}
    >
      <AuthForm mode="sign-in" googleEnabled={isGoogleEnabled} />
    </AuthShell>
  );
}
