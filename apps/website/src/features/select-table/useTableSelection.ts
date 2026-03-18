import { useSearch, useNavigate } from "@tanstack/react-router";

export function useTableSelection() {
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const navigate = useNavigate();
  const table = (search["table"] as string | undefined) ?? "";

  function setTable(value: string) {
    void navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, table: value }),
      replace: true,
    } as Parameters<typeof navigate>[0]);
  }

  return { table, setTable };
}
