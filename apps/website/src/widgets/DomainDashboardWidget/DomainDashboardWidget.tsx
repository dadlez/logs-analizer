import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { Badge, LoadingSpinner, ErrorBanner } from "../../shared/ui/index.ts";
import { useModulesQuery, useEventTypesQuery, useFlowsQuery } from "../../entities/domain/index.ts";
import {
  resolveActionLabel,
  resolveModuleLabel,
  resolveEventColor,
} from "../../entities/log/index.ts";

export function DomainDashboardWidget() {
  const {
    palette: { colors },
  } = useTheme();
  const [tab, setTab] = useState(0);
  const table = "audit_log";

  const {
    data: modules,
    isLoading: modulesLoading,
    error: modulesError,
    refetch: refetchModules,
  } = useModulesQuery(table);
  const {
    data: eventTypes,
    isLoading: etLoading,
    error: etError,
    refetch: refetchEt,
  } = useEventTypesQuery(table);
  const {
    data: flows,
    isLoading: flowsLoading,
    error: flowsError,
    refetch: refetchFlows,
  } = useFlowsQuery(table);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Showing data from the audit_log table
      </Alert>

      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Modules" />
        <Tab label="Event Types" />
        <Tab label="Flows" />
      </Tabs>

      {tab === 0 && (
        <Box>
          {modulesLoading && <LoadingSpinner />}
          {modulesError && (
            <ErrorBanner
              message={(modulesError as Error).message}
              onRetry={() => void refetchModules()}
            />
          )}
          <Stack direction="row" flexWrap="wrap" gap={2}>
            {modules?.map((m) => (
              <Card key={m.entity_type} data-testid={`module-card-${m.entity_type}`}>
                <CardContent>
                  <Typography variant="h6">{resolveModuleLabel(m.entity_type)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {m.event_count} events · {m.unique_correlations} correlations
                  </Typography>
                  <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {m.event_types.map((et) => {
                      const label = resolveActionLabel(et);
                      return (
                        <Badge key={et} label={label} accent={resolveEventColor(label, colors)} />
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {tab === 1 && (
        <Box>
          {etLoading && <LoadingSpinner />}
          {etError && (
            <ErrorBanner message={(etError as Error).message} onRetry={() => void refetchEt()} />
          )}
          <Stack spacing={1}>
            {eventTypes?.map((et) => (
              <Box key={et.event_type} sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 1 }}>
                <Typography variant="subtitle2">{resolveActionLabel(et.event_type)}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Count: {et.count} · Avg position: {et.avg_position}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {tab === 2 && (
        <Box>
          {flowsLoading && <LoadingSpinner />}
          {flowsError && (
            <ErrorBanner
              message={(flowsError as Error).message}
              onRetry={() => void refetchFlows()}
            />
          )}
          <Stack spacing={1}>
            {flows?.map((f, n) => (
              <Box
                key={n}
                data-testid={`flow-sequence-${n}`}
                sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 1 }}
              >
                <Typography variant="caption" color="text.secondary">
                  ×{f.count}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: 0.5 }}>
                  {f.flow.map((step, i) => {
                    const label = resolveActionLabel(step);
                    return (
                      <Badge key={i} label={label} accent={resolveEventColor(label, colors)} />
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
