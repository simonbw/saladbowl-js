'use strict';

window.Promise = window.Promise || require('promise-polyfill');
require('setimmediate');

const Immutable = require('immutable');
const io = require('socket.io-client');
const Provider = require('react-redux').Provider;
const React = require('react');
const ReactDom = require('react-dom');

const ActionTypes = require('../shared/ActionTypes.js');
const AppStore = require('./AppStore');
const GameApp = require('./components/GameApp');
const MessageTypes = require('../shared/MessageTypes');
const UpdateGame = require('./UpdateGame');
const Timing = require('./Timing');

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
  const store = AppStore.get(initialState, true);
  render(store);

  const socket = io('/', {query: 'gameId=' + initialState.get('game').get('id')});

  socket.on('connect', () => {
    console.log('connected');
    store.dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'connected',
      value: true
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    store.dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'connected',
      value: false
    });
  });

  socket.on(MessageTypes.ERROR, (error) => {
    console.log('Error Received:', error);
  });

  socket.on(MessageTypes.REDIRECT, (data) => {
    console.log('redirect received', data);
    window.location = data.url;
  });

  socket.on(MessageTypes.GAME, (action) => {
    console.log('action received', action);
    store.dispatch(action);

    if (action.hasOwnProperty('gameHashCode')) {
      const state = store.getState();
      const game = state.get('game');
      const gameHash = game.hashCode();
      if (gameHash != action.gameHashCode) {
        console.log('Game not in sync', gameHash, action.gameHashCode);
        store.dispatch({
          type: ActionTypes.UI.FIELD_CHANGED,
          field: 'synced',
          value: false
        });
        UpdateGame.outOfSync();
      } else {
        store.dispatch({
          type: ActionTypes.UI.FIELD_CHANGED,
          field: 'synced',
          value: true
        });
      }
    }
  });

  UpdateGame.init(socket);
  Timing.init(socket);


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
    <Provider store={store}>
      <GameApp />
    </Provider>,
    document.getElementById('game-react')
  );
}
