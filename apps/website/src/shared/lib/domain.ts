import { TypeLabels, EntityTypeLabels } from "contract";
import type { Type, EntityType } from "contract";
import type { Theme } from "@mui/material/styles";

type Colors = Theme["palette"]["colors"];

export function resolveActionLabel(value: number | string): string {
  return TypeLabels[Number(value) as Type] ?? String(value);
}

export function resolveModuleLabel(value: number | string): string {
  return EntityTypeLabels[Number(value) as EntityType] ?? String(value);
}

const MODULE_COLOR_MAP: Record<string, keyof Colors> = {
  "Contract Header": "navy",
  "Annex Header": "purple",
  "Annex Change": "cyan",
  File: "mint",
  Invoice: "orange",
  "Payment Schedule": "amber",
  "Contract Funding": "blue",
  Unknown: "slate",
};

const EVENT_COLOR_MAP: Record<string, keyof Colors> = {
  Added: "mint",
  Modified: "orange",
  Deleted: "red",
};

export function resolveModuleColor(label: string, colors: Colors): string {
  const key = MODULE_COLOR_MAP[label];
  return key ? colors[key] : colors.slate;
}

export function resolveEventColor(label: string, colors: Colors): string {
  const key = EVENT_COLOR_MAP[label];
  return key ? colors[key] : colors.slate;
}
