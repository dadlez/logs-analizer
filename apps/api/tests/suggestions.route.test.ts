import { expect, test, describe, beforeEach } from "vite-plus/test";
import { buildApp } from "../src/app";
import { createMockDb, type MockDb } from "../test-utils/createMockDb";

describe("GET /api/history/suggestions", () => {
  let mockDb: MockDb;

  beforeEach(() => {
    mockDb = createMockDb();
  });

  test("should return 400 when field param is missing", async () => {
    // given
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({ method: "GET", url: "/api/history/suggestions?q=foo" });

    // then
    expect(res.statusCode).toBe(400);
    expect(mockDb.unsafe).not.toHaveBeenCalled();
  });

  test("should return 400 when field value is not an allowed suggestion field", async () => {
    // given
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({
      method: "GET",
      url: "/api/history/suggestions?field=not_a_valid_field",
    });

    // then
    expect(res.statusCode).toBe(400);
    expect(mockDb.unsafe).not.toHaveBeenCalled();
  });

  test("should return 200 with data array when field=user_email", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([{ user_email: "test@example.com" }]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({
      method: "GET",
      url: "/api/history/suggestions?field=user_email",
    });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ data: string[] }>();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("should return 200 with data array when field=organization_id", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([{ organization_id: "org-001" }]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({
      method: "GET",
      url: "/api/history/suggestions?field=organization_id",
    });

    // then
    expect(res.statusCode).toBe(200);
    const body = res.json<{ data: string[] }>();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("should query db for distinct values when valid field is provided", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([{ user_email: "alice@example.com" }]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    await app.inject({
      method: "GET",
      url: "/api/history/suggestions?field=user_email",
    });

    // then
    expect(mockDb.unsafe).toHaveBeenCalledOnce();
  });

  test("should return mapped field values as data array when db returns rows", async () => {
    // given
    mockDb.unsafe.mockResolvedValue([
      { user_email: "alice@example.com" },
      { user_email: "bob@example.com" },
    ]);
    const app = buildApp({ db: mockDb, nodeEnv: "test" });

    // when
    const res = await app.inject({
      method: "GET",
      url: "/api/history/suggestions?field=user_email",
    });

    // then
    const body = res.json<{ data: string[] }>();
    expect(body.data).toEqual(["alice@example.com", "bob@example.com"]);
  });
});
