import { apiFetch } from "../../shared/api/index.ts";
import type { SchemaTable } from "contract";

export function fetchSchema(): Promise<SchemaTable[]> {
  return apiFetch<SchemaTable[]>("/api/schema");
}
