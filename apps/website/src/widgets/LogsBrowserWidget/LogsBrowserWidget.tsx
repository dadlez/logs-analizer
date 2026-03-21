import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, Badge } from "../../shared/ui/index.ts";
import { useLogsQuery } from "../../entities/log/index.ts";
import { TableSelector } from "../../features/select-table/index.ts";
import { LogsFiltersPanel, useLogFilters } from "../../features/filter-logs/index.ts";
import { useTableSelection } from "../../features/select-table/index.ts";
import { useCorrelationNavigation } from "../../features/view-correlation/index.ts";
import type { LogRow } from "../../entities/log/index.ts";
import { TypeLabels, EntityTypeLabels } from "../../entities/log/index.ts";
import { resolveEventColor, resolveModuleColor } from "../../shared/lib/domain.ts";
import type { Type, EntityType } from "../../entities/log/index.ts";

function useColumns(): ColumnDef<LogRow>[] {
  const {
    palette: { colors },
  } = useTheme();
  const colId: ColumnDef<LogRow, number> = { accessorKey: "id", header: "ID" };
  const colCorrelationId: ColumnDef<LogRow, string> = {
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
  const colUserEmail: ColumnDef<LogRow, string> = {
    accessorKey: "user_email",
    header: "User",
    cell: (info) => (
      <Box
        sx={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {info.getValue()}
      </Box>
    ),
  };
  const colType: ColumnDef<LogRow, Type> = {
    accessorKey: "type",
    header: "Action",
    cell: (info) => {
      const label = TypeLabels[info.getValue()] ?? String(info.getValue());
      return <Badge label={label} accent={resolveEventColor(label, colors)} />;
    },
  };
  const colEntityType: ColumnDef<LogRow, EntityType> = {
    accessorKey: "entity_type",
    header: "Entity Type",
    cell: (info) => {
      const label = EntityTypeLabels[info.getValue()] ?? String(info.getValue());
      return <Badge label={label} accent={resolveModuleColor(label, colors)} />;
    },
  };
  const colCreatedDate: ColumnDef<LogRow, string> = {
    accessorKey: "created_date",
    header: "Created At",
  };
  return [colId, colCorrelationId, colUserEmail, colType, colEntityType, colCreatedDate];
}

export function LogsBrowserWidget() {
  const columns = useColumns();
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
