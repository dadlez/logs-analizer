import { http, HttpResponse } from "msw";
import type {
  SchemaTable,
  LogsResponse,
  CorrelationsResponse,
  CorrelationDetailResponse,
  HistoryResponse,
} from "contract";

export const mockSchemaTable: SchemaTable = {
  table_name: "audit_log",
  row_count: 100,
  columns: [
    {
      column_name: "id",
      data_type: "integer",
      is_nullable: "NO",
      column_default: null,
      ordinal_position: 1,
    },
    {
      column_name: "correlation_id",
      data_type: "uuid",
      is_nullable: "NO",
      column_default: null,
      ordinal_position: 2,
    },
    {
      column_name: "user_email",
      data_type: "text",
      is_nullable: "YES",
      column_default: null,
      ordinal_position: 3,
    },
    {
      column_name: "type",
      data_type: "integer",
      is_nullable: "NO",
      column_default: null,
      ordinal_position: 4,
    },
    {
      column_name: "entity_type",
      data_type: "integer",
      is_nullable: "NO",
      column_default: null,
      ordinal_position: 5,
    },
    {
      column_name: "created_date",
      data_type: "timestamp without time zone",
      is_nullable: "NO",
      column_default: null,
      ordinal_position: 6,
    },
  ],
};

export const mockLogRow = {
  id: 1,
  organization_id: "org-001",
  user_id: "user-001",
  user_email: "test@example.com",
  type: 1,
  entity_type: 1,
  created_date: "2026-01-01T10:00:00",
  old_values: null,
  new_values: null,
  affected_columns: null,
  primary_key: null,
  entity_id: "entity-001",
  parent_id: null,
  correlation_id: "corr-001",
  sub_unit_id: null,
};

export const mockLogsResponse: LogsResponse = {
  data: [mockLogRow],
  total: 1,
  page: 1,
  limit: 50,
};

export const mockCorrelationSummary = {
  correlation_id: "corr-001",
  event_count: 5,
  modules: ["contracts"],
  started_at: "2026-01-01T10:00:00Z",
  ended_at: "2026-01-01T10:01:00Z",
  duration_ms: 60000,
};

export const mockCorrelationsResponse: CorrelationsResponse = {
  data: [mockCorrelationSummary],
  total: 1,
  page: 1,
  limit: 20,
};

export const mockCorrelationDetail: CorrelationDetailResponse = {
  correlation_id: "corr-001",
  events: [mockLogRow],
  modules: ["contracts"],
  event_types: ["1"],
  flow: ["1"],
};

export const mockHistoryEntry = {
  correlation_id: "corr-001",
  user_email: "test@example.com",
  action_type: 1,
  contract_number: "K/2026/001",
  started_at: "2026-01-01T10:00:00Z",
  duration_ms: 1000,
  entity_count: 3,
  entity_types: [1, 4],
};

export const mockHistoryResponse: HistoryResponse = {
  data: [mockHistoryEntry],
  total: 1,
  page: 1,
  limit: 10,
};

export const handlers = [
  http.get("/api/schema", () => {
    return HttpResponse.json([mockSchemaTable]);
  }),

  http.get("/api/logs", () => {
    return HttpResponse.json(mockLogsResponse);
  }),

  http.get("/api/correlations", ({ request }) => {
    const url = new URL(request.url);
    if (url.pathname === "/api/correlations") {
      return HttpResponse.json(mockCorrelationsResponse);
    }
    return HttpResponse.json(mockCorrelationDetail);
  }),

  http.get("/api/correlations/:id", () => {
    return HttpResponse.json(mockCorrelationDetail);
  }),

  http.get("/api/analytics/modules", () => {
    return HttpResponse.json([
      { entity_type: 1, event_count: 50, event_types: ["1"], unique_correlations: 10 },
    ]);
  }),

  http.get("/api/analytics/event-types", () => {
    return HttpResponse.json([
      { event_type: "1", count: 50, modules: ["contracts"], avg_position: 1.5 },
    ]);
  }),

  http.get("/api/analytics/flows", () => {
    return HttpResponse.json([{ flow: ["1", "2"], count: 10 }]);
  }),

  http.get("/api/analytics/timeline", () => {
    return HttpResponse.json([{ bucket: "2026-01-01T00:00:00Z", event_count: 10 }]);
  }),

  http.get("/api/history", () => {
    return HttpResponse.json(mockHistoryResponse);
  }),
];
