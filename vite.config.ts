import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import vitePluginCopy from "./lib/vite-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "app") {
    return {
      plugins: [
        react(),
        tsconfigPaths(),
        vitePluginCopy({ from: "app/manifest.json", to: "dist/manifest.json" }),
      ],
    };
  }

  return {
    plugins: [tsconfigPaths()],
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: "worker/background.ts",
        output: {
          entryFileNames: "[name].js",
        },
      },
    },
  };
});
