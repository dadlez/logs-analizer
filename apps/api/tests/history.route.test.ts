import { expect, test, describe, beforeEach } from "vite-plus/test";
import { buildApp } from "../src/app";

import { createMockDb, type MockDb } from "../test-utils/createMockDb";

describe("GET /api/history", () => {
  let mockDb: MockDb;

  beforeEach(() => {
    mockDb = createMockDb();
  });

  test("should return 200 with data array when GET /api/history is called", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/history?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ data: unknown[] }>();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("should pass user_email filter to db when user_email query param is provided", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({
      method: "GET",
      url: "/api/history?table=audit_log&user_email=test@example.com",
    });

    // then
    const calls = mockDb.unsafe.mock.calls as [string, unknown[]][];
    expect(
      calls.some(([, params]) => Array.isArray(params) && params.includes("test@example.com")),
    ).toBe(true);
  });

  test("should pass organization_id filter to db when organization_id query param is provided", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({
      method: "GET",
      url: "/api/history?table=audit_log&organization_id=org-123",
    });

    // then
    const calls = mockDb.unsafe.mock.calls as [string, unknown[]][];
    expect(calls.some(([, params]) => Array.isArray(params) && params.includes("org-123"))).toBe(
      true,
    );
  });

  test("should pass from and to params to db when date range is provided", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({
      method: "GET",
      url: "/api/history?table=audit_log&from=2026-01-01&to=2026-01-31",
    });

    // then
    const calls = mockDb.unsafe.mock.calls as [string, unknown[]][];
    const allParams = calls.flatMap(([, params]) => (Array.isArray(params) ? params : []));
    expect(allParams).toContain("2026-01-01");
    expect(allParams).toContain("2026-01-31");
  });
});
