
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";

export default defineConfig([
  globalIgnores([
    "node_modules/",
    "main.js",
    "esbuild.config.mjs",
    "eslint.config.mjs",
    "styles.css",
    ".obsidian/",
    "**/.obsidian/**",
  ]),

  // Only lint TypeScript source files.
  {
    files: ["src/**/*.ts"],

    extends: [
      tseslint.configs.recommendedTypeChecked,
      obsidianmd.configs.recommended,
    ],

    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "no-debugger": "error",
      "no-alert": "warn",
      "no-eval": "error",
    },
  },
]);
