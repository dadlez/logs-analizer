import type { FastifyInstance } from "fastify";
import type { DbClient } from "../db";

const SUGGESTION_FIELDS = ["user_email", "organization_id"] as const;
type SuggestionField = (typeof SUGGESTION_FIELDS)[number];

export function suggestionsRoute(fastify: FastifyInstance, db: DbClient) {
  fastify.get<{
    Querystring: { field?: string };
  }>("/api/history/suggestions", async (req, reply) => {
    const { field } = req.query;

    if (!field || !(SUGGESTION_FIELDS as readonly string[]).includes(field)) {
      return reply
        .status(400)
        .send({ error: `field must be one of: ${SUGGESTION_FIELDS.join(", ")}` });
    }

    const safeField = field as SuggestionField;
    const sql = `
      SELECT DISTINCT ${safeField}
      FROM audit_log
      WHERE ${safeField} IS NOT NULL
      ORDER BY ${safeField}
    `;

    const rows = (await db.unsafe(sql, [])) as Array<Record<string, string>>;
    return reply.send({ data: rows.map((r) => r[safeField]) });
  });
}
