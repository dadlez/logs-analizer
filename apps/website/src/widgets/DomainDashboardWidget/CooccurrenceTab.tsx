import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LoadingSpinner, ErrorBanner, HeatmapGrid } from "../../shared/ui/index.ts";
import { resolveModuleLabel } from "../../entities/log/index.ts";
import type { CooccurrenceEntry } from "../../entities/domain/index.ts";
import { EntityType } from "contract";

const ALL_MODULES = [
  EntityType.ContractHeaderEntity,
  EntityType.AnnexHeaderEntity,
  EntityType.AnnexChangeEntity,
  EntityType.FileEntity,
  EntityType.InvoiceEntity,
  EntityType.PaymentScheduleEntity,
  EntityType.ContractFundingEntity,
];

function getCooccurrenceCount(entries: CooccurrenceEntry[], a: number, b: number): number {
  if (a === b) return 0;
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return entries.find((e) => e.module_a === lo && e.module_b === hi)?.count ?? 0;
}

interface CooccurrenceTabProps {
  data: CooccurrenceEntry[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function CooccurrenceTab({ data, isLoading, error, refetch }: CooccurrenceTabProps) {
  const labels = ALL_MODULES.map((m) => resolveModuleLabel(m));

  const getValue = (rowLabel: string, colLabel: string): number => {
    const rowModule = ALL_MODULES.find((m) => resolveModuleLabel(m) === rowLabel);
    const colModule = ALL_MODULES.find((m) => resolveModuleLabel(m) === colLabel);
    if (rowModule === undefined || colModule === undefined || !data) return 0;
    return getCooccurrenceCount(data, rowModule, colModule);
  };

  const formatLabel = (label: string) => label.replace("Entity", "");

  const getTooltip = (row: string, col: string, count: number) =>
    count > 0 ? `${row} ↔ ${col}: ${count}` : "";

  return (
    <Box>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message={error.message} onRetry={() =>  refetch()} />}
      {data && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Number of correlations containing both modules. Higher count = tighter coupling.
          </Typography>
          <HeatmapGrid
            labels={labels}
            getValue={getValue}
            formatLabel={formatLabel}
            getTooltip={getTooltip}
          />
        </>
      )}
    </Box>
  );
}
