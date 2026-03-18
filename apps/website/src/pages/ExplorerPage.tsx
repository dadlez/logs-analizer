import { PageContainer } from "../shared/ui/index.ts";
import { LogsBrowserWidget } from "../widgets/LogsBrowserWidget/index.ts";

export function ExplorerPage() {
  return (
    <PageContainer title="Log Explorer">
      <LogsBrowserWidget />
    </PageContainer>
  );
}
