import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { ModulePill, ActionPill, LoadingSpinner, ErrorBanner } from "../../shared/ui/index.ts";
import type { ModuleAnalytics } from "../../entities/domain/index.ts";

interface ModulesTabProps {
  modules: ModuleAnalytics[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function ModulesTab({ modules, isLoading, error, refetch }: ModulesTabProps) {
  return (
    <Box>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
      <Stack direction="row" flexWrap="wrap" gap={2}>
        {modules?.map((m) => (
          <Card key={m.entity_type} data-testid={`module-card-${m.entity_type}`}>
            <CardContent>
              <ModulePill value={m.entity_type} />
              <Typography variant="body2" color="text.secondary">
                {m.event_count} events · {m.unique_correlations} correlations
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                {m.event_types.map((et) => (
                  <ActionPill key={et} value={et} />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
