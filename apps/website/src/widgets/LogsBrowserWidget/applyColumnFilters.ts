export function applyColumnFilters(
  rows: Record<string, unknown>[],
  columnFilters: Record<string, string>,
): Record<string, unknown>[] {
  const active = Object.entries(columnFilters).filter(([, v]) => v.length > 0);
  if (active.length === 0) return rows;
  return rows.filter((row) =>
    active.every(([col, val]) =>
      (typeof row[col] === "object"
        ? JSON.stringify(row[col])
        : String((row[col] ?? "") as string | number | boolean | bigint | symbol)
      )
        .toLowerCase()
        .includes(val.toLowerCase()),
    ),
  );
}
