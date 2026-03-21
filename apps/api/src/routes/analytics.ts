import type { FastifyInstance } from "fastify";

import type { DbClient } from "../db";
import { validateIdentifier } from "../utils";

export function analyticsRoute(fastify: FastifyInstance, db: DbClient) {
  fastify.get<{ Querystring: { table?: string } }>("/api/analytics/modules", async (req, reply) => {
    const { table } = req.query;
    if (!table) return reply.status(400).send({ error: "table param is required" });
    try {
      validateIdentifier(table);
    } catch (e) {
      return reply.status(400).send({ error: (e as Error).message });
    }

    const rows = await db.unsafe(`
      SELECT
        entity_type,
        COUNT(*)::int AS event_count,
        array_agg(DISTINCT type::text) AS event_types,
        COUNT(DISTINCT correlation_id)::int AS unique_correlations
      FROM "${table}"
      WHERE entity_type IS NOT NULL
      GROUP BY entity_type
      ORDER BY event_count DESC
    `);
    return reply.send(rows);
  });

  fastify.get<{ Querystring: { table?: string } }>(
    "/api/analytics/event-types",
    async (req, reply) => {
      const { table } = req.query;
      if (!table) return reply.status(400).send({ error: "table param is required" });
      try {
        validateIdentifier(table);
      } catch (e) {
        return reply.status(400).send({ error: (e as Error).message });
      }

      const rows = await db.unsafe(`
      SELECT
        type::text AS event_type,
        COUNT(*)::int AS count,
        array_agg(DISTINCT entity_type::text) FILTER (WHERE entity_type IS NOT NULL) AS modules,
        AVG(ordinal_position)::numeric(10,2) AS avg_position
      FROM (
        SELECT
          type,
          entity_type,
          correlation_id,
          ROW_NUMBER() OVER (PARTITION BY correlation_id ORDER BY created_date) AS ordinal_position
        FROM "${table}"
      ) sub
      GROUP BY type
      ORDER BY count DESC
    `);
      return reply.send(rows);
    },
  );

  fastify.get<{ Querystring: { table?: string } }>("/api/analytics/flows", async (req, reply) => {
    const { table } = req.query;
    if (!table) return reply.status(400).send({ error: "table param is required" });
    try {
      validateIdentifier(table);
    } catch (e) {
      return reply.status(400).send({ error: (e as Error).message });
    }

    const rows = await db.unsafe(`
      SELECT
        flow,
        COUNT(*)::int AS count
      FROM (
        SELECT
          correlation_id,
          array_agg(type::text ORDER BY created_date) AS flow
        FROM "${table}"
        GROUP BY correlation_id
      ) sub
      GROUP BY flow
      ORDER BY count DESC
      LIMIT 50
    `);
    return reply.send(rows);
  });

  fastify.get<{ Querystring: { table?: string } }>(
    "/api/analytics/cooccurrence",
    async (req, reply) => {
      const { table } = req.query;
      if (!table) return reply.status(400).send({ error: "table param is required" });
      try {
        validateIdentifier(table);
      } catch (e) {
        return reply.status(400).send({ error: (e as Error).message });
      }

      const rows = await db.unsafe(`
        WITH corr_modules AS (
          SELECT correlation_id, entity_type
          FROM "${table}"
          WHERE correlation_id IS NOT NULL
          GROUP BY correlation_id, entity_type
        )
        SELECT
          a.entity_type AS module_a,
          b.entity_type AS module_b,
          COUNT(*)::int AS count
        FROM corr_modules a
        JOIN corr_modules b
          ON a.correlation_id = b.correlation_id AND a.entity_type < b.entity_type
        GROUP BY a.entity_type, b.entity_type
        ORDER BY count DESC
      `);
      return reply.send(rows);
    },
  );

  fastify.get<{ Querystring: { table?: string } }>("/api/analytics/cascade", async (req, reply) => {
    const { table } = req.query;
    if (!table) return reply.status(400).send({ error: "table param is required" });
    try {
      validateIdentifier(table);
    } catch (e) {
      return reply.status(400).send({ error: (e as Error).message });
    }

    const rows = await db.unsafe(`
        WITH corr_patterns AS (
          SELECT
            correlation_id,
            array_agg(entity_type::text || ':' || type::text ORDER BY created_date) AS pattern,
            EXTRACT(EPOCH FROM (MAX(created_date) - MIN(created_date))) * 1000 AS duration_ms
          FROM "${table}"
          WHERE correlation_id IS NOT NULL
          GROUP BY correlation_id
          HAVING COUNT(DISTINCT entity_type) > 1
        )
        SELECT
          pattern,
          COUNT(*)::int AS count,
          AVG(duration_ms)::numeric(10,2) AS avg_duration_ms
        FROM corr_patterns
        GROUP BY pattern
        ORDER BY count DESC
        LIMIT 50
      `);
    return reply.send(rows);
  });

  fastify.get<{ Querystring: { table?: string; bucket?: string } }>(
    "/api/analytics/timeline",
    async (req, reply) => {
      const { table, bucket = "hour" } = req.query;
      if (!table) return reply.status(400).send({ error: "table param is required" });

      const validBuckets = ["minute", "hour", "day"];
      if (!validBuckets.includes(bucket)) {
        return reply.status(400).send({ error: "bucket must be one of: minute, hour, day" });
      }

      try {
        validateIdentifier(table);
      } catch (e) {
        return reply.status(400).send({ error: (e as Error).message });
      }

      const rows = await db.unsafe(
        `
      SELECT
        DATE_TRUNC($1, created_date) AS bucket,
        COUNT(*)::int AS event_count
      FROM "${table}"
      GROUP BY DATE_TRUNC($1, created_date)
      ORDER BY bucket ASC
    `,
        [bucket],
      );
      return reply.send(rows);
    },
  );
}
