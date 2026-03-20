import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";

export default defineConfig({
  fmt: {
    ignorePatterns: ["dist/**"],
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/shared/tests/setup.ts"],
    exclude: ["**/node_modules/**"],
  },
});
