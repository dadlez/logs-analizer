import { expect, test, describe } from "vite-plus/test";
import { buildHistoryQuery } from "../src/routes/history";

describe("buildHistoryQuery", () => {
  test("should default to 10 results per page when limit is not specified", () => {
    // given
    const params = { table: "audit_log" };

    // when
    const query = buildHistoryQuery(params);

    // then
    expect(query.limit).toBe(10);
  });

  test("should sort by started_at descending when called", () => {
    // given
    const params = { table: "audit_log" };

    // when
    const query = buildHistoryQuery(params);

    // then
    expect(query.orderBy).toEqual({ col: "started_at", dir: "DESC" });
  });

  test("should include action_type filter when action_type param is provided", () => {
    // given
    const params = { table: "audit_log", action_type: 3 };

    // when
    const query = buildHistoryQuery(params);

    // then
    expect(query.filters).toContainEqual({ field: "action_type", value: 3 });
  });

  test("should calculate correct offset when page 2 is requested", () => {
    // given
    const params = { table: "audit_log", page: 2 };

    // when
    const query = buildHistoryQuery(params);

    // then
    expect(query.offset).toBe(10);
  });

  test("should include user_email filter when user_email param is provided", () => {
    // given
    const params = { table: "audit_log", user_email: "a@b.com" };

    // when
    const query = buildHistoryQuery(params);

    // then
    expect(query.filters).toContainEqual({ field: "user_email", value: "a@b.com" });
  });
});
