import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// disable @typescript-eslint/no-explicit-any for the entire project
for (const rule of nextTs) {
  if (rule.rules && rule.rules["@typescript-eslint/no-explicit-any"]) {
    rule.rules["@typescript-eslint/no-explicit-any"] = "off";
  }
}
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
