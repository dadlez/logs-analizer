import type { FastifyInstance } from "fastify";

import type {DbClient} from "../db";

export interface SchemaQueryResult {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  ordinal_position: number;
  row_count: string;
}

export function buildSchemaQuery() {
  return {
    tables: { schema: "public" },
    excludeSchemas: ["pg_catalog", "information_schema"],
  };
}

export async function fetchSchema(db: DbClient) {
  const rows = await db<SchemaQueryResult[]>`
    SELECT
      c.table_name,
      c.column_name,
      c.data_type,
      c.is_nullable,
      c.column_default,
      c.ordinal_position,
      COALESCE(s.n_live_tup, 0)::text AS row_count
    FROM information_schema.columns c
    LEFT JOIN pg_stat_user_tables s ON s.relname = c.table_name
    WHERE c.table_schema = 'public'
    ORDER BY c.table_name, c.ordinal_position
  `;

  // Group by table
  const tableMap = new Map<
    string,
    {
      table_name: string;
      row_count: number;
      columns: Omit<SchemaQueryResult, "table_name" | "row_count">[];
    }
  >();

  for (const row of rows) {
    if (!tableMap.has(row.table_name)) {
      tableMap.set(row.table_name, {
        table_name: row.table_name,
        row_count: parseInt(row.row_count, 10),
        columns: [],
      });
    }
    const table = tableMap.get(row.table_name)!;
    table.columns.push({
      column_name: row.column_name,
      data_type: row.data_type,
      is_nullable: row.is_nullable,
      column_default: row.column_default,
      ordinal_position: row.ordinal_position,
    });
  }

  return Array.from(tableMap.values());
}

export function schemaRoute(fastify: FastifyInstance, db: DbClient) {
  fastify.get("/api/schema", async (_req, reply) => {
    const tables = await fetchSchema(db);
    return reply.send(tables);
  });
}
