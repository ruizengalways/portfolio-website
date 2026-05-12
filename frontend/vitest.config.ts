import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";

const isBrowser = process.argv.includes("--browser");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [
      isBrowser ? "./src/test/setup.browser.ts" : "./src/test/setup.node.ts",
    ],
    browser: {
      enabled: isBrowser,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData",
      ],
    },
    exclude: ["**/node_modules/**", "**/dist/**", "**/test/**", "tests/e2e/**"],
  },
  optimizeDeps: {
    exclude: ["chromium-bidi", "playwright-core"],
  },
  ssr: {
    external: ["chromium-bidi", "playwright-core"],
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
});
