import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import {fixupPluginRules} from "@eslint/compat";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginReactCompiler from "eslint-plugin-react-compiler";
import eslintPluginNext from "@next/eslint-plugin-next";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // Ignores configuration
  {
    ignores: ["node_modules", ".next", "out", "coverage", ".idea"],
  },
  // General configuration
  {
    rules: {
      "padding-line-between-statements": [
        "warn",
        {blankLine: "always", prev: "*", next: ["return", "export"]},
        {blankLine: "always", prev: ["const", "let", "var"], next: "*"},
        {blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"]},
      ],
      "no-console": ["warn", {allow: ["error"]}],
    },
  },
  // React configuration
  {
    plugins: {
      react: fixupPluginRules(eslintPluginReact),
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
      "react-compiler": fixupPluginRules(eslintPluginReactCompiler),
      "jsx-a11y": fixupPluginRules(eslintPluginJsxA11y),
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": ["error", {props: "never", children: "never"}],
      "react/jsx-no-useless-fragment": "error",
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/no-array-index-key": "off",
      "react/react-in-jsx-scope": "off",
      "react/self-closing-comp": "warn",
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
      "react-compiler/react-compiler": "error",
      "react/jsx-no-leaked-render": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/html-has-lang": "off",
    },
  },
  // TypeScript configuration
  ...[
    ...tseslint.configs.recommended,
    {
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-empty-object-type": "error",
        "@typescript-eslint/no-unsafe-function-type": "error",
        "@typescript-eslint/no-wrapper-object-types": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-shadow": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            args: "after-used",
            ignoreRestSiblings: false,
            argsIgnorePattern: "^_.*?$",
            caughtErrorsIgnorePattern: "^_.*?$",
          },
        ],
      },
    },
  ],
  // Prettier configuration
  ...[
    eslintPluginPrettier,
    {
      rules: {
        "prettier/prettier": [
          "warn",
          {
            printWidth: 100,
            trailingComma: "all",
            tabWidth: 2,
            semi: true,
            singleQuote: false,
            bracketSpacing: true,
            arrowParens: "always",
            endOfLine: "auto",
            plugins: ["prettier-plugin-tailwindcss"],
          },
        ],
      },
    },
  ],
  // Import configuration
  {
    plugins: {
      import: fixupPluginRules(eslintPluginImport),
    },
    rules: {
      "import/no-default-export": "off",
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@/*",
              group: "external",
              position: "after",
            },
          ],
          "newlines-between": "always",
        },
      ],
    },
  },
  // Next configuration
  {
    plugins: {
      "@next/next": fixupPluginRules(eslintPluginNext),
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      ...eslintPluginNext.configs.recommended.rules,
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];