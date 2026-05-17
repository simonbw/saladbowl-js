'use strict';

import * as Immutable from 'immutable';
import io from 'socket.io-client';
import { Provider as ReduxProvider } from 'react-redux';
import React from 'react';
import { createRoot } from 'react-dom/client';
import disableSleeping from './NoSleep';

import Store from './Store';
import GameApp from './components/GameApp';
import SocketHandlers from './socket/SocketHandlers';
import GameHelpers from '../shared/GameHelpers';
import type { AppState } from './types';

/**
 * Render the page and open the socket.
 */
window.onload = () => {
  const initialState = Immutable.fromJS({
    ui: {
      userName: localStorage.getItem('userName'),
    },
    userId: window.INITIAL_USER_ID,
    game: window.INITIAL_GAME,
  }) as AppState;

  const socket = io('/', {
    query: 'gameId=' + initialState.get('game').get('id'),
  });
  SocketHandlers.init(socket);
  const store = Store(initialState, socket, window.DEBUG_MODE);
  (socket as any).store = store; // TODO: Don't do this

  render(store);

  // Make things globally available for debugging
  if (window.DEBUG_MODE) {
    window.DEBUG = {
      socket: socket,
      store: store,
      GameHelpers: GameHelpers,
    };
  }

  const onTouchStart = () => {
    disableSleeping();
    document.removeEventListener('touchstart', onTouchStart);
  };
  document.addEventListener('touchstart', onTouchStart);
};

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
