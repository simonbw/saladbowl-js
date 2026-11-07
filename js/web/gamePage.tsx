'use strict';

import * as Immutable from 'immutable';
import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import { createRoot } from 'react-dom/client';
import disableSleeping from './NoSleep';

import Store from './Store';
import GameApp from './components/GameApp';
import GameHelpers from '../shared/GameHelpers';
import { normalizeGameCode } from '../shared/GameCode';
import { createConvexClient } from './backend/convexClient';
import { startGameSync } from './backend/gameSync';
import { getUserId } from './backend/userId';
import type { AppState } from './types';

/**
 * Render the page and subscribe to the game. The game code is the URL path,
 * e.g. `/K7QP`.
 */
function main() {
  window.DEBUG_MODE = import.meta.env.DEV;

  const rawCode = decodeURIComponent(window.location.pathname.replace(/^\/+|\/+$/g, ''));
  const code = normalizeGameCode(rawCode);
  if (code !== rawCode) {
    window.history.replaceState(null, '', '/' + code + window.location.search);
  }

  const userId = getUserId();
  const initialState = Immutable.fromJS({
    ui: {
      userName: localStorage.getItem('userName'),
      loaded: false,
    },
    userId,
    game: null,
  }) as AppState;

  const client = createConvexClient();
  const store = Store(initialState, { client, code, userId }, window.DEBUG_MODE);
  startGameSync(client, code, userId, store.dispatch);

  render(store);

  // Make things globally available for debugging
  if (window.DEBUG_MODE) {
    window.DEBUG = { client, store, GameHelpers };
  }

  const onTouchStart = () => {
    disableSleeping();
    document.removeEventListener('touchstart', onTouchStart);
  };
  document.addEventListener('touchstart', onTouchStart);
}

/**
 * Render the game.
 */
function render(store: ReturnType<typeof Store>) {
  const container = document.getElementById('game-react');
  createRoot(container!).render(
    <ReduxProvider store={store}>
      <GameApp />
    </ReduxProvider>,
  );
}

main();
