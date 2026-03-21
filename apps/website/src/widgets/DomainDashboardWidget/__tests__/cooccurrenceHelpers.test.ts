import { describe, it, expect } from "vite-plus/test";
import {
  getCooccurrenceCount,
  computeCouplingPercentage,
  formatCouplingTooltip,
  getPercentageValue,
  getPercentageTooltip,
} from "../cooccurrenceHelpers.ts";
import type { CooccurrenceEntry } from "../../../entities/domain/index.ts";

const entries: CooccurrenceEntry[] = [
  { module_a: 1, module_b: 4, count: 11 },
  { module_a: 1, module_b: 5, count: 18 },
];

describe("getCooccurrenceCount", () => {
  it("should return count for matching pair", () => {
    expect(getCooccurrenceCount(entries, 1, 4)).toBe(11);
  });

  it("should be symmetric (order of a/b does not matter)", () => {
    expect(getCooccurrenceCount(entries, 4, 1)).toBe(11);
  });

  it("should return 0 for diagonal (a === b)", () => {
    expect(getCooccurrenceCount(entries, 1, 1)).toBe(0);
  });

  it("should return 0 when pair is not found", () => {
    expect(getCooccurrenceCount(entries, 2, 3)).toBe(0);
  });
});

describe("computeCouplingPercentage", () => {
  it("should return the percentage of count over denominator", () => {
    expect(computeCouplingPercentage(11, 26)).toBeCloseTo(42.3, 1);
  });

  it("should return 100 when count equals denominator", () => {
    expect(computeCouplingPercentage(10, 10)).toBe(100);
  });

  it("should return 0 when count is 0", () => {
    expect(computeCouplingPercentage(0, 26)).toBe(0);
  });

  it("should return 0 when denominator is 0", () => {
    expect(computeCouplingPercentage(5, 0)).toBe(0);
  });

  it("should return > 100 when count exceeds denominator", () => {
    expect(computeCouplingPercentage(30, 26)).toBeGreaterThan(100);
  });
});

describe("formatCouplingTooltip", () => {
  it("should format tooltip with rounded percentage", () => {
    expect(formatCouplingTooltip("FileEntity", "InvoiceEntity", 11, 26)).toBe(
      "FileEntity → InvoiceEntity: 11 / 26 correlations (42%)",
    );
  });

  it("should round down correctly", () => {
    expect(formatCouplingTooltip("A", "B", 1, 3)).toBe("A → B: 1 / 3 correlations (33%)");
  });

  it("should round up correctly", () => {
    expect(formatCouplingTooltip("A", "B", 2, 3)).toBe("A → B: 2 / 3 correlations (67%)");
  });

  it("should show 100% when count equals denominator", () => {
    expect(formatCouplingTooltip("A", "B", 5, 5)).toBe("A → B: 5 / 5 correlations (100%)");
  });

  it("should show 0% for very small percentage that rounds down", () => {
    expect(formatCouplingTooltip("A", "B", 1, 1000)).toBe("A → B: 1 / 1000 correlations (0%)");
  });
});

describe("getPercentageValue", () => {
  const map = new Map([
    [1, 26],
    [4, 15],
  ]);

  it("should compute percentage for known modules", () => {
    expect(getPercentageValue(1, 4, entries, map)).toBeCloseTo(42.3, 1);
  });

  it("should return 0 when rowModule is undefined", () => {
    expect(getPercentageValue(undefined, 4, entries, map)).toBe(0);
  });

  it("should return 0 when colModule is undefined", () => {
    expect(getPercentageValue(1, undefined, entries, map)).toBe(0);
  });

  it("should return 0 when entries is undefined", () => {
    expect(getPercentageValue(1, 4, undefined, map)).toBe(0);
  });

  it("should return 0 when rowModule has no entry in the map", () => {
    expect(getPercentageValue(99, 4, entries, map)).toBe(0);
  });
});

describe("getPercentageTooltip", () => {
  const map = new Map([
    [1, 26],
    [4, 15],
  ]);

  it("should return formatted tooltip for known modules with count > 0", () => {
    expect(getPercentageTooltip("ContractHeader", "FileEntity", 1, 4, entries, map)).toBe(
      "ContractHeader → FileEntity: 11 / 26 correlations (42%)",
    );
  });

  it("should return empty string when rowModule is undefined", () => {
    expect(getPercentageTooltip("A", "B", undefined, 4, entries, map)).toBe("");
  });

  it("should return empty string when colModule is undefined", () => {
    expect(getPercentageTooltip("A", "B", 1, undefined, entries, map)).toBe("");
  });

  it("should return empty string when entries is undefined", () => {
    expect(getPercentageTooltip("A", "B", 1, 4, undefined, map)).toBe("");
  });

  it("should return empty string when count is 0", () => {
    expect(getPercentageTooltip("A", "B", 2, 3, entries, map)).toBe("");
  });

  it("should return empty string when denominator is not in map", () => {
    expect(getPercentageTooltip("A", "B", 99, 4, entries, map)).toBe("");
  });
});
