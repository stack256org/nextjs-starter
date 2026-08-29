"use client";

import { Button, Container } from "@/components/ui";

/**
 * Root error boundary — catches runtime errors in any route segment.
 *
 * A Client Component by requirement (Next.js error boundaries must be). The
 * layout, fonts and ThemeProvider are all still intact because the error
 * boundary sits inside the root layout, so styling works as normal.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-base-100">
      <Container size="prose" className="flex flex-col items-center gap-6 text-center">
        <p className="font-mono text-sm tracking-widest text-base-content/50 uppercase">
          Error
        </p>
        <div className="max-w-[52ch]">
          <h1 className="text-3xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-3 text-base-content/70">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
        </div>
      </Container>
    </main>
  );
}
