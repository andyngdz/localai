import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx,js}", "**/__tests__/**/*.{test,spec}.{ts,tsx,js}"],
    reporters: ["default", ["vitest-sonar-reporter", { outputFile: "sonar-report.xml" }]],
    setupFiles: ["./vitest.setup.ts"],
  },
});
