'use strict';

import type { Middleware } from 'redux';
import MessageTypes from '../../shared/MessageTypes';
import type { Action } from '../types';

// The prefix that all server actions start with
const serverActionPrefix = 'SERVER.';

/**
 * Intercepts `SERVER.*` actions and emits them over the socket instead of
 * reducing them locally.
 */
export default (socket: any): Middleware => (store) => (next) => (action) => {
  const typedAction = action as Action;
  if (
    typedAction.type.substring(0, serverActionPrefix.length) ==
    serverActionPrefix
  ) {
    console.log('sending server action:', typedAction);
    socket.emit(MessageTypes.GAME, typedAction);
  } else {
    return next(action);
  }
};
