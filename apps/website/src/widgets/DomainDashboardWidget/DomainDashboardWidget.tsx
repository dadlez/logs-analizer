import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import {
  useModulesQuery,
  useCooccurrenceQuery,
  useCascadeQuery,
} from "../../entities/domain/index.ts";
import { ModulesTab } from "./ModulesTab.tsx";
import { CooccurrenceTab } from "./CooccurrenceTab.tsx";
import { CascadeTab } from "./CascadeTab.tsx";

export function DomainDashboardWidget() {
  const [tab, setTab] = useState(0);
  const table = "audit_log";

  const {
    data: modules,
    isLoading: modulesLoading,
    error: modulesError,
    refetch: refetchModules,
  } = useModulesQuery(table);
  const {
    data: cooccurrence,
    isLoading: coocLoading,
    error: coocError,
    refetch: refetchCooc,
  } = useCooccurrenceQuery(table);
  const {
    data: cascade,
    isLoading: cascadeLoading,
    error: cascadeError,
    refetch: refetchCascade,
  } = useCascadeQuery(table);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Showing data from the audit_log table
      </Alert>

      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Modules" />
        <Tab label="Co-occurrence" />
        <Tab label="Cascade Patterns" />
      </Tabs>

      {tab === 0 && (
        <ModulesTab
          modules={modules}
          isLoading={modulesLoading}
          error={modulesError as Error | null}
          refetch={refetchModules}
        />
      )}

      {tab === 1 && (
        <CooccurrenceTab
          data={cooccurrence}
          isLoading={coocLoading}
          error={coocError as Error | null}
          refetch={refetchCooc}
          modules={modules ?? []}
        />
      )}

      {tab === 2 && (
        <CascadeTab
          data={cascade}
          isLoading={cascadeLoading}
          error={cascadeError as Error | null}
          refetch={refetchCascade}
        />
      )}
    </Box>
  );
}
