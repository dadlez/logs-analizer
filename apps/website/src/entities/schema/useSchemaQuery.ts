import { useQuery } from "@tanstack/react-query";
import { fetchSchema } from "./api.ts";

export function useSchemaQuery() {
  return useQuery({
    queryKey: ["schema"],
    queryFn: fetchSchema,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
