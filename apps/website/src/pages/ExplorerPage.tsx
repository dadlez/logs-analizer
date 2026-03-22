import { PageContainer } from "../shared/ui";
import { LogsBrowserWidget } from "../widgets/LogsBrowserWidget";

export function ExplorerPage() {
  return (
    <PageContainer title="Log Explorer">
      <LogsBrowserWidget />
    </PageContainer>
  );
}
