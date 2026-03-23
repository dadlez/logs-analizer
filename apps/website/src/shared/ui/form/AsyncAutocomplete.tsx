import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

interface AsyncAutocompleteProps {
  label: string;
  options: string[];
  loading: boolean;
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  size?: "small" | "medium";
  minWidth?: number | string;
  inputHtmlProps?: React.InputHTMLAttributes<HTMLInputElement> & Record<string, unknown>;
}

export function AsyncAutocomplete({
  label,
  options,
  loading,
  value,
  onChange,
  onSelect,
  size = "small",
  minWidth,
  inputHtmlProps,
}: AsyncAutocompleteProps) {
  return (
    <Autocomplete
      sx={minWidth !== undefined ? { minWidth } : undefined}
      freeSolo
      options={options}
      loading={loading}
      inputValue={value}
      onInputChange={(_, newValue) => onChange(newValue)}
      onChange={(_, newValue) => {
        const selected = typeof newValue === "string" ? newValue : "";
        onChange(selected);
        onSelect?.(selected);
      }}
      size={size}
      ListboxProps={{ style: { maxHeight: 240, overflow: "auto" } }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size={size}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={16} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          inputProps={{ ...params.inputProps, ...inputHtmlProps }}
        />
      )}
    />
  );
}
