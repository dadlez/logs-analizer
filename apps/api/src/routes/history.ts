import type { FastifyInstance } from "fastify";
import type { DbClient } from "../db";
import { validateIdentifier } from "../utils";

export interface HistoryQueryParams {
  table: string;
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
  user_email?: string;
  organization_id?: string;
}

export interface HistoryQueryDescriptor {
  table: string;
  whereFilters: Array<{ field: string; value: unknown }>;
  havingFilters: Array<{ field: string; value: unknown }>;
  orderBy: { col: string; dir: "ASC" | "DESC" };
  limit: number;
  offset: number;
}

export function buildHistoryQuery(params: HistoryQueryParams): HistoryQueryDescriptor {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 10));
  const offset = (page - 1) * limit;

  const whereFilters: Array<{ field: string; value: unknown }> = [];
  const havingFilters: Array<{ field: string; value: unknown }> = [];

  if (params.organization_id)
    whereFilters.push({ field: "organization_id", value: params.organization_id });
  if (params.user_email) whereFilters.push({ field: "user_email", value: params.user_email });
  if (params.from) havingFilters.push({ field: "timestamp_from", value: params.from });
  if (params.to) havingFilters.push({ field: "timestamp_to", value: params.to });

  return {
    table: params.table,
    whereFilters,
    havingFilters,
    orderBy: { col: "started_at", dir: "DESC" },
    limit,
    offset,
  };
}

export function historyRoute(fastify: FastifyInstance, db: DbClient) {
  fastify.get<{
    Querystring: {
      table?: string;
      page?: string;
      limit?: string;
      from?: string;
      to?: string;
      user_email?: string;
      organization_id?: string;
    };
  }>("/api/history", async (req, reply) => {
    const { table, page, limit, from, to, user_email, organization_id } = req.query;

    if (!table) {
      return reply.status(400).send({ error: "table param is required" });
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
      organization_id,
    });

    const whereConditions: string[] = [];
    const whereParams: unknown[] = [];

    for (const f of q.whereFilters) {
      if (f.field === "organization_id") {
        whereParams.push(f.value);
        whereConditions.push(`organization_id = $${whereParams.length}`);
      } else if (f.field === "user_email") {
        whereParams.push(f.value);
        whereConditions.push(`user_email ILIKE $${whereParams.length}`);
      }
    }

    const havingConditions: string[] = [];
    const allFilterParams: unknown[] = [...whereParams];

    for (const f of q.havingFilters) {
      if (f.field === "timestamp_from") {
        allFilterParams.push(f.value);
        havingConditions.push(`MIN(created_date) >= $${allFilterParams.length}`);
      } else if (f.field === "timestamp_to") {
        allFilterParams.push(f.value);
        havingConditions.push(`MIN(created_date) <= $${allFilterParams.length}`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
    const havingClause =
      havingConditions.length > 0 ? `HAVING ${havingConditions.join(" AND ")}` : "";
    const dataParams = [...allFilterParams, q.limit, q.offset];

    // ContractHeaderEntity = 1
    const dataSql = `
      SELECT
        correlation_id,
        organization_id,
        user_email,
        MAX(type)::int AS action_type,
        MIN(entity_id::text) FILTER (WHERE entity_type = 1) AS contract_number,
        MIN(created_date) AS started_at,
        EXTRACT(EPOCH FROM (MAX(created_date) - MIN(created_date)) * 1000)::int AS duration_ms,
        COUNT(*)::int AS entity_count,
        array_agg(DISTINCT entity_type::int) AS entity_types
      FROM "${table}"
      ${whereClause}
      GROUP BY correlation_id, organization_id, user_email
      ${havingClause}
      ORDER BY started_at DESC
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
    `;

    const countSql = `
      SELECT COUNT(*)::text AS count
      FROM (
        SELECT correlation_id
        FROM "${table}"
        ${whereClause}
        GROUP BY correlation_id
        ${havingClause}
      ) subq
    `;

    const [rows, countResult] = await Promise.all([
      db.unsafe(dataSql, dataParams as string[]),
      db.unsafe(countSql, allFilterParams as string[]) as Promise<{ count: string }[]>,
    ]);

    const data = rows as Array<Record<string, unknown>>;

    return reply.send({
      data,
      total: parseInt(countResult[0]?.count ?? "0", 10),
      page: Math.floor(q.offset / q.limit) + 1,
      limit: q.limit,
    });
  });
}
