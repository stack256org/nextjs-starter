import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found · Next.js Starter",
  robots: { index: false, follow: false },
};

/**
 * A 404 that offers a way out.
 *
 * Both destinations are safe for a signed-out visitor: `/` is public and
 * `/dashboard` redirects to `/login` when there is no session.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-base-100 px-4 text-center">
      <p className="font-mono text-sm tracking-widest text-base-content/50 uppercase">
        404
      </p>
      <div className="max-w-[52ch]">
        <h1 className="text-3xl font-semibold tracking-tight">
          That page does not exist
        </h1>
        <p className="mt-3 text-base-content/70">
          The link may be out of date, or the page may have moved. Nothing is
          broken on your end.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" variant="primary">
          Back to home
        </ButtonLink>
        <ButtonLink href="/dashboard">Go to dashboard</ButtonLink>
      </div>
      <p className="text-sm text-base-content/50">
        Looking for the component reference?{" "}
        <Link href="/ui" className="link">
          Browse the components
        </Link>
        .
      </p>
    </main>
  );
}
