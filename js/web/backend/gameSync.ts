'use strict';

import type { ConvexClient } from 'convex/browser';

import { api } from '../../../convex/_generated/api';
import ActionTypes from '../../shared/ActionTypes';
import UIActions from '../actions/UIActions';
import Timing from '../Timing';
import type { Dispatch } from '../types';

const HEARTBEAT_INTERVAL_MS = 5000;
// Extra early heartbeats so the clock offset is accurate before the first round.
const INITIAL_HEARTBEATS_MS = [0, 300, 700, 1200];

/**
 * Keep the store in sync with the backend: subscribe to the game, track the
 * connection, and heartbeat (presence + clock sync). Replaces the old socket
 * handlers.
 */
export function startGameSync(
  client: ConvexClient,
  code: string,
  userId: string,
  dispatch: Dispatch,
): void {
  // The query result is always the full authoritative game.
  client.onUpdate(
    api.game.getGame,
    { code },
    (game) => {
      if (game) {
        dispatch({ type: ActionTypes.CLIENT.REPLACE_GAME, game });
      }
      dispatch(UIActions.updateField('gameNotFound', !game));
      dispatch(UIActions.updateField('loaded', true));
    },
    (error) => console.error('game subscription error:', error),
  );

  client.subscribeToConnectionState((state) => {
    // Don't flash "Disconnected" while the first connection is opening.
    dispatch(UIActions.updateField('connected', state.isWebSocketConnected || !state.hasEverConnected));
  });

  let heartbeatInFlight = false;
  const heartbeat = () => {
    // Mutations queue while offline; don't pile up stale heartbeats.
    if (heartbeatInFlight) {
      return;
    }
    heartbeatInFlight = true;
    const sentAt = Date.now();
    client
      .mutation(api.game.heartbeat, { code, userId })
      .then((serverTime) => Timing.update(sentAt, serverTime))
      .catch((error) => console.error('heartbeat failed:', error))
      .finally(() => {
        heartbeatInFlight = false;
      });
  };
  INITIAL_HEARTBEATS_MS.forEach((delay) => setTimeout(heartbeat, delay));
  setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
}
