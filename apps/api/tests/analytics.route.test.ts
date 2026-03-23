import { expect, test, describe, beforeEach } from "vite-plus/test";
import { buildApp } from "../src/app";

import { createMockDb, type MockDb } from "../test-utils/createMockDb";

describe("GET /api/analytics", () => {
  let mockDb: MockDb;

  beforeEach(() => {
    mockDb = createMockDb();
  });

  test("should return 200 when GET /api/analytics/modules is called", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/analytics/modules?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
  });

  test("should return 200 when GET /api/analytics/flows is called", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/analytics/flows?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
  });

  test("should return 200 when GET /api/analytics/cooccurrence is called", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/cooccurrence?table=audit_log",
    });

    // then
    expect(res.statusCode).toBe(200);
  });

  test("should return 200 when GET /api/analytics/cascade is called", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/cascade?table=audit_log",
    });

    // then
    expect(res.statusCode).toBe(200);
  });

  test("should pass bucket param to db when bucket query param is provided", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({ method: "GET", url: "/api/analytics/timeline?table=audit_log&bucket=day" });

    // then
    const calls = mockDb.unsafe.mock.calls as [string, unknown[]][];
    expect(calls.some(([, params]) => Array.isArray(params) && params.includes("day"))).toBe(true);
  });

  test("should return 200 when GET /api/analytics/event-types is called", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({
      method: "GET",
      url: "/api/analytics/event-types?table=audit_log",
    });

    // then
    expect(res.statusCode).toBe(200);
  });

  test("should return 400 when table param is missing from analytics endpoint", async () => {
    // given
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/analytics/modules" });

    // then
    expect(res.statusCode).toBe(400);
    expect(mockDb.unsafe).not.toHaveBeenCalled();
  });
});
