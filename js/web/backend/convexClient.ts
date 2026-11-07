'use strict';

import { ConvexClient } from 'convex/browser';

/**
 * The browser's connection to the Convex backend. `VITE_CONVEX_URL` is written
 * to `.env.local` by `npx convex dev`, and injected at build time by
 * `npx convex deploy --cmd 'npm run build'`.
 */
export function createConvexClient(): ConvexClient {
  const url = import.meta.env.VITE_CONVEX_URL;
  if (!url) {
    throw new Error('VITE_CONVEX_URL is not set; run `npx convex dev` first.');
  }
  return new ConvexClient(url);
}
