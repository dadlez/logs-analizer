import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { Badge, LoadingSpinner, ErrorBanner } from "../../shared/ui/index.ts";
import {
  resolveActionLabel,
  resolveModuleLabel,
  resolveEventColor,
} from "../../entities/log/index.ts";
import type { ModuleAnalytics } from "../../entities/domain/index.ts";

interface ModulesTabProps {
  modules: ModuleAnalytics[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function ModulesTab({ modules, isLoading, error, refetch }: ModulesTabProps) {
  const {
    palette: { colors },
  } = useTheme();

  return (
    <Box>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
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
                  return <Badge key={et} label={label} accent={resolveEventColor(label, colors)} />;
                })}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
