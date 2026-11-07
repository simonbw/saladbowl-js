import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

// Lenient baseline for a legacy codebase mid-migration. Tighten over time;
// the goal here is useful signal, not a wall of errors.
export default tseslint.config(
  { ignores: ["dist/", "node_modules/", "public/", "convex/_generated/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
);
