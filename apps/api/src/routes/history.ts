import type { FastifyInstance } from "fastify";
import { Type } from "contract";
import type { DbClient } from "../db";

export interface HistoryQueryParams {
  table: string;
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  user_email?: string;
  action_type?: number;
}

export interface HistoryQueryDescriptor {
  table: string;
  filters: Array<{ field: string; value: unknown }>;
  orderBy: { col: string; dir: "ASC" | "DESC" };
  limit: number;
  offset: number;
}

export function buildHistoryQuery(params: HistoryQueryParams): HistoryQueryDescriptor {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 10));
  const offset = (page - 1) * limit;

  const filters: Array<{ field: string; value: unknown }> = [];
  if (params.from) filters.push({ field: "timestamp_from", value: params.from });
  if (params.to) filters.push({ field: "timestamp_to", value: params.to });
  if (params.user_email) filters.push({ field: "user_email", value: params.user_email });
  if (params.action_type !== undefined)
    filters.push({ field: "action_type", value: params.action_type });

  return {
    table: params.table,
    filters,
    orderBy: { col: "started_at", dir: "DESC" },
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

const VALID_ACTION_TYPES = new Set(
  Object.values(Type).filter((v): v is number => typeof v === "number"),
);

export function historyRoute(fastify: FastifyInstance, db: DbClient) {
  fastify.get<{
    Querystring: {
      table?: string;
      page?: string;
      limit?: string;
      from?: string;
      to?: string;
      user_email?: string;
      action_type?: string;
    };
  }>("/api/history", async (req, reply) => {
    const { table, page, limit, from, to, user_email, action_type } = req.query;

    if (!table) {
      return reply.status(400).send({ error: "table param is required" });
    }

    let parsedActionType: number | undefined;
    if (action_type !== undefined) {
      parsedActionType = parseInt(action_type, 10);
      if (isNaN(parsedActionType) || !VALID_ACTION_TYPES.has(parsedActionType)) {
        return reply
          .status(400)
          .send({ error: "action_type must be a valid Type enum value (1, 2, or 3)" });
      }
    }

    try {
      validateIdentifier(table);
    } catch (e) {
      return reply.status(400).send({ error: (e as Error).message });
    }

    const q = buildHistoryQuery({
      table,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      from,
      to,
      user_email,
      action_type: parsedActionType,
    });

    const conditions: string[] = [];
    const params: unknown[] = [];

    for (const f of q.filters) {
      if (f.field === "timestamp_from") {
        params.push(f.value);
        conditions.push(`MIN(created_at) >= $${params.length}`);
      } else if (f.field === "timestamp_to") {
        params.push(f.value);
        conditions.push(`MIN(created_at) <= $${params.length}`);
      } else if (f.field === "user_email") {
        params.push(f.value);
        conditions.push(`user_email ILIKE $${params.length}`);
      } else if (f.field === "action_type") {
        params.push(f.value);
        conditions.push(`action_type = $${params.length}`);
      }
    }

    const havingClause = conditions.length > 0 ? `HAVING ${conditions.join(" AND ")}` : "";
    const dataParams = [...params, q.limit, q.offset];

    // ContractHeaderEntity = 1
    const dataSql = `
      SELECT
        correlation_id,
        MAX(user_email) AS user_email,
        MAX(action_type)::int AS action_type,
        MAX(CASE WHEN entity_type = 1 THEN contract_number ELSE NULL END) AS contract_number,
        MIN(created_at) AS started_at,
        EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)) * 1000)::int AS duration_ms,
        COUNT(*)::int AS entity_count,
        array_agg(DISTINCT entity_type::int) AS entity_types
      FROM "${table}"
      GROUP BY correlation_id
      ${havingClause}
      ORDER BY started_at DESC
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
    `;

    const countSql = `
      SELECT COUNT(*)::text AS count
      FROM (
        SELECT correlation_id
        FROM "${table}"
        GROUP BY correlation_id
        ${havingClause}
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
}
