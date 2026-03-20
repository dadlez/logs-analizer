import Box from "@mui/material/Box";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../shared/ui/index.ts";
import { useLogsQuery } from "../../entities/log/index.ts";
import { TableSelector } from "../../features/select-table/index.ts";
import { LogsFiltersPanel, useLogFilters } from "../../features/filter-logs/index.ts";
import { useTableSelection } from "../../features/select-table/index.ts";
import { useCorrelationNavigation } from "../../features/view-correlation/index.ts";
import type { LogRow } from "../../entities/log/index.ts";
import { TypeLabels, EntityTypeLabels } from "../../entities/log/index.ts";
import type { Type, EntityType } from "../../entities/log/index.ts";

const columns: ColumnDef<LogRow, unknown>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "correlation_id", header: "Correlation ID" },
  { accessorKey: "user_email", header: "User" },
  {
    accessorKey: "type",
    header: "Action",
    cell: (info) => TypeLabels[info.getValue() as Type] ?? String(info.getValue()),
  },
  {
    accessorKey: "entity_type",
    header: "Entity Type",
    cell: (info) => EntityTypeLabels[info.getValue() as EntityType] ?? String(info.getValue()),
  },
  { accessorKey: "created_date", header: "Created At" },
];

export function LogsBrowserWidget() {
  const { table } = useTableSelection();
  const { filters, setPage, setFilters } = useLogFilters();
  const { navigateToCorrelation } = useCorrelationNavigation();

  const { data, isLoading } = useLogsQuery({
    table,
    page: filters.page,
    module: filters.module || undefined,
    event_type: filters.event_type || undefined,
    correlation_id: filters.correlation_id || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
    search: filters.search || undefined,
    sort_col: filters.sort_col || undefined,
    sort_dir: filters.sort_dir || undefined,
  });

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-start" }}>
        <TableSelector />
      </Box>
      <LogsFiltersPanel />
      <DataTable
        columns={columns}
        data={(data?.data ?? []) as LogRow[]}
        isLoading={isLoading && !!table}
        page={data?.page ?? 1}
        total={data?.total ?? 0}
        limit={data?.limit ?? 50}
        onPrevPage={() => setPage(filters.page - 1)}
        onNextPage={() => setPage(filters.page + 1)}
        onSortChange={(col, dir) => setFilters({ sort_col: col, sort_dir: dir })}
        sortCol={filters.sort_col}
        sortDir={filters.sort_dir}
        onRowClick={(row) => {
          const corrId = row["correlation_id"];
          if (corrId && typeof corrId === "string") {
            navigateToCorrelation(corrId);
          }
        }}
      />
    </Box>
  );
}
