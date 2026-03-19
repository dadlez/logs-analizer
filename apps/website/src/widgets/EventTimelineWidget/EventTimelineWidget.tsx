import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { Badge, LoadingSpinner, ErrorBanner } from "../../shared/ui/index.ts";
import { useCorrelationDetailQuery } from "../../entities/correlation/index.ts";
import { EntityTypeLabels, TypeLabels, EntityType, Type } from "../../entities/log/index.ts";

interface EventTimelineWidgetProps {
  id: string;
  table: string;
}

export function EventTimelineWidget({ id, table }: EventTimelineWidgetProps) {
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
          {data.modules.map((m) => (
            <Badge key={m} label={m} variant="module" />
          ))}
        </Box>
      </Paper>

      <Box data-testid="event-timeline">
        <Stack divider={<Divider />} spacing={0}>
          {(data.events as Record<string, unknown>[]).map((event, n) => {
            const eventType = event["type"] as number | undefined;
            const entityType = event["entity_type"] as number | undefined;

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
                  {eventType !== undefined && (
                    <Badge
                      label={TypeLabels[eventType as Type] ?? String(eventType)}
                      variant="event-type"
                    />
                  )}
                  {entityType !== undefined && (
                    <Badge
                      label={EntityTypeLabels[entityType as EntityType] ?? String(entityType)}
                      variant="module"
                    />
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
                    {(event["created_date"] as string) ?? ""}
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
