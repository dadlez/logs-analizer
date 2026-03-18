import { expect, test, describe, vi } from "vitest";
import { buildApp } from "../src/app";

describe("GET /health", () => {
  test("should return 200 with status ok when service is running", async () => {
    // given
    const mockDb = vi.fn().mockResolvedValue([{ "?column?": 1 }]) as unknown as Parameters<typeof buildApp>[0]["db"];
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/health" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ status: string; database?: string }>();
    expect(body.status).toBe("ok");
  });

  test("should return database ok when db connection succeeds", async () => {
    // given
    const mockDb = vi.fn().mockResolvedValue([{ "?column?": 1 }]) as unknown as Parameters<typeof buildApp>[0]["db"];
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/health" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ status: string; database: string }>();
    expect(body.database).toBe("ok");
  });

  test("should return database error when db connection fails", async () => {
    // given
    const mockDb = vi.fn().mockRejectedValue(new Error("connection refused")) as unknown as Parameters<typeof buildApp>[0]["db"];
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/health" });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ status: string; database: string }>();
    expect(body.database).toBe("error");
  });
});
