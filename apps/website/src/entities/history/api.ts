import { apiFetch } from "../../shared/api/index.ts";
import type { HistoryResponse } from "contract";

export interface HistoryParams {
  table: string;
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  user_email?: string;
  action_type?: number;
}

export function fetchHistory(params: HistoryParams): Promise<HistoryResponse> {
  const qs = new URLSearchParams();
  qs.set("table", params.table);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.user_email) qs.set("user_email", params.user_email);
  if (params.action_type !== undefined) qs.set("action_type", String(params.action_type));
  return apiFetch<HistoryResponse>(`/api/history?${qs.toString()}`);
}
