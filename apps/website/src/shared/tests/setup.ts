import { setupServer } from "msw/node";
import { handlers } from "./handlers.ts";
import { afterAll, afterEach, beforeAll } from "vite-plus/test";

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
