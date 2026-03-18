import { useQuery } from "@tanstack/react-query";
import { fetchLogs, type LogsParams } from "./api.ts";

export function useLogsQuery(params: LogsParams) {
  return useQuery({
    queryKey: ["logs", params],
    queryFn: () => fetchLogs(params),
    enabled: !!params.table,
  });
}
