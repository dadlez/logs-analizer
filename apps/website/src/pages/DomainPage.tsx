import { PageContainer } from "../shared/ui/index.ts";
import { DomainDashboardWidget } from "../widgets/DomainDashboardWidget/index.ts";

export function DomainPage() {
  return (
    <PageContainer title="Domain Analytics">
      <DomainDashboardWidget />
    </PageContainer>
  );
}
