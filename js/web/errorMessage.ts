import { ConvexError } from 'convex/values';

/**
 * A message fit to show a player. `ConvexError`s carry one from the backend;
 * anything else is an unexpected failure (usually the network).
 */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Check your connection and try again.'): string {
  if (error instanceof ConvexError && typeof error.data === 'string') {
    return error.data;
  }
  return fallback;
}
