'use strict';

window.Promise = window.Promise || require('promise-polyfill');
require('setimmediate');

const Immutable = require('immutable');
const io = require('socket.io-client');
const ReduxProvider = require('react-redux').Provider;
const React = require('react');
const ReactDom = require('react-dom');

const ActionTypes = require('../shared/ActionTypes.js');
const Store = require('./Store');
const GameApp = require('./components/GameApp');
const SocketHandlers = require('./socket/SocketHandlers');

/**
 * Render the page and open the socket.
 */
window.onload = () => {
  const initialState = Immutable.fromJS({
    ui: {
      userName: localStorage.getItem('userName')
    },
    userId: window.INITIAL_USER_ID,
    game: window.INITIAL_GAME
  });

  const socket = io('/', {query: 'gameId=' + initialState.get('game').get('id')});
  SocketHandlers.init(socket);
  window.SOCKET = socket;
  const store = Store(initialState, socket, window.DEBUG_MODE);
  socket.store = store; // TODO: Don't do this

  render(store);


  // Make things globally available for debugging
  if (window.DEBUG_MODE) {
    window.DEBUG = {
      socket: socket,
      store: store,
      GameHelpers: require('../shared/GameHelpers')
    };
  }
};

/**
 * Render the game.
 */
function render(store) {
  ReactDom.render(
    <ReduxProvider store={store}>
      <GameApp />
    </ReduxProvider>,
    document.getElementById('game-react')
  );
}
