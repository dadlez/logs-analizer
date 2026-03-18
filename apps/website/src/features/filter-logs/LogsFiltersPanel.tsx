import TextField from "@mui/material/TextField";
import { FilterBar } from "../../shared/ui/index.ts";
import { useLogFilters } from "./useLogFilters.ts";

export function LogsFiltersPanel() {
  const { filters, setFilters, clearFilters } = useLogFilters();

  return (
    <FilterBar
      fields={[
        {
          type: "text",
          label: "Module",
          value: filters.module,
          onChange: (v) => setFilters({ module: v }),
          "data-testid": "filter-module",
        },
        {
          type: "text",
          label: "Event Type",
          value: filters.event_type,
          onChange: (v) => setFilters({ event_type: v }),
          "data-testid": "filter-event-type",
        },
        {
          type: "text",
          label: "Correlation ID",
          value: filters.correlation_id,
          onChange: (v) => setFilters({ correlation_id: v }),
          "data-testid": "filter-correlation-id",
        },
      ]}
      onApply={() => setFilters({})}
      onClear={clearFilters}
    >
      <TextField
        size="small"
        label="From"
        type="date"
        value={filters.from}
        onChange={(e) => setFilters({ from: e.target.value })}
        InputLabelProps={{ shrink: true }}
        inputProps={{ "data-testid": "filter-date-from" }}
      />
      <TextField
        size="small"
        label="To"
        type="date"
        value={filters.to}
        onChange={(e) => setFilters({ to: e.target.value })}
        InputLabelProps={{ shrink: true }}
        inputProps={{ "data-testid": "filter-date-to" }}
      />
      <TextField
        size="small"
        label="Search"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        inputProps={{ "data-testid": "filter-search" }}
      />
    </FilterBar>
  );
}
