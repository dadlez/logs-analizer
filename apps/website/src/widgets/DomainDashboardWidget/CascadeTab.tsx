import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { Badge, LoadingSpinner, ErrorBanner } from "../../shared/ui/index.ts";
import {
  resolveActionLabel,
  resolveModuleLabel,
  resolveEventColor,
} from "../../entities/log/index.ts";
import type { CascadePattern } from "../../entities/domain/index.ts";

function parseCascadeStep(step: string): { entity_type: number; event_type: string } {
  const [entityType, eventType] = step.split(":");
  return { entity_type: Number(entityType), event_type: eventType };
}

interface CascadeTabProps {
  data: CascadePattern[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function CascadeTab({ data, isLoading, error, refetch }: CascadeTabProps) {
  const {
    palette: { colors },
  } = useTheme();

  return (
    <Box>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message={error.message} onRetry={() =>  refetch()} />}
      {data && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Multi-module transaction patterns ordered by frequency. First badge = initiator,
            remainder = reactors.
          </Typography>
          <Stack spacing={1}>
            {data.map((pattern, i) => {
              const steps = pattern.pattern.map(parseCascadeStep);
              const [trigger, ...reactions] = steps;
              return (
                <Box
                  key={i}
                  sx={{
                    p: 1.5,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ minWidth: 36, pt: 0.25, fontWeight: 600 }}
                  >
                    ×{pattern.count}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
                    {trigger && (
                      <Badge
                        label={`${resolveModuleLabel(trigger.entity_type)}: ${resolveActionLabel(trigger.event_type)}`}
                        accent={resolveEventColor(resolveActionLabel(trigger.event_type), colors)}
                      />
                    )}
                    {reactions.length > 0 && (
                      <Typography variant="caption" sx={{ px: 0.5, color: "text.secondary" }}>
                        →
                      </Typography>
                    )}
                    {reactions.map((step, j) => (
                      <Badge
                        key={j}
                        label={`${resolveModuleLabel(step.entity_type)}: ${resolveActionLabel(step.event_type)}`}
                        accent={resolveEventColor(resolveActionLabel(step.event_type), colors)}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: "auto", pt: 0.25 }}
                  >
                    {pattern.avg_duration_ms}ms avg
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </>
      )}
    </Box>
  );
}
