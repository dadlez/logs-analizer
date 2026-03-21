import Box from "@mui/material/Box";
import { LoadingSpinner, ErrorBanner, HeatmapGrid, SectionHeading } from "../../shared/ui/index.ts";
import { resolveModuleLabel } from "../../shared/lib/domain.ts";
import type { CooccurrenceEntry, ModuleAnalytics } from "../../entities/domain/index.ts";
import { EntityType } from "contract";
import {
  getCooccurrenceCount,
  getPercentageValue,
  getPercentageTooltip,
} from "./cooccurrenceHelpers.ts";

const ALL_MODULES = [
  EntityType.ContractHeaderEntity,
  EntityType.AnnexHeaderEntity,
  EntityType.AnnexChangeEntity,
  EntityType.FileEntity,
  EntityType.InvoiceEntity,
  EntityType.PaymentScheduleEntity,
  EntityType.ContractFundingEntity,
];

const formatLabel = (label: string) => label.replace("Entity", "");
const formatCell = (v: number) => (v > 0 ? `${Math.round(v)}%` : "");
const getRawTooltip = (row: string, col: string, count: number) =>
  count > 0 ? `${row} ↔ ${col}: ${count}` : "";

interface CooccurrenceTabProps {
  data: CooccurrenceEntry[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  modules: ModuleAnalytics[];
}

export function CooccurrenceTab({
  data,
  isLoading,
  error,
  refetch,
  modules,
}: CooccurrenceTabProps) {
  const labels = ALL_MODULES.map((m) => resolveModuleLabel(m));

  const uniqueCorrelationsMap = new Map<number, number>(
    modules.map((m) => [m.entity_type, m.unique_correlations]),
  );

  const resolveModules = (rowLabel: string, colLabel: string) => ({
    rowModule: ALL_MODULES.find((m) => resolveModuleLabel(m) === rowLabel),
    colModule: ALL_MODULES.find((m) => resolveModuleLabel(m) === colLabel),
  });

  const getValue = (rowLabel: string, colLabel: string): number => {
    const { rowModule, colModule } = resolveModules(rowLabel, colLabel);
    if (rowModule === undefined || colModule === undefined || !data) return 0;
    return getCooccurrenceCount(data, rowModule, colModule);
  };

  const getPercentageValueForLabel = (rowLabel: string, colLabel: string): number => {
    const { rowModule, colModule } = resolveModules(rowLabel, colLabel);
    return getPercentageValue(rowModule, colModule, data, uniqueCorrelationsMap);
  };

  const getPercentageTooltipForLabel = (row: string, col: string): string => {
    const { rowModule, colModule } = resolveModules(row, col);
    return getPercentageTooltip(row, col, rowModule, colModule, data, uniqueCorrelationsMap);
  };

  return (
    <Box>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorBanner message={error.message} onRetry={() => refetch()} />}
      {data && (
        <>
          <SectionHeading
            title="Raw co-occurrence counts"
            description="Number of correlations containing both modules. Higher count = tighter coupling."
          />
          <HeatmapGrid
            labels={labels}
            getValue={getValue}
            formatLabel={formatLabel}
            getTooltip={getRawTooltip}
          />

          <Box sx={{ mt: 3 }}>
            <SectionHeading
              title="Coupling strength (% of row module's correlations that include column module)"
              description="P(col | row) — directional: row is the base module."
            />
            <HeatmapGrid
              labels={labels}
              getValue={getPercentageValueForLabel}
              formatLabel={formatLabel}
              getTooltip={getPercentageTooltipForLabel}
              formatCell={formatCell}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
