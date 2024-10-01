/**
 * dist の中の assets ディレクトリのみを削除するプラグイン
 *
 * build.emptyOutDir を false にして、dist ディレクトリの中身は削除したくないが、
 * dist の中の assets ディレクトリだけは削除したい場合に使用する。
 *
 * 主なユースケースは、server 用と client 用でビルド設定を分けており、
 * watch モードでそれぞれ並列してビルドする場合などです。
 */

import fs from "node:fs";

import { createLogger } from "vite";

import type { Plugin } from "vite";

const vitePluginCleanupAssets = (): Plugin => {
  const logger = createLogger("info", { prefix: "[vite-plugin-cleanup-assets]" });

  return {
    name: "vite-plugin-cleanup-assets",
    apply: "build",
    enforce: "pre",
    buildStart: async () => {
      fs.rmSync("dist/assets", { recursive: true, force: true });
      logger.info("Cleanup assets", { timestamp: true });
    },
  };
};

export default vitePluginCleanupAssets;
