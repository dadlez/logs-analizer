import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { Badge, LoadingSpinner, ErrorBanner } from "../../shared/ui/index.ts";
import { useCorrelationDetailQuery } from "../../entities/correlation/index.ts";
import { EntityTypeLabels, TypeLabels, EntityType, Type } from "../../entities/log/index.ts";
import {
  resolveModuleLabel,
  resolveModuleColor,
  resolveEventColor,
} from "../../shared/lib/domain.ts";

interface EventTimelineWidgetProps {
  id: string;
  table: string;
}

export function EventTimelineWidget({ id, table }: EventTimelineWidgetProps) {
  const {
    palette: { colors },
  } = useTheme();
  const { data, isLoading, error, refetch } = useCorrelationDetailQuery(id, table);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <ErrorBanner message={(error as Error).message} onRetry={() => void refetch()} />;
  if (!data) return null;

  return (
    <Box data-testid="correlation-detail">
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Correlation: {data.correlation_id}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {data.modules.map((m) => {
            const label = resolveModuleLabel(m);
            return <Badge key={m} label={label} accent={resolveModuleColor(label, colors)} />;
          })}
        </Box>
      </Paper>

      <Box data-testid="event-timeline">
        <Stack divider={<Divider />} spacing={0}>
          {data.events.map((event, n) => {
            const eventType = event.type;
            const entityType = event.entity_type;

            return (
              <Box
                key={n}
                data-testid={`timeline-item-${n}`}
                sx={{ py: 1.5, px: 2, "&:hover": { bgcolor: "action.hover" } }}
              >
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    #{n + 1}
                  </Typography>
                  {eventType !== undefined &&
                    (() => {
                      const label = TypeLabels[eventType as Type] ?? String(eventType);
                      return <Badge label={label} accent={resolveEventColor(label, colors)} />;
                    })()}
                  {entityType !== undefined &&
                    (() => {
                      const label =
                        EntityTypeLabels[entityType as EntityType] ?? String(entityType);
                      return <Badge label={label} accent={resolveModuleColor(label, colors)} />;
                    })()}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                    {event.created_date}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
