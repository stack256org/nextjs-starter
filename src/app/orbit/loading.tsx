import { Spinner } from "@/components/ui";

/**
 * Loading state for the orbit admin route group.
 *
 * Shown automatically by Next.js while the server renders the orbit
 * layout and page. Uses the existing Spinner component from the UI set.
 */
export default function OrbitLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <Spinner size="lg" />
    </div>
  );
}
