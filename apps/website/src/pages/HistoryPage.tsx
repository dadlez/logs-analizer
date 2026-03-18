import { PageContainer } from "../shared/ui/index.ts";
import { ActivityHistoryWidget } from "../widgets/ActivityHistoryWidget/index.ts";

export function HistoryPage() {
  return (
    <PageContainer title="Activity History">
      <ActivityHistoryWidget />
    </PageContainer>
  );
}
