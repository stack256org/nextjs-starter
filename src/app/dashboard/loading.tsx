import { Container } from "@/components/ui";
import { Spinner } from "@/components/ui";

/**
 * Loading state for the dashboard route group.
 *
 * Shown automatically by Next.js while the server renders the dashboard
 * layout and page. Uses the existing Spinner component from the UI set.
 */
export default function DashboardLoading() {
  return (
    <Container className="flex min-h-[40vh] items-center justify-center">
      <Spinner size="lg" />
    </Container>
  );
}
