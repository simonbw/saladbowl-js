import { resolve } from "node:path";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vitest/config";

const projectRoot = import.meta.dirname;

// Every static page (an HTML file at the project root); each is a Vite entry point.
const PAGES = ["index", "new-game", "join-game", "how-to-play", "game", "404"];

// Game URLs are `/{code}`, e.g. `/K7QP`. Must match the rewrite in vercel.json.
const GAME_CODE_PATH = /^\/[A-Za-z0-9]{3,8}\/?$/;

/**
 * Mirror Vercel's routing in the dev/preview servers: clean URLs
 * (`/new-game` → `new-game.html`) and `/{code}` → `game.html`.
 */
function vercelRouting(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    const [path, query] = (req.url ?? "/").split("?");
    const name = path.replace(/^\/|\/$/g, "");
    let target: string | null = null;
    if (PAGES.includes(name)) {
      target = `/${name}.html`;
    } else if (GAME_CODE_PATH.test(path)) {
      target = "/game.html";
    }
    if (target) {
      req.url = target + (query ? `?${query}` : "");
    }
    next();
  };
  return {
    name: "saladbowl-vercel-routing",
    configureServer: (server) => void server.middlewares.use(rewrite),
    configurePreviewServer: (server) => void server.middlewares.use(rewrite),
  };
}

export default defineConfig({
  plugins: [vercelRouting()],
  esbuild: {
    // Classic JSX runtime (components import React explicitly).
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
  css: {
    preprocessorOptions: {
      // The styles still use @import; silence Sass's deprecation noise.
      scss: { silenceDeprecations: ["import", "global-builtin"] },
    },
  },
  build: {
    outDir: resolve(projectRoot, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(PAGES.map((p) => [p, resolve(projectRoot, `${p}.html`)])),
    },
  },
  server: { port: 3000 },
  preview: { port: 3000 },
  test: {
    environment: "node",
    include: ["test/**/*.test.{js,ts}"],
    server: { deps: { inline: ["convex-test"] } },
  },
});
