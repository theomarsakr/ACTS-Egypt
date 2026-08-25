import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
    // Vendored agent tooling, not site code. These ship their own bundled
    // and minified scripts (modern-screenshot.umd.js alone accounted for 78
    // no-unused-expressions warnings), which drowned the real findings.
    ".agents/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;
