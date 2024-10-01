// @ts-check

import * as pluginCspell from "@cspell/eslint-plugin/configs";
import pluginImportX from "eslint-plugin-import-x";
import pluginSonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules", "dist"] },
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: "./tsconfig.eslint.json",
      },
    },
  },
  pluginCspell.recommended,
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  pluginSonarjs.configs.recommended,
  {
    rules: {
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import-x/no-named-as-default-member": "off",

      "sonarjs/sonar-no-unused-vars": "off",
      "sonarjs/todo-tag": "off",
      "sonarjs/no-nested-functions": ["error", { threshold: 7 }],
    },
  },
);
