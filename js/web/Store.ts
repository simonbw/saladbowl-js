'use strict';

import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from 'redux';

import AppReducers from './reducers/AppReducers';
import loggingMiddleware from './middleware/loggingMiddleware';
import socketMiddleware from './middleware/socketMiddleware';
import thunkMiddleware from './middleware/thunkMiddleware';
import type { AppState } from './types';

/**
 * Build the Redux store.
 *
 * Keeps the three custom middleware in their original order. Redux Toolkit's
 * `configureStore` is intentionally avoided — its serializability and
 * immutability checks fight this app's Immutable.js game state.
 *
 * @param initialState the serialized initial state
 * @param socket the open socket.io connection
 * @param enableReduxDevTools whether to wire up the Redux DevTools extension
 */
export default (
  initialState: AppState,
  socket: any,
  enableReduxDevTools?: boolean,
) => {
  const devToolsCompose =
    enableReduxDevTools && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  const composeEnhancers = devToolsCompose || compose;

  return createStore(
    AppReducers,
    initialState,
    composeEnhancers(
      applyMiddleware(
        thunkMiddleware,
        loggingMiddleware,
        socketMiddleware(socket),
      ),
    ),
  );
};
