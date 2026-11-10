import { resolve } from "node:path";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vitest/config";

import { LOGO_HTML, faviconSvg } from "./js/web/logo";

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

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Cause:wght@100..900&family=Rubik:wght@300;400;500;600&display=swap";

/**
 * Shared bits of every page: the font and icon links in the head, and the
 * wordmark wherever a page has a `<!-- logo -->` comment (so it's in the HTML,
 * not drawn in by script after load). The SVG favicon is generated from the
 * logo's bowl; the PNG icons in public/images are renders of it.
 */
function pageChrome(): Plugin {
  const favicon = faviconSvg();
  return {
    name: "saladbowl-page-chrome",
    configureServer: (server) => void server.middlewares.use("/favicon.svg", (_req, res) => {
      res.setHeader("Content-Type", "image/svg+xml");
      res.end(favicon);
    }),
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "favicon.svg", source: favicon });
    },
    transformIndexHtml: (html) => ({
      html: html.replaceAll("<!-- logo -->", LOGO_HTML),
      tags: [
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" }, injectTo: "head" },
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }, injectTo: "head" },
        { tag: "link", attrs: { rel: "stylesheet", href: FONTS_URL }, injectTo: "head" },
        { tag: "link", attrs: { rel: "icon", href: "/images/favicon.png", sizes: "48x48", type: "image/png" }, injectTo: "head" },
        { tag: "link", attrs: { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }, injectTo: "head" },
        { tag: "link", attrs: { rel: "apple-touch-icon", href: "/images/apple-touch-icon.png" }, injectTo: "head" },
        { tag: "meta", attrs: { name: "theme-color", content: "#FFFFFF" }, injectTo: "head" },
      ],
    }),
  };
}

export default defineConfig({
  plugins: [vercelRouting(), pageChrome()],
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
