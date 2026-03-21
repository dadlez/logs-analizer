import { useQuery } from "@tanstack/react-query";
import {
  fetchModules,
  fetchEventTypes,
  fetchFlows,
  fetchCooccurrence,
  fetchCascade,
} from "./api.ts";

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

export function useCooccurrenceQuery(table: string) {
  return useQuery({
    queryKey: ["analytics", "cooccurrence", table],
    queryFn: () => fetchCooccurrence(table),
    enabled: !!table,
  });
}

export function useCascadeQuery(table: string) {
  return useQuery({
    queryKey: ["analytics", "cascade", table],
    queryFn: () => fetchCascade(table),
    enabled: !!table,
  });
}
