import { expect, test, describe, beforeEach } from "vite-plus/test";
import { buildApp } from "../src/app";

import { createMockDb, type MockDb } from "../test-utils/createMockDb";

describe("GET /api/correlations", () => {
  let mockDb: MockDb;

  beforeEach(() => {
    mockDb = createMockDb();
  });

  test("should return 200 with correlation list when GET /api/correlations is called", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
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
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({
      method: "GET",
      url: "/api/correlations/test-id-123?table=audit_log",
    });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ events: unknown[] }>();
    expect(Array.isArray(body.events)).toBe(true);
  });

  test("should pass id to db when correlation id is in path params", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({ method: "GET", url: "/api/correlations/my-corr-id?table=audit_log" });

    // then
    const calls = mockDb.unsafe.mock.calls as [string, unknown[]][];
    expect(calls.some(([, params]) => Array.isArray(params) && params.includes("my-corr-id"))).toBe(
      true,
    );
  });
});
