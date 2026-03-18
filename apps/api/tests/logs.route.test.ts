import { expect, test, describe, vi, beforeEach } from "vite-plus/test";
import { buildApp } from "../src/app";

import type { DbClient } from "../src/db";

describe("GET /api/logs", () => {
  let mockDb: DbClient;

  beforeEach(() => {
    const fn = vi.fn();
    fn.mockResolvedValue([]);
    fn.unsafe = vi.fn().mockResolvedValue([]);
    mockDb = fn as unknown as DbClient;
  });

  test("should return 200 with data array when GET /api/logs is called", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/logs?table=audit_log" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ data: unknown[] }>();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("should pass module filter to db when module query param is provided", async () => {
    // given
    (mockDb.unsafe as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({ method: "GET", url: "/api/logs?table=audit_log&module=contracts" });

    // then
    const calls = (mockDb.unsafe as ReturnType<typeof vi.fn>).mock.calls as [string, unknown[]][];
    const dataCall = calls.find(([sql]) => sql.includes("SELECT * FROM"));
    expect(dataCall).toBeDefined();
    expect(dataCall![0]).toContain("module");
  });

  test("should return 400 when table param is missing", async () => {
    // given
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/logs" });

    // then
    expect(res.statusCode).toBe(400);
    expect(mockDb.unsafe as ReturnType<typeof vi.fn>).not.toHaveBeenCalled();
  });
});
