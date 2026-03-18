import { expect, test, describe, vi, beforeEach } from "vitest";
import { buildApp } from "../src/app";

import type {DbClient} from "../src/db";

describe("GET /api/history", () => {
  let mockDb: DbClient;

  beforeEach(() => {
    const fn = vi.fn();
    fn.mockResolvedValue([]);
    fn.unsafe = vi.fn().mockResolvedValue([]);
    mockDb = fn as unknown as DbClient;
  });

  test("should return 200 with data array when GET /api/history is called", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/history?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ data: unknown[] }>();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("should pass action_type filter to db when action_type query param is provided", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({ method: "GET", url: "/api/history?table=audit_log&action_type=3" });

    // then
    const calls = (mockDb.unsafe as ReturnType<typeof vi.fn>).mock.calls as [string, unknown[]][];
    expect(calls.some(([, params]) => Array.isArray(params) && params.includes(3))).toBe(true);
  });

  test("should pass user_email filter to db when user_email query param is provided", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({ method: "GET", url: "/api/history?table=audit_log&user_email=test@example.com" });

    // then
    const calls = (mockDb.unsafe as ReturnType<typeof vi.fn>).mock.calls as [string, unknown[]][];
    expect(calls.some(([, params]) => Array.isArray(params) && params.includes("test@example.com"))).toBe(true);
  });

  test("should return 400 when action_type param is not a valid Type enum value", async () => {
    // given
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/history?table=audit_log&action_type=99" });

    // then
    expect(res.statusCode).toBe(400);
    expect(mockDb.unsafe).not.toHaveBeenCalled();
  });
});
