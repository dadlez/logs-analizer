import type { CooccurrenceEntry } from "../../entities/domain/index.ts";

export function getCooccurrenceCount(entries: CooccurrenceEntry[], a: number, b: number): number {
  if (a === b) return 0;
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return entries.find((e) => e.module_a === lo && e.module_b === hi)?.count ?? 0;
}

export function computeCouplingPercentage(count: number, denominator: number): number {
  if (denominator === 0) return 0;
  return (count / denominator) * 100;
}

export function formatCouplingTooltip(
  row: string,
  col: string,
  count: number,
  denominator: number,
): string {
  const pct = Math.round(computeCouplingPercentage(count, denominator));
  return `${row} → ${col}: ${count} / ${denominator} correlations (${pct}%)`;
}

export function getPercentageValue(
  rowModule: number | undefined,
  colModule: number | undefined,
  entries: CooccurrenceEntry[] | undefined,
  uniqueCorrelationsMap: Map<number, number>,
): number {
  if (rowModule === undefined || colModule === undefined || !entries) return 0;
  const denominator = uniqueCorrelationsMap.get(rowModule) ?? 0;
  return computeCouplingPercentage(
    getCooccurrenceCount(entries, rowModule, colModule),
    denominator,
  );
}

export function getPercentageTooltip(
  row: string,
  col: string,
  rowModule: number | undefined,
  colModule: number | undefined,
  entries: CooccurrenceEntry[] | undefined,
  uniqueCorrelationsMap: Map<number, number>,
): string {
  if (rowModule === undefined || colModule === undefined || !entries) return "";
  const count = getCooccurrenceCount(entries, rowModule, colModule);
  if (count === 0) return "";
  const denominator = uniqueCorrelationsMap.get(rowModule) ?? 0;
  if (denominator === 0) return "";
  return formatCouplingTooltip(row, col, count, denominator);
}
