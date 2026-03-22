import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { DataTable } from "../../shared/ui";
import { useLogsQuery } from "../../entities/log";
import { useSchemaQuery } from "../../entities/schema/index.ts";
import { TableSelector, useTableSelection } from "../../features/select-table";
import { useLogFilters } from "../../features/filter-logs";
import { useCorrelationNavigation } from "../../features/view-correlation";
import { buildColumns } from "./buildColumns.tsx";
import { applyColumnFilters } from "./applyColumnFilters.ts";

export function LogsBrowserWidget() {
  const { table } = useTableSelection();
  const { filters, setPage, setFilters } = useLogFilters();
  const { navigateToCorrelation } = useCorrelationNavigation();
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const { data: schema } = useSchemaQuery();
  const schemaTable = schema?.find((t) => t.table_name === table);

  const { data, isLoading } = useLogsQuery({
    table,
    page: filters.page,
    sort_col: filters.sort_col || undefined,
    sort_dir: filters.sort_dir || undefined,
  });

  const rows = data?.data ?? [];
  const columns = buildColumns(schemaTable, rows[0]);
  const columnKeys = columns.map((c) => (c as { accessorKey: string }).accessorKey);
  const filteredRows = applyColumnFilters(rows, columnFilters);

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-start" }}>
        <TableSelector />
      </Box>

      {columnKeys.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {columnKeys.map((key) => (
            <TextField
              key={key}
              size="small"
              label={key}
              value={columnFilters[key] ?? ""}
              onChange={(e) => setColumnFilters((prev) => ({ ...prev, [key]: e.target.value }))}
              sx={{ width: 160 }}
            />
          ))}
        </Box>
      )}

      <DataTable
        columns={columns}
        data={filteredRows}
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
