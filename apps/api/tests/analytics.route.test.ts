import { expect, test, describe, vi, beforeEach } from "vitest";
import { buildApp } from "../src/app";

import type {DbClient} from "../src/db";

describe("GET /api/analytics", () => {
  let mockDb: DbClient;

  beforeEach(() => {
    const fn = vi.fn();
    fn.mockResolvedValue([]);
    fn.unsafe = vi.fn().mockResolvedValue([]);
    mockDb = fn as unknown as DbClient;
  });

  test("should return 200 when GET /api/analytics/modules is called", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/analytics/modules?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
  });

  test("should return 200 when GET /api/analytics/flows is called", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/analytics/flows?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
  });

  test("should pass bucket param to db when bucket query param is provided", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({ method: "GET", url: "/api/analytics/timeline?table=audit_log&bucket=day" });

    // then
    const calls = (mockDb.unsafe as ReturnType<typeof vi.fn>).mock.calls as [string, unknown[]][];
    expect(calls.some(([, params]) => Array.isArray(params) && params.includes("day"))).toBe(true);
  });
});
