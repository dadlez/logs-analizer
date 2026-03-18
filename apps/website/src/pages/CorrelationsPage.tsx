import { PageContainer } from "../shared/ui/index.ts";
import { CorrelationsWidget } from "../widgets/CorrelationsWidget/index.ts";

export function CorrelationsPage() {
  return (
    <PageContainer title="Correlations">
      <CorrelationsWidget />
    </PageContainer>
  );
}
