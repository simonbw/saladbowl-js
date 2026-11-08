'use strict';

import type { ConvexClient } from 'convex/browser';

import { api } from '../../../convex/_generated/api';

/**
 * The page's Convex client and identity, for the few calls that aren't game
 * actions (and so don't go through the Redux middleware).
 */
let session: { client: ConvexClient; code: string; userId: string } | null = null;

export function setSession(value: { client: ConvexClient; code: string; userId: string }): void {
  session = value;
}

/** Create (or find) the follow-up game, join it, and return its code. */
export async function playAgain(): Promise<string> {
  if (!session) {
    throw new Error('No session');
  }
  return await session.client.mutation(api.game.playAgain, {
    code: session.code,
    userId: session.userId,
  });
}
