import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useSchemaQuery } from "../../entities/schema/index.ts";
import { useTableSelection } from "./useTableSelection.ts";

export function TableSelector() {
  const { data: schema } = useSchemaQuery();
  const { table, setTable } = useTableSelection();

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Table</InputLabel>
      <Select
        value={table}
        label="Table"
        onChange={(e) => setTable(e.target.value)}
        inputProps={{ "data-testid": "table-selector" }}
      >
        {schema?.map((t) => (
          <MenuItem key={t.table_name} value={t.table_name}>
            {t.table_name} ({t.row_count})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
