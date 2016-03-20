window.Promise = window.Promise || require('promise-polyfill');
require('setimmediate');

var Immutable = require('immutable');
var io = require('socket.io-client');
var Provider = require('react-redux').Provider;
var React = require('react');
var ReactDom = require('react-dom');

var ActionTypes = require('../shared/ActionTypes.js');
var AppStore = require('./AppStore');
var GameApp = require('./components/GameApp');
var MessageTypes = require('../shared/MessageTypes');
var UpdateGame = require('./UpdateGame');

/**
 * Render the page and open the socket.
 */
window.onload = function () {
  var initialState = Immutable.fromJS({
    ui: {
      userName: localStorage.getItem('userName')
    },
    userId: window.initialUserId,
    game: window.initialGame
  });
  var store = AppStore.get(initialState, true);
  render(store);

  var socket = io('/', {query: 'gameId=' + initialState.get('game').get('id')});

  socket.on('connect', function () {
    console.log('connected');
    store.dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'connected',
      value: true
    });
  });

  socket.on('disconnect', function () {
    console.log('disconnected');
    store.dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'connected',
      value: false
    });
  });

  socket.on(MessageTypes.ERROR, function (error) {
    console.log('Error Received:', error);
  });
  socket.on(MessageTypes.REDIRECT, function (data) {
    console.log('redirect received', data);
    window.location = data.url;
  });
  socket.on(MessageTypes.GAME, function (action) {
    console.log('action received', action);
    store.dispatch(action);

    if (action.hasOwnProperty('gameHashCode')) {
      var state = store.getState();
      var game = state.get('game');
      var gameHash = game.hashCode();
      if (gameHash != action.gameHashCode) {
        console.log('Game not in sync', gameHash, action.gameHashCode);
        store.dispatch({
          type: ActionTypes.UI.FIELD_CHANGED,
          field: 'synced',
          value: false
        });
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
