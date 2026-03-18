import { buildApp } from "./app";
import { getConfig } from "./config";
import { Database } from "./db";

function bootstrap() {
  let config;
  try {
    config = getConfig();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  const { sql } = new Database(config.DATABASE_URL);
  const app = buildApp({ db: sql, nodeEnv: config.NODE_ENV });

  app.listen({ port: config.PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    app.log.info(`Server running at ${address}`);
  });
}

bootstrap();
