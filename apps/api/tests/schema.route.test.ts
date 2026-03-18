import { expect, test, describe, vi } from "vitest";
import { buildApp } from "../src/app";

describe("GET /api/schema", () => {
  test("should return 200 with tables array when GET /api/schema is called", async () => {
    // given
    const mockDb = vi.fn().mockResolvedValue([
      {
        table_name: "audit_log",
        column_name: "id",
        data_type: "integer",
        is_nullable: "NO",
        column_default: null,
        ordinal_position: 1,
        row_count: "100",
      },
    ]) as unknown as Parameters<typeof buildApp>[0]["db"];
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/schema" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<unknown[]>();
    expect(Array.isArray(body)).toBe(true);
  });

  test("should call db when route is invoked", async () => {
    // given
    const mockDb = vi.fn().mockResolvedValue([]) as unknown as Parameters<typeof buildApp>[0]["db"];
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({ method: "GET", url: "/api/schema" });

    // then
    expect(mockDb).toHaveBeenCalled();
  });
});
