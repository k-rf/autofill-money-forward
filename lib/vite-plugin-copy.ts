/**
 * ビルド対象には含まれないファイルを、出力ディレクトリにコピーするプラグイン
 *
 * 主なユースケースは、manifest.json などのファイルを出力ディレクトリにコピーする場合などです。
 */

import fs from "node:fs";

import { createLogger } from "vite";

import type { Plugin } from "vite";

const vitePluginCopy = (...args: { from: string; to: string }[]): Plugin => {
  const logger = createLogger("info", { prefix: "[vite-plugin-copy]" });

  return {
    name: "vite-plugin-copy",
    apply: "build",
    enforce: "post",
    closeBundle: async () => {
      for (const { from, to } of args) {
        if (!fs.existsSync(from)) {
          logger.warn(`File is not found: ${from}`, { timestamp: true });
          continue;
        }

        fs.copyFileSync(from, to, fs.constants.COPYFILE_FICLONE);

        logger.info(`Copied ${from} to ${to}`, { timestamp: true });
      }
    },
  };
};

export default vitePluginCopy;
