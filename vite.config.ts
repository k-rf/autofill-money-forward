import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import vitePluginCopy from "./lib/vite-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === "app") {
    return {
      root: "src",
      plugins: [
        react(),
        tsconfigPaths(),
        vitePluginCopy({ from: "src/manifest.json", to: "dist/manifest.json" }),
      ],
      build: {
        outDir: "../dist",
        emptyOutDir: false,
      },
    };
  }

  return {
    plugins: [tsconfigPaths()],
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: ["src/worker/background.ts", "src/worker/content-script.ts"],
        output: {
          entryFileNames: "[name].js",
        },
      },
    },
  };
});
