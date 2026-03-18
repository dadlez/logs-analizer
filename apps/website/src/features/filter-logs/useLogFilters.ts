import { useSearch, useNavigate } from "@tanstack/react-router";

export interface LogFilters {
  module: string;
  event_type: string;
  correlation_id: string;
  from: string;
  to: string;
  search: string;
  page: number;
  sort_col: string;
  sort_dir: "asc" | "desc";
}

export function useLogFilters() {
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();

  const filters: LogFilters = {
    module: (search["module"] as string) ?? "",
    event_type: (search["event_type"] as string) ?? "",
    correlation_id: (search["correlation_id"] as string) ?? "",
    from: (search["from"] as string) ?? "",
    to: (search["to"] as string) ?? "",
    search: (search["search"] as string) ?? "",
    page: Number(search["page"] ?? 1),
    sort_col: (search["sort_col"] as string) ?? "",
    sort_dir: ((search["sort_dir"] as string) ?? "desc") as "asc" | "desc",
  };

  function setFilters(partial: Partial<LogFilters>) {
    void navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, ...partial, page: 1 }),
      replace: true,
    } as Parameters<typeof navigate>[0]);
  }

  function setPage(page: number) {
    void navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, page }),
      replace: true,
    } as Parameters<typeof navigate>[0]);
  }

  function clearFilters() {
    void navigate({
      search: (prev: Record<string, unknown>) => ({
        table: prev["table"],
        page: 1,
      }),
      replace: true,
    } as Parameters<typeof navigate>[0]);
  }

  return { filters, setFilters, setPage, clearFilters };
}
