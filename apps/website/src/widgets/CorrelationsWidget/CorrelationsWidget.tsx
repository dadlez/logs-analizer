import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../shared/ui/index.ts";
import { useCorrelationsQuery } from "../../entities/correlation/index.ts";
import { useCorrelationNavigation } from "../../features/view-correlation/index.ts";
import { useTableSelection } from "../../features/select-table/index.ts";
import { TableSelector } from "../../features/select-table/index.ts";
import { useSearch, useNavigate } from "@tanstack/react-router";
import type { CorrelationSummary } from "../../entities/correlation/index.ts";

const columns: ColumnDef<CorrelationSummary, unknown>[] = [
  { accessorKey: "correlation_id", header: "Correlation ID" },
  { accessorKey: "event_count", header: "Events" },
  {
    accessorKey: "modules",
    header: "Modules",
    cell: (info) => {
      const modules = info.getValue() as string[];
      return Array.isArray(modules) ? modules.join(", ") : "";
    },
  },
  { accessorKey: "started_at", header: "Started At" },
  { accessorKey: "duration_ms", header: "Duration (ms)" },
];

export function CorrelationsWidget() {
  const { table } = useTableSelection();
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
      <Box sx={{ mb: 2 }}>
        <TableSelector />
      </Box>
      {!table && (
        <Typography color="text.secondary">Select a table to view correlations.</Typography>
      )}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading && !!table}
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
