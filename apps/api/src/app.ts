import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { schemaRoute } from "./routes/schema";
import { logsRoute } from "./routes/logs";
import { correlationsRoute } from "./routes/correlations";
import { analyticsRoute } from "./routes/analytics";
import { historyRoute } from "./routes/history";
import { suggestionsRoute } from "./routes/suggestions";
import type { DbClient } from "./db";
import type { NodeEnv } from "./config";

export function buildApp(options: { db: DbClient; nodeEnv: NodeEnv }) {
  const fastify = Fastify({
    logger: options.nodeEnv !== "test",
  });

  fastify.register(cors);

  fastify.register(swagger, {
    openapi: {
      info: {
        title: "Logs Analyzer API",
        version: "1.0.0",
      },
    },
  });

  fastify.register(swaggerUi, {
    routePrefix: "/docs",
  });

  // Health check
  fastify.get("/health", async () => {
    try {
      await options.db`SELECT 1`;
      return { status: "ok", database: "ok" };
    } catch {
      return { status: "ok", database: "error" };
    }
  });

  // Register routes with db
  fastify.register((app) => {
    schemaRoute(app, options.db);
    logsRoute(app, options.db);
    correlationsRoute(app, options.db);
    analyticsRoute(app, options.db);
    historyRoute(app, options.db);
    suggestionsRoute(app, options.db);
  });

  return fastify;
}
