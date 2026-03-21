import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { ModulePill, ActionPill, LoadingSpinner, ErrorBanner } from "../../shared/ui/index.ts";
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
  return (
    <Box>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
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
                      <>
                        <ModulePill value={trigger.entity_type} />
                        <ActionPill value={trigger.event_type} />
                      </>
                    )}
                    {reactions.length > 0 && (
                      <Typography variant="caption" sx={{ px: 0.5, color: "text.secondary" }}>
                        →
                      </Typography>
                    )}
                    {reactions.map((step, j) => (
                      <Box key={j} sx={{ display: "flex", gap: 0.5 }}>
                        <ModulePill value={step.entity_type} />
                        <ActionPill value={step.event_type} />
                      </Box>
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
