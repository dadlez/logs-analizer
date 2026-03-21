import { useParams } from "@tanstack/react-router";
import { PageContainer } from "../shared/ui/index.ts";
import { EventTimelineWidget } from "../widgets/EventTimelineWidget/index.ts";

export function CorrelationDetailPage() {
  const { id } = useParams({ from: "/correlations/$id" });

  return (
    <PageContainer title={`Correlation: ${id}`}>
      <EventTimelineWidget id={id} table="audit_log" />
    </PageContainer>
  );
}
