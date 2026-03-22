import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, Badge, BadgePillList } from "../../shared/ui/index.ts";
import { useHistoryQuery } from "../../entities/history/index.ts";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { TypeLabels } from "../../entities/log/index.ts";
import {
  resolveModuleLabel,
  resolveEventColor,
  resolveModuleColor,
} from "../../shared/lib/domain.ts";
import type { HistoryEntry } from "../../entities/history/index.ts";
import type { Type, EntityType } from "../../entities/log/index.ts";

function useColumns(): ColumnDef<HistoryEntry>[] {
  const {
    palette: { colors },
  } = useTheme();
  const colOrganizationId: ColumnDef<HistoryEntry, string> = {
    accessorKey: "organization_id",
    header: "Organization ID",
    cell: (info) => (
      <Box sx={{ maxWidth: 160, wordBreak: "break-all" }}>
        {info.getValue()}
      </Box>
    ),
  };
  const colUserEmail: ColumnDef<HistoryEntry, string> = {
    accessorKey: "user_email",
    header: "User Email",
    cell: (info) => (
      <Box sx={{ maxWidth: 160, wordBreak: "break-all" }}>
        {info.getValue()}
      </Box>
    ),
  };
  const colActionType: ColumnDef<HistoryEntry, Type> = {
    accessorKey: "action_type",
    header: "Action Type",
    cell: (info) => {
      const label = TypeLabels[info.getValue()] ?? String(info.getValue());
      return <Badge label={label} accent={resolveEventColor(label, colors)} />;
    },
  };
  const colContractNumber: ColumnDef<HistoryEntry, string | null> = {
    accessorKey: "contract_number",
    header: "Contract",
    cell: (info) => (
      <Box sx={{ maxWidth: 120, wordBreak: "break-all" }}>
        {info.getValue() ?? ""}
      </Box>
    ),
  };
  const colStartedAt: ColumnDef<HistoryEntry, string> = {
    accessorKey: "started_at",
    header: "Started At",
  };
  const colDuration: ColumnDef<HistoryEntry, number> = {
    accessorKey: "duration_ms",
    header: "Duration (ms)",
  };
  const colEntityCount: ColumnDef<HistoryEntry, number> = {
    accessorKey: "entity_count",
    header: "Entity Count",
  };
  const colEntityTypes: ColumnDef<HistoryEntry, EntityType[]> = {
    accessorKey: "entity_types",
    header: "Entity Types",
    cell: (info) => {
      const labels = info.getValue().map((t) => resolveModuleLabel(t));
      return (
        <BadgePillList
          labels={labels}
          resolveAccent={(label) => resolveModuleColor(label, colors)}
        />
      );
    },
  };
  return [
    colOrganizationId,
    colUserEmail,
    colActionType,
    colContractNumber,
    colStartedAt,
    colDuration,
    colEntityCount,
    colEntityTypes,
  ];
}

export function ActivityHistoryWidget() {
  const columns = useColumns();
  const table = "audit_log";
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();

  const page = Number(search["page"] ?? 1);
  const userEmail = (search["user_email"] as string) ?? "";
  const organizationId = (search["organization_id"] as string) ?? "";

  const { data, isLoading } = useHistoryQuery({
    table,
    page,
    user_email: userEmail || undefined,
    organization_id: organizationId || undefined,
  });

  function setSearch(partial: Record<string, unknown>) {
    void navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, ...partial }),
    } as Parameters<typeof navigate>[0]);
  }

  return (
    <Box data-testid="history-table">
      <Alert severity="info" sx={{ mb: 2 }}>
        Showing data from the audit_log table
      </Alert>
      <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
        <TextField
          size="small"
          label="Organization ID"
          value={organizationId}
          onChange={(e) => setSearch({ organization_id: e.target.value, page: 1 })}
          inputProps={{ "data-testid": "filter-organization-id" }}
        />
        <TextField
          size="small"
          label="User Email"
          value={userEmail}
          onChange={(e) => setSearch({ user_email: e.target.value, page: 1 })}
          inputProps={{ "data-testid": "filter-user-email" }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => setSearch({ organization_id: "", user_email: "", page: 1 })}
          data-testid="btn-clear-filters"
        >
          Clear
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        page={data?.page ?? 1}
        total={data?.total ?? 0}
        limit={data?.limit ?? 10}
        onPrevPage={() => setSearch({ page: page - 1 })}
        onNextPage={() => setSearch({ page: page + 1 })}
      />
    </Box>
  );
}
