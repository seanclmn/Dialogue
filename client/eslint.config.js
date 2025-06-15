import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import typescript from "eslint-plugin-typescript";
import unusedImports from "eslint-plugin-unused-imports";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  js.configs.recommended, // Base JS rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      typescript,
      unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "warn",
      "typescript/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.tsx", "**/*.jsx"],
    plugins: {
      react,
      reactHooks,
      importPlugin,
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "jsx-a11y/alt-text": "warn",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
];
