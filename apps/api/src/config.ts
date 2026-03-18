export type NodeEnv = "development" | "test" | "production";

export function getConfig() {
  const DATABASE_URL = process.env["DATABASE_URL"];
  const PORT = parseInt(process.env["PORT"] ?? "3001", 10);

  if (!DATABASE_URL) {
    throw new Error("FATAL: DATABASE_URL environment variable is required");
  }

  const NODE_ENV = (process.env["NODE_ENV"] ?? "development") as NodeEnv;

  return { DATABASE_URL, PORT, NODE_ENV };
}
