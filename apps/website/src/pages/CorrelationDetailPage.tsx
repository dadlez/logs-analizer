import { useParams, useSearch } from "@tanstack/react-router";
import { PageContainer } from "../shared/ui/index.ts";
import { EventTimelineWidget } from "../widgets/EventTimelineWidget/index.ts";

export function CorrelationDetailPage() {
  const { id } = useParams({ from: "/correlations/$id" });
  const search = useSearch({ from: "/correlations/$id" });
  const table = ((search as Record<string, unknown>)["table"] as string) ?? "";

  return (
    <PageContainer title={`Correlation: ${id}`}>
      <EventTimelineWidget id={id} table={table} />
    </PageContainer>
  );
}
