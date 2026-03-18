import { expect, test, describe, vi, beforeEach } from "vitest";
import { buildApp } from "../src/app";

import type {DbClient} from "../src/db";

describe("GET /api/correlations", () => {
  let mockDb: DbClient;

  beforeEach(() => {
    const fn = vi.fn();
    fn.mockResolvedValue([]);
    fn.unsafe = vi.fn().mockResolvedValue([]);
    mockDb = fn as unknown as DbClient;
  });

  test("should return 200 with correlation list when GET /api/correlations is called", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/correlations?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ data: unknown[] }>();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("should return 200 with event array when GET /api/correlations/:id is called", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/correlations/test-id-123?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ events: unknown[] }>();
    expect(Array.isArray(body.events)).toBe(true);
  });

  test("should pass id to db when correlation id is in path params", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({ method: "GET", url: "/api/correlations/my-corr-id?table=audit_log" });

    // then
    const calls = (mockDb.unsafe as ReturnType<typeof vi.fn>).mock.calls as [string, unknown[]][];
    expect(calls.some(([, params]) => Array.isArray(params) && params.includes("my-corr-id"))).toBe(true);
  });
});
