import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, BadgePillList } from "../../shared/ui/index.ts";
import { useCorrelationsQuery } from "../../entities/correlation/index.ts";
import { useCorrelationNavigation } from "../../features/view-correlation/index.ts";
import { useSearch, useNavigate } from "@tanstack/react-router";
import type { CorrelationSummary } from "../../entities/correlation/index.ts";
import { resolveModuleLabel, resolveModuleColor } from "../../entities/log/index.ts";

function useColumns(): ColumnDef<CorrelationSummary>[] {
  const {
    palette: { colors },
  } = useTheme();
  const colCorrelationId: ColumnDef<CorrelationSummary, string> = {
    accessorKey: "correlation_id",
    header: "Correlation ID",
    cell: (info) => (
      <Box
        sx={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {info.getValue()}
      </Box>
    ),
  };
  const colEventCount: ColumnDef<CorrelationSummary, number> = {
    accessorKey: "event_count",
    header: "Event Count",
  };
  const colModules: ColumnDef<CorrelationSummary, string[]> = {
    accessorKey: "modules",
    header: "Modules",
    cell: (info) => {
      const labels = info.getValue().map(resolveModuleLabel);
      return (
        <BadgePillList
          labels={labels}
          resolveAccent={(label) => resolveModuleColor(label, colors)}
        />
      );
    },
  };
  const colStartedAt: ColumnDef<CorrelationSummary, string> = {
    accessorKey: "started_at",
    header: "Started At",
  };
  const colDuration: ColumnDef<CorrelationSummary, number> = {
    accessorKey: "duration_ms",
    header: "Duration (ms)",
  };
  return [colCorrelationId, colEventCount, colModules, colStartedAt, colDuration];
}

export function CorrelationsWidget() {
  const columns = useColumns();
  const table = "audit_log";
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();
  const page = Number(search["page"] ?? 1);
  const { navigateToCorrelation } = useCorrelationNavigation();

  const { data, isLoading } = useCorrelationsQuery({
    table,
    page,
    module: (search["module"] as string) || undefined,
  });

  return (
    <Box data-testid="correlations-list">
      <Alert severity="info" sx={{ mb: 2 }}>
        Showing data from the audit_log table
      </Alert>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        page={data?.page ?? 1}
        total={data?.total ?? 0}
        limit={data?.limit ?? 20}
        onPrevPage={() =>
          void navigate({
            search: (prev: Record<string, unknown>) => ({ ...prev, page: page - 1 }),
          } as Parameters<typeof navigate>[0])
        }
        onNextPage={() =>
          void navigate({
            search: (prev: Record<string, unknown>) => ({ ...prev, page: page + 1 }),
          } as Parameters<typeof navigate>[0])
        }
        onRowClick={(row) => navigateToCorrelation(row.correlation_id)}
      />
    </Box>
  );
}
