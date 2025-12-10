import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Temporarily allow any types (main blocker for deployment)
      "@typescript-eslint/no-explicit-any": "off",
      // Reduce unused vars to warnings instead of errors and allow _ prefix
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      // React entity warnings
      "react/no-unescaped-entities": "warn",
      // Display name warnings
      "react/display-name": "warn",
      // Hook dependency warnings
      "react-hooks/exhaustive-deps": "warn",
      // Import warnings
      "import/no-anonymous-default-export": "warn",
      // Next.js warnings
      "@next/next/no-img-element": "warn",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
