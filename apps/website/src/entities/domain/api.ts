import { apiFetch } from "../../shared/api/client.ts";
import type { ModuleAnalytics, EventTypeAnalytics, FlowAnalytics } from "contract";

export function fetchModules(table: string): Promise<ModuleAnalytics[]> {
  return apiFetch<ModuleAnalytics[]>(`/api/analytics/modules?table=${encodeURIComponent(table)}`);
}

export function fetchEventTypes(table: string): Promise<EventTypeAnalytics[]> {
  return apiFetch<EventTypeAnalytics[]>(
    `/api/analytics/event-types?table=${encodeURIComponent(table)}`,
  );
}

export function fetchFlows(table: string): Promise<FlowAnalytics[]> {
  return apiFetch<FlowAnalytics[]>(`/api/analytics/flows?table=${encodeURIComponent(table)}`);
}
