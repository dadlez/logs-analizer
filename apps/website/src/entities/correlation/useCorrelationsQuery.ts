import { useQuery } from "@tanstack/react-query";
import { fetchCorrelations, type CorrelationsParams } from "./api.ts";

export function useCorrelationsQuery(params: CorrelationsParams) {
  return useQuery({
    queryKey: ["correlations", params],
    queryFn: () => fetchCorrelations(params),
    enabled: !!params.table,
  });
}
