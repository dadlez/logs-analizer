import { apiFetch } from "../../shared/api";

export interface RawLogsResponse {
  data: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

export interface LogsParams {
  table: string;
  page?: number;
  limit?: number;
  module?: string;
  event_type?: string;
  correlation_id?: string;
  from?: string;
  to?: string;
  search?: string;
  sort_col?: string;
  sort_dir?: "asc" | "desc";
}

export function fetchLogs(params: LogsParams): Promise<RawLogsResponse> {
  const qs = new URLSearchParams();
  qs.set("table", params.table);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.module) qs.set("module", params.module);
  if (params.event_type) qs.set("event_type", params.event_type);
  if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.search) qs.set("search", params.search);
  if (params.sort_col) qs.set("sort_col", params.sort_col);
  if (params.sort_dir) qs.set("sort_dir", params.sort_dir);
  return apiFetch<RawLogsResponse>(`/api/logs?${qs.toString()}`);
}
