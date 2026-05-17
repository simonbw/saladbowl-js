import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// SaladBowl's client is a single script loaded by a server-rendered HTML page,
// not an index.html-driven SPA — so we build it in library mode as a self-
// contained IIFE bundle. Styles are compiled separately by the `sass` CLI
// (see the `build` script in package.json).
export default defineConfig({
  esbuild: {
    // Classic JSX runtime (components import React explicitly).
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(import.meta.dirname, "js/web/gamePage.tsx"),
      formats: ["iife"],
      name: "SaladBowl",
      fileName: () => "js/web/gamePage.js",
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.{js,ts}"],
  },
});
