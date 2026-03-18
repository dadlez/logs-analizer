import { useNavigate, useSearch } from "@tanstack/react-router";

export function useCorrelationNavigation() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const table = (search["table"] as string) ?? "";

  function navigateToCorrelation(correlationId: string) {
    void navigate({
      to: "/correlations/$id",
      params: { id: correlationId },
      search: { table },
    } as unknown as Parameters<typeof navigate>[0]);
  }

  return { navigateToCorrelation };
}
