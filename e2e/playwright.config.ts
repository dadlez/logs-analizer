import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 1,
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node --env-file=.env --import tsx/esm src/index.ts",
      cwd: "../apps/api",
      port: 3001,
      reuseExistingServer: true,
    },
    {
      command: "vp dev",
      cwd: "../apps/website",
      port: 5173,
      reuseExistingServer: true,
    },
  ],
});
