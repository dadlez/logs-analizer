import { expect, test, describe } from "vite-plus/test";
import { buildCorrelationsQuery } from "../src/routes/correlations";

describe("buildCorrelationsQuery", () => {
  test("should group by correlation_id when query is built", () => {
    // given
    const params = { table: "audit_log" };

    // when
    const query = buildCorrelationsQuery(params);

    // then
    expect(query.groupBy).toBe("correlation_id");
  });

  test("should include module filter when module param is provided", () => {
    // given
    const params = { table: "audit_log", module: "contracts" };

    // when
    const query = buildCorrelationsQuery(params);

    // then
    expect(query.filters).toContainEqual({ field: "entity_type", value: "contracts" });
  });
});
