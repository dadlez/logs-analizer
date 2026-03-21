import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TableSortLabel from "@mui/material/TableSortLabel";
import { LoadingSpinner } from "../layout/LoadingSpinner.tsx";

interface DataTableProps<T extends object> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  isLoading?: boolean;
  page?: number;
  total?: number;
  limit?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onSortChange?: (col: string, dir: "asc" | "desc") => void;
  sortCol?: string;
  sortDir?: "asc" | "desc";
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends object>({
  columns,
  data,
  isLoading,
  page = 1,
  total = 0,
  limit = 50,
  onPrevPage,
  onNextPage,
  onSortChange,
  sortCol,
  sortDir,
  onRowClick,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  if (isLoading) return <LoadingSpinner />;

  const totalPages = Math.ceil(total / limit);

  return (
    <Box>
      <TableContainer component={Paper} data-testid="data-table">
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const col = header.column.id;
                  const isCurrentSort = sortCol === col;
                  return (
                    <TableCell key={header.id}>
                      {onSortChange ? (
                        <TableSortLabel
                          active={isCurrentSort}
                          direction={isCurrentSort ? sortDir : "asc"}
                          onClick={() => {
                            const newDir = isCurrentSort && sortDir === "asc" ? "desc" : "asc";
                            onSortChange(col, newDir);
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableSortLabel>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row, n) => (
              <TableRow
                key={row.id}
                data-testid={`data-row-${n}`}
                hover={!!onRowClick}
                onClick={() => onRowClick?.(row.original)}
                sx={{ cursor: onRowClick ? "pointer" : "default" }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {total > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <Button
            size="small"
            disabled={page <= 1}
            onClick={onPrevPage}
            data-testid="btn-prev-page"
          >
            Prev
          </Button>
          <Typography variant="body2">
            Page {page} of {totalPages} ({total} total)
          </Typography>
          <Button
            size="small"
            disabled={page >= totalPages}
            onClick={onNextPage}
            data-testid="btn-next-page"
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
