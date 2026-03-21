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
