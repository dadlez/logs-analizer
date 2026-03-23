import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, Badge, BadgePillList, AsyncAutocomplete } from "../../shared/ui/index.ts";
import { useHistoryQuery, useSuggestionsQuery, parseContractId } from "../../entities/history/index.ts";
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
    cell: (info) => <Box sx={{ maxWidth: 160, wordBreak: "break-all" }}>{info.getValue()}</Box>,
  };
  const colUserEmail: ColumnDef<HistoryEntry, string> = {
    accessorKey: "user_email",
    header: "User Email",
    cell: (info) => <Box sx={{ maxWidth: 160, wordBreak: "break-all" }}>{info.getValue()}</Box>,
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
      <Box sx={{ maxWidth: 120, wordBreak: "break-all" }}>{parseContractId(info.getValue())}</Box>
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
  const [showOrgId, setShowOrgId] = useState(true);
  const table = "audit_log";
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();

  const page = Number(search["page"] ?? 1);

  const [emailInput, setEmailInput] = useState((search["user_email"] as string) ?? "");
  const [orgInput, setOrgInput] = useState((search["organization_id"] as string) ?? "");
  const [emailFilter, setEmailFilter] = useState((search["user_email"] as string) ?? "");
  const [orgFilter, setOrgFilter] = useState((search["organization_id"] as string) ?? "");

  const { data: emailSuggestions, isFetching: emailLoading } = useSuggestionsQuery("user_email");
  const { data: orgSuggestions, isFetching: orgLoading } = useSuggestionsQuery("organization_id");

  const { data, isLoading } = useHistoryQuery({
    table,
    page,
    user_email: emailFilter || undefined,
    organization_id: orgFilter || undefined,
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
        <AsyncAutocomplete
          label="Organization ID"
          options={orgSuggestions?.data ?? []}
          loading={orgLoading}
          value={orgInput}
          onChange={(value) => {
            setOrgInput(value);
            if (!value) {
              setOrgFilter("");
              setSearch({ organization_id: "", page: 1 });
            }
          }}
          onSelect={(value) => {
            setOrgFilter(value);
            setSearch({ organization_id: value, page: 1 });
          }}
          inputHtmlProps={{ "data-testid": "filter-organization-id" }}
          minWidth={240}
        />
        <AsyncAutocomplete
          label="User Email"
          options={emailSuggestions?.data ?? []}
          loading={emailLoading}
          value={emailInput}
          onChange={(value) => {
            setEmailInput(value);
            if (!value) {
              setEmailFilter("");
              setSearch({ user_email: "", page: 1 });
            }
          }}
          onSelect={(value) => {
            setEmailFilter(value);
            setSearch({ user_email: value, page: 1 });
          }}
          inputHtmlProps={{ "data-testid": "filter-user-email" }}
          minWidth={240}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setEmailInput("");
            setOrgInput("");
            setEmailFilter("");
            setOrgFilter("");
            setSearch({ organization_id: "", user_email: "", page: 1 });
          }}
          data-testid="btn-clear-filters"
        >
          Clear
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowOrgId((v) => !v)}
          data-testid="btn-toggle-org-id"
          startIcon={showOrgId ? <VisibilityIcon /> : <VisibilityOffIcon />}
        >
          {showOrgId ? "Hide" : "Show"} Organization ID
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
        columnVisibility={{ organization_id: showOrgId }}
      />
    </Box>
  );
}
