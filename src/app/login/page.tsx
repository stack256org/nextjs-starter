import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/helpers";
import { isGoogleEnabled } from "@/lib/auth/server";
import { AFTER_SIGN_IN_URL } from "@/lib/auth/config";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/ui";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in · Next.js Starter",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Someone who is already signed in has no business on the login page.
  if (await getSession()) {
    redirect(AFTER_SIGN_IN_URL);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-base-100">
      <header className="border-b border-base-300/60">
        <Container className="flex h-16 items-center gap-4">
          <Link href="/" className="flex-1 font-semibold">
            Next.js Starter
          </Link>
          <ThemeToggle />
        </Container>
      </header>

      <main id="main" className="flex flex-1 items-center justify-center pb-24">
        <Container size="form">
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-1.5 text-sm text-base-content/70">
              {isGoogleEnabled
                ? "No password needed. Use a link sent to your email, or continue with Google."
                : "No password needed. We email you a link that signs you in."}
            </p>
          </div>

          <LoginForm googleEnabled={isGoogleEnabled} />

          <p className="mt-8 text-center text-sm text-base-content/60">
            <Link href="/" className="link link-hover">
              Back to home
            </Link>
          </p>
        </Container>
      </main>
    </div>
  );
}
