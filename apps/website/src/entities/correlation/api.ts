import { apiFetch } from "../../shared/api/index.ts";
import type { CorrelationsResponse, CorrelationDetailResponse } from "contract";

export interface CorrelationsParams {
  table: string;
  page?: number;
  limit?: number;
  module?: string;
  from?: string;
  to?: string;
}

export function fetchCorrelations(params: CorrelationsParams): Promise<CorrelationsResponse> {
  const qs = new URLSearchParams();
  qs.set("table", params.table);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.module) qs.set("module", params.module);
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  return apiFetch<CorrelationsResponse>(`/api/correlations?${qs.toString()}`);
}

export function fetchCorrelationDetail(
  id: string,
  table: string,
): Promise<CorrelationDetailResponse> {
  return apiFetch<CorrelationDetailResponse>(
    `/api/correlations/${encodeURIComponent(id)}?table=${encodeURIComponent(table)}`,
  );
}
