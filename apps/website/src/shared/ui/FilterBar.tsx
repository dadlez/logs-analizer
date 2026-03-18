import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import type { ReactNode } from "react";

export interface FilterBarField {
  type: "text" | "select";
  label: string;
  value: string;
  onChange: (v: string) => void;
  "data-testid"?: string;
  options?: { value: string; label: string }[];
}

interface FilterBarProps {
  fields: FilterBarField[];
  onApply: () => void;
  onClear: () => void;
  children?: ReactNode;
}

export function FilterBar({ fields, onApply, onClear, children }: FilterBarProps) {
  return (
    <Box
      data-testid="filter-bar"
      sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-end", mb: 2 }}
    >
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <FormControl key={field.label} size="small" sx={{ minWidth: 160 }}>
              <InputLabel>{field.label}</InputLabel>
              <Select
                value={field.value}
                label={field.label}
                onChange={(e) => field.onChange(e.target.value)}
                inputProps={{ "data-testid": field["data-testid"] }}
              >
                <MenuItem value="">All</MenuItem>
                {field.options?.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }
        return (
          <TextField
            key={field.label}
            size="small"
            label={field.label}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            inputProps={{ "data-testid": field["data-testid"] }}
          />
        );
      })}
      {children}
      <Button variant="contained" onClick={onApply} data-testid="btn-apply-filters" size="small">
        Apply
      </Button>
      <Button variant="outlined" onClick={onClear} data-testid="btn-clear-filters" size="small">
        Clear
      </Button>
    </Box>
  );
}
