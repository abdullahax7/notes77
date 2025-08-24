// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next";

export default tseslint.config(
  // 1) Global ignores (flat config uses a top-level object with `ignores`)
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // 2) Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // 3) Next.js rules (equivalent to `next/core-web-vitals`)
  {
    plugins: {
      "@next/next": next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
    },
  },

  // 4) Project-specific rules
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Your original customizations
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",

      // Helpful TS rules to match your earlier needs
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error", // set to "warn" or "off" if needed
    },
  }
);
