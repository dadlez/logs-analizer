import { expect, test, describe } from "vitest";
import { buildSchemaQuery } from "../src/routes/schema";

describe("buildSchemaQuery", () => {
  test("should return query targeting information_schema when called", () => {
    // given / when
    const query = buildSchemaQuery();

    // then
    expect(query.tables.schema).toBe("public");
  });

  test("should exclude pg_catalog and information_schema tables", () => {
    // given / when
    const query = buildSchemaQuery();

    // then
    expect(query.excludeSchemas).toContain("pg_catalog");
    expect(query.excludeSchemas).toContain("information_schema");
  });
});
