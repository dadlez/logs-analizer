import { useQuery } from "@tanstack/react-query";
import { fetchCorrelationDetail } from "./api.ts";

export function useCorrelationDetailQuery(id: string, table: string) {
  return useQuery({
    queryKey: ["correlation-detail", id, table],
    queryFn: () => fetchCorrelationDetail(id, table),
    enabled: !!id && !!table,
  });
}
