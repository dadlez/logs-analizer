import { useQuery } from "@tanstack/react-query";
import { fetchModules, fetchEventTypes, fetchFlows } from "./api.ts";

export function useModulesQuery(table: string) {
  return useQuery({
    queryKey: ["analytics", "modules", table],
    queryFn: () => fetchModules(table),
    enabled: !!table,
  });
}

export function useEventTypesQuery(table: string) {
  return useQuery({
    queryKey: ["analytics", "event-types", table],
    queryFn: () => fetchEventTypes(table),
    enabled: !!table,
  });
}

export function useFlowsQuery(table: string) {
  return useQuery({
    queryKey: ["analytics", "flows", table],
    queryFn: () => fetchFlows(table),
    enabled: !!table,
  });
}
