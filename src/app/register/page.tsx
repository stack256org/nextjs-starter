import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/helpers";
import { isGoogleEnabled } from "@/lib/auth/server";
import { AFTER_SIGN_IN_URL } from "@/lib/auth/config";
import { AuthShell } from "../auth-shell";
import { AuthForm } from "../auth-form";

export const metadata: Metadata = {
  title: "Create your account · Next.js Starter",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  if (await getSession()) {
    redirect(AFTER_SIGN_IN_URL);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        isGoogleEnabled
          ? "Takes about twenty seconds. No password to choose."
          : "Takes about twenty seconds. We'll email you a link to confirm it's you."
      }
      aside={{
        heading: "What you get",
        points: [
          "A dashboard showing your account, and every device it's signed in on.",
          "Passwordless sign-in. Nothing to choose now, nothing to reset later.",
          "Full control of your profile and theme, and the ability to sign out everywhere at once.",
        ],
        footnote:
          "By creating an account you agree to the terms of service and privacy policy. This is a starter template — replace this line with your real links before you ship.",
      }}
    >
      <AuthForm mode="register" googleEnabled={isGoogleEnabled} />
    </AuthShell>
  );
}
