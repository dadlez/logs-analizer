import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../shared/ui/index.ts";
import { useHistoryQuery } from "../../entities/history/index.ts";
import { TableSelector } from "../../features/select-table/index.ts";
import { useTableSelection } from "../../features/select-table/index.ts";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { TypeLabels, TypeOptions, EntityTypeLabels, EntityType } from "../../entities/log/index.ts";
import type { HistoryEntry } from "../../entities/history/index.ts";
import type { Type } from "../../entities/log/index.ts";

const columns: ColumnDef<HistoryEntry, unknown>[] = [
  { accessorKey: "user_email", header: "User Email" },
  {
    accessorKey: "action_type",
    header: "Action Type",
    cell: (info) => TypeLabels[info.getValue() as Type] ?? String(info.getValue()),
  },
  { accessorKey: "contract_number", header: "Contract" },
  { accessorKey: "started_at", header: "Started At" },
  { accessorKey: "duration_ms", header: "Duration (ms)" },
  { accessorKey: "entity_count", header: "Entities" },
  {
    accessorKey: "entity_types",
    header: "Entity Types",
    cell: (info) => {
      const types = info.getValue() as number[];
      if (!Array.isArray(types)) return "";
      return types.map((t) => EntityTypeLabels[t as EntityType] ?? String(t)).join(", ");
    },
  },
];

export function ActivityHistoryWidget() {
  const { table } = useTableSelection();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();

  const page = Number(search["page"] ?? 1);
  const userEmail = (search["user_email"] as string) ?? "";
  const actionType =
    search["action_type"] !== undefined ? Number(search["action_type"]) : undefined;

  const { data, isLoading } = useHistoryQuery({
    table,
    page,
    user_email: userEmail || undefined,
    action_type: actionType,
  });

  function setSearch(partial: Record<string, unknown>) {
    void navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, ...partial }),
    } as Parameters<typeof navigate>[0]);
  }

  return (
    <Box data-testid="history-table">
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
        <TableSelector />
        <TextField
          size="small"
          label="User Email"
          value={userEmail}
          onChange={(e) => setSearch({ user_email: e.target.value, page: 1 })}
          inputProps={{ "data-testid": "filter-user-email" }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Action Type</InputLabel>
          <Select
            value={actionType !== undefined ? String(actionType) : ""}
            label="Action Type"
            onChange={(e) => setSearch({ action_type: e.target.value || undefined, page: 1 })}
            inputProps={{ "data-testid": "filter-action-type" }}
          >
            <MenuItem value="">All</MenuItem>
            {TypeOptions.map((opt) => (
              <MenuItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSearch({ user_email: "", action_type: undefined, page: 1 })}
          data-testid="btn-clear-filters"
        >
          Clear
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading && !!table}
        page={data?.page ?? 1}
        total={data?.total ?? 0}
        limit={data?.limit ?? 10}
        onPrevPage={() => setSearch({ page: page - 1 })}
        onNextPage={() => setSearch({ page: page + 1 })}
      />
    </Box>
  );
}
