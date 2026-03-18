import { expect, test, describe } from "vite-plus/test";
import { buildLogsQuery } from "../src/routes/logs";

describe("buildLogsQuery", () => {
  test("should include module filter when module param is provided", () => {
    // given
    const params = { table: "audit_log", module: "contracts" };

    // when
    const query = buildLogsQuery(params);

    // then
    expect(query.filters).toContainEqual({ field: "module", value: "contracts" });
  });

  test("should calculate correct offset when page param is provided", () => {
    // given
    const params = { table: "audit_log", page: 3, limit: 10 };

    // when
    const query = buildLogsQuery(params);

    // then
    expect(query.offset).toBe(20);
  });

  test("should sort descending by default when sort_dir is not specified", () => {
    // given
    const params = { table: "audit_log" };

    // when
    const query = buildLogsQuery(params);

    // then
    expect(query.orderBy.dir).toBe("DESC");
  });

  test("should include all active filters when multiple params are provided", () => {
    // given
    const params = {
      table: "audit_log",
      module: "contracts",
      event_type: "created",
      correlation_id: "abc-123",
    };

    // when
    const query = buildLogsQuery(params);

    // then
    expect(query.filters).toContainEqual({ field: "module", value: "contracts" });
    expect(query.filters).toContainEqual({ field: "event_type", value: "created" });
    expect(query.filters).toContainEqual({ field: "correlation_id", value: "abc-123" });
  });
});
