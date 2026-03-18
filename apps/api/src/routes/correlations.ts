import type { FastifyInstance } from "fastify";

import type {DbClient} from "../db";

export interface CorrelationsQueryParams {
  table: string;
  page?: number;
  limit?: number;
  module?: string;
  from?: string;
  to?: string;
}

export interface CorrelationsQueryDescriptor {
  table: string;
  filters: Array<{ field: string; value: unknown }>;
  orderBy: { col: string; dir: "ASC" | "DESC" };
  limit: number;
  offset: number;
  groupBy: string;
}

export function buildCorrelationsQuery(params: CorrelationsQueryParams): CorrelationsQueryDescriptor {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const offset = (page - 1) * limit;

  const filters: Array<{ field: string; value: unknown }> = [];
  if (params.module) filters.push({ field: "module", value: params.module });
  if (params.from) filters.push({ field: "timestamp_from", value: params.from });
  if (params.to) filters.push({ field: "timestamp_to", value: params.to });

  return {
    table: params.table,
    filters,
    orderBy: { col: "started_at", dir: "DESC" },
    limit,
    offset,
    groupBy: "correlation_id",
  };
}

export interface CorrelationDetailQueryDescriptor {
  table: string;
  correlationId: string;
}

export function buildCorrelationDetailQuery(params: { table: string; correlationId: string }): CorrelationDetailQueryDescriptor {
  return {
    table: params.table,
    correlationId: params.correlationId,
  };
}

const SAFE_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function validateIdentifier(name: string): void {
  if (!SAFE_IDENTIFIER.test(name)) {
    throw new Error(`Invalid identifier: ${name}`);
  }
}

export function correlationsRoute(fastify: FastifyInstance, db: DbClient) {
  fastify.get<{
    Querystring: { table?: string; page?: string; limit?: string; module?: string; from?: string; to?: string };
  }>("/api/correlations", async (req, reply) => {
    const { table, page, limit, module, from, to } = req.query;

    if (!table) {
      return reply.status(400).send({ error: "table param is required" });
    }

    try {
      validateIdentifier(table);
    } catch (e) {
      return reply.status(400).send({ error: (e as Error).message });
    }

    const q = buildCorrelationsQuery({
      table,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      module,
      from,
      to,
    });

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

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const dataParams = [...params, q.limit, q.offset];
    const dataSql = `
      SELECT
        correlation_id,
        COUNT(*)::int AS event_count,
        array_agg(DISTINCT module) FILTER (WHERE module IS NOT NULL) AS modules,
        MIN(created_at) AS started_at,
        MAX(created_at) AS ended_at,
        EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)) * 1000)::int AS duration_ms
      FROM "${q.table}"
      ${whereClause}
      GROUP BY correlation_id
      ORDER BY started_at DESC
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
    `;

    const countSql = `
      SELECT COUNT(*)::text AS count
      FROM (
        SELECT correlation_id FROM "${q.table}" ${whereClause} GROUP BY correlation_id
      ) subq
    `;

    const [rows, countResult] = await Promise.all([
      db.unsafe(dataSql, dataParams as string[]),
      db.unsafe(countSql, params as string[]) as Promise<{ count: string }[]>,
    ]);

    return reply.send({
      data: rows,
      total: parseInt(countResult[0]?.count ?? "0", 10),
      page: Math.floor(q.offset / q.limit) + 1,
      limit: q.limit,
    });
  });

  fastify.get<{
    Params: { id: string };
    Querystring: { table?: string };
  }>("/api/correlations/:id", async (req, reply) => {
    const { id } = req.params;
    const { table } = req.query;

    if (!table) {
      return reply.status(400).send({ error: "table param is required" });
    }

    try {
      validateIdentifier(table);
    } catch (e) {
      return reply.status(400).send({ error: (e as Error).message });
    }

    const events = await db.unsafe(`SELECT * FROM "${table}" WHERE correlation_id = $1 ORDER BY created_at ASC`, [id]);

    const modules = [...new Set((events as Record<string, unknown>[]).map((e) => e["module"]).filter(Boolean))] as string[];
    const eventTypes = [...new Set((events as Record<string, unknown>[]).map((e) => e["event_type"]).filter(Boolean))] as string[];
    const flow = (events as Record<string, unknown>[]).map((e) => String(e["event_type"] ?? "")).filter(Boolean);

    return reply.send({
      correlation_id: id,
      events,
      modules,
      event_types: eventTypes,
      flow,
    });
  });
}
