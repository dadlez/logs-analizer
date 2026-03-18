import type { FastifyInstance } from "fastify";

import type { DbClient } from "../db";

export interface LogsQueryParams {
  table: string;
  page?: number;
  limit?: number;
  module?: string;
  event_type?: string;
  correlation_id?: string;
  from?: string;
  to?: string;
  search?: string;
  sort_col?: string;
  sort_dir?: "asc" | "desc";
}

export interface FilterField {
  field: string;
  value: unknown;
}

export interface LogsQueryDescriptor {
  table: string;
  filters: FilterField[];
  search?: string;
  orderBy: { col: string; dir: "ASC" | "DESC" };
  limit: number;
  offset: number;
}

export function buildLogsQuery(params: LogsQueryParams): LogsQueryDescriptor {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 50));
  const offset = (page - 1) * limit;
  const sortDir: "ASC" | "DESC" = params.sort_dir?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  const sortCol = params.sort_col ?? "id";

  const filters: FilterField[] = [];
  if (params.module) filters.push({ field: "module", value: params.module });
  if (params.event_type) filters.push({ field: "event_type", value: params.event_type });
  if (params.correlation_id)
    filters.push({ field: "correlation_id", value: params.correlation_id });
  if (params.from) filters.push({ field: "timestamp_from", value: params.from });
  if (params.to) filters.push({ field: "timestamp_to", value: params.to });

  return {
    table: params.table,
    filters,
    search: params.search,
    orderBy: { col: sortCol, dir: sortDir },
    limit,
    offset,
  };
}

const SAFE_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function validateIdentifier(name: string): void {
  if (!SAFE_IDENTIFIER.test(name)) {
    throw new Error(`Invalid identifier: ${name}`);
  }
}

function buildSqlParts(q: LogsQueryDescriptor): { whereClause: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  for (const f of q.filters) {
    if (f.field === "timestamp_from") {
      params.push(f.value);
      conditions.push(`created_at >= $${params.length}`);
    } else if (f.field === "timestamp_to") {
      params.push(f.value);
      conditions.push(`created_at <= $${params.length}`);
    } else {
      params.push(f.value);
      conditions.push(`"${f.field}" = $${params.length}`);
    }
  }

  if (q.search) {
    params.push(`%${q.search}%`);
    const n = params.length;
    conditions.push(
      `("module" ILIKE $${n} OR "event_type"::text ILIKE $${n} OR "correlation_id"::text ILIKE $${n})`,
    );
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params,
  };
}

export function logsRoute(fastify: FastifyInstance, db: DbClient) {
  fastify.get<{
    Querystring: {
      table?: string;
      page?: string;
      limit?: string;
      module?: string;
      event_type?: string;
      correlation_id?: string;
      from?: string;
      to?: string;
      search?: string;
      sort_col?: string;
      sort_dir?: string;
    };
  }>("/api/logs", async (req, reply) => {
    const {
      table,
      page,
      limit,
      module,
      event_type,
      correlation_id,
      from,
      to,
      search,
      sort_col,
      sort_dir,
    } = req.query;

    if (!table) {
      return reply.status(400).send({ error: "table param is required" });
    }

    try {
      validateIdentifier(table);
      if (sort_col) validateIdentifier(sort_col);
    } catch (e) {
      return reply.status(400).send({ error: (e as Error).message });
    }

    const q = buildLogsQuery({
      table,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      module,
      event_type,
      correlation_id,
      from,
      to,
      search,
      sort_col,
      sort_dir: sort_dir as "asc" | "desc" | undefined,
    });

    const { whereClause, params } = buildSqlParts(q);

    const dataParams = [...params, q.limit, q.offset];
    const dataSql = `SELECT * FROM "${q.table}" ${whereClause} ORDER BY "${q.orderBy.col}" ${q.orderBy.dir} LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`;

    const countSql = `SELECT COUNT(*)::text as count FROM "${q.table}" ${whereClause}`;

    const [rows, countResult] = await Promise.all([
      db.unsafe(dataSql, dataParams as string[]) as Promise<Record<string, unknown>[]>,
      db.unsafe(countSql, params as string[]) as Promise<{ count: string }[]>,
    ]);

    return reply.send({
      data: rows,
      total: parseInt(countResult[0]?.count ?? "0", 10),
      page: Math.floor(q.offset / q.limit) + 1,
      limit: q.limit,
    });
  });
}
