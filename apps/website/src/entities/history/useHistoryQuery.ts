import { useQuery } from "@tanstack/react-query";
import { fetchHistory, type HistoryParams } from "./api.ts";

export function useHistoryQuery(params: HistoryParams) {
  return useQuery({
    queryKey: ["history", params],
    queryFn: () => fetchHistory(params),
    enabled: !!params.table,
  });
}
