export type { LogRow, LogsResponse } from "contract";
export { Type, TypeLabels, TypeOptions, EntityType, EntityTypeLabels } from "contract";
import { Type, TypeLabels, EntityType, EntityTypeLabels } from "contract";

export function resolveActionLabel(value: number | string): string {
  return TypeLabels[Number(value) as Type] ?? String(value);
}

export function resolveModuleLabel(value: number | string): string {
  return EntityTypeLabels[Number(value) as EntityType] ?? String(value);
}
