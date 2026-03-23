export type { HistoryEntry, HistoryResponse } from "contract";

export function parseContractId(raw: string | null): string {
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed["Id"] ?? parsed["id"] ?? raw;
  } catch {
    return raw;
  }
}
