import type {SchemaTable} from "../../entities/schema";
import type {ColumnDef} from "@tanstack/react-table";
import Box from "@mui/material/Box";

const MAX_CELL_LENGTH = 120;

export function buildColumns(
  schemaTable: SchemaTable | undefined,
  firstRow: Record<string, unknown> | undefined,
): ColumnDef<Record<string, unknown>>[] {
  const keys = schemaTable
    ? schemaTable.columns.map((c) => c.column_name)
    : firstRow
      ? Object.keys(firstRow)
      : [];

  return keys.map((key) => ({
    accessorKey: key,
    header: key,
    cell: (info) => {
      const val = info.getValue<unknown>();
      if (val === null || val === undefined) return null;
      const str =
        typeof val === "object"
          ? JSON.stringify(val)
          : String(val as string | number | boolean | bigint | symbol);
      if (str.length > MAX_CELL_LENGTH) {
        return (
          <Box
            title={str}
            sx={{
              maxWidth: 240,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {str}
          </Box>
        );
      }
      return str;
    },
  }));
}
