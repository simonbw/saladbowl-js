import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  /**
   * One row per game. `state` is the whole game as plain JSON (an
   * Immutable.Map `.toJS()`'d) so the shared reducers in `js/shared/` run on
   * it unchanged.
   */
  games: defineTable({
    code: v.string(),
    state: v.any(),
    // Bumped every time a round ends; the scheduled `endRound` only fires if
    // its roundId still matches, so a round that ended early is never ended
    // twice.
    roundId: v.number(),
    roundTimeoutId: v.union(v.id('_scheduled_functions'), v.null()),
    createdAt: v.number(),
  }).index('by_code', ['code']),

  /**
   * Heartbeat bookkeeping, kept out of the game row so a heartbeat doesn't push
   * the whole game to every subscriber. The game state's `connections` map is
   * only written when a user's connected status actually flips.
   */
  presence: defineTable({
    gameId: v.id('games'),
    userId: v.string(),
    lastSeen: v.number(),
    // Whether a `checkPresence` call is already scheduled for this user.
    checkScheduled: v.boolean(),
  }).index('by_game_user', ['gameId', 'userId']),
});
