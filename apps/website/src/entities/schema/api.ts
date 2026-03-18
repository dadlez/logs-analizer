import { apiFetch } from "../../shared/api/client.ts";
import type { SchemaTable } from "contract";

export function fetchSchema(): Promise<SchemaTable[]> {
  return apiFetch<SchemaTable[]>("/api/schema");
}
