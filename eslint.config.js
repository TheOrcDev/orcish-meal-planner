import pluginNext from "@next/eslint-plugin-next";
import parser from "@typescript-eslint/parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwind from "eslint-plugin-tailwindcss";

export default [
  ...tailwind.configs["flat/recommended"],
  {
    name: "ESLint Config - nextjs",
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": pluginNext,
    },
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      "tailwindcss/no-custom-classname": [
        "warn",
        {
          whitelist: [
            "text-md",
            "radix\\-([0-z]+(\\-[0-z]+)*)",
            "animate\\-([0-z]+(\\-[0-z]+)*)",
            "animation\\-([0-z]+(\\-[0-z]+)*)",
            "custom\\-([0-z]+(\\-[0-z]+)*)",
            "([0-z]+)\\-destructive",
          ],
        },
      ],
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
];
