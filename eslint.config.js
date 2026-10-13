import js from "@eslint/js";
import ts from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default ts.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".reference/**",
      "playwright-report/**",
      "test-results/**",
      "docs/screenshots/**",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": hooks },
    rules: { ...hooks.configs.recommended.rules },
  },
  {
    files: [
      "**/*.{mjs,js}",
      "vite.config.ts",
      "playwright.config.ts",
      "tests/**",
    ],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
