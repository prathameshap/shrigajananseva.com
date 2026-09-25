import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

/**
 * Flat config. `next lint` is deprecated and, with no config present, it drops
 * into an interactive setup prompt — which hangs a CI job rather than failing it.
 * The lint script calls the ESLint CLI directly instead.
 */
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  {
    rules: {
      // The decorative SVG art in components/decor.tsx is intentionally inline
      // rather than a file in public/, so there is no <Image> to prefer.
      "@next/next/no-img-element": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
