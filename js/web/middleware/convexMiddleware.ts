'use strict';

import type { ConvexClient } from 'convex/browser';
import type { Middleware } from 'redux';

import { api } from '../../../convex/_generated/api';
import ActionTypes from '../../shared/ActionTypes';
import UIActions from '../actions/UIActions';
import { errorMessage } from '../errorMessage';
import type { Action } from '../types';

// The prefix that all server actions start with
const serverActionPrefix = 'SERVER.';

/**
 * Sends `SERVER.*` actions to the Convex `dispatch` mutation. They also pass
 * through to the local reducers, which ignore them except for UI bookkeeping
 * like `waitingForServer`; the authoritative game state comes back via the
 * `getGame` subscription.
 */
export default (
  client: ConvexClient,
  code: string,
  userId: string,
): Middleware => (store) => (next) => (action) => {
  const typedAction = action as Action;
  if (!typedAction.type.startsWith(serverActionPrefix)) {
    return next(action);
  }

  const result = next(action);
  // Convex resolves a mutation only after the subscription reflecting it has
  // been applied, so the new game state is already in the store by `finally`.
  client
    .mutation(api.game.dispatch, { code, userId, action: typedAction })
    .catch((error) => {
      console.error('server action failed:', typedAction, error);
      store.dispatch(UIActions.showError(errorMessage(error)) as any);
    })
    .finally(() => {
      store.dispatch({ type: ActionTypes.UI.SERVER_ACTION_SETTLED, action: typedAction });
    });
  return result;
};
