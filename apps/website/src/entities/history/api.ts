import { apiFetch } from "../../shared/api/index.ts";
import type { HistoryResponse, SuggestionField, SuggestionsResponse } from "contract";

export interface HistoryParams {
  table: string;
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  user_email?: string;
  organization_id?: string;
}

export function fetchHistory(params: HistoryParams): Promise<HistoryResponse> {
  const qs = new URLSearchParams();
  qs.set("table", params.table);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  if (params.user_email) qs.set("user_email", params.user_email);
  if (params.organization_id) qs.set("organization_id", params.organization_id);
  return apiFetch<HistoryResponse>(`/api/history?${qs.toString()}`);
}

export function fetchSuggestions(field: SuggestionField): Promise<SuggestionsResponse> {
  const qs = new URLSearchParams({ field });
  return apiFetch<SuggestionsResponse>(`/api/history/suggestions?${qs.toString()}`);
}
