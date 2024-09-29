import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig({ mode: "app", command: "serve" }),
  defineConfig({
    test: {
      globals: true,
      environment: "happy-dom",
      includeSource: ["**/*.ts"],
    },
    define: {
      "import.meta.vitest": "undefined",
    },
  }),
);
