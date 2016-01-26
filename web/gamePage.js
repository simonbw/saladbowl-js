window.Promise = window.Promise || require('promise-polyfill');
require('setimmediate');

const io = require('socket.io-client');
const Provider = require('react-redux').Provider;
const React = require('react');
const ReactDom = require('react-dom');

const GameComponent = require('./components/GameComponent.jsx');
const store = require('./store');
const MessageTypes = require('../shared/MessageTypes.js');
const UpdateGame = require('./UpdateGame.js');

/**
 * Render the page and open the socket.
 */
window.onload = function () {
  var gameId = document.getElementById('game-id').value;
  render();

  var socket = io('/', {query: 'gameId=' + gameId});

  socket.on(MessageTypes.ERROR, function (error) {
    console.log('Error Received:', error);
  });
  socket.on(MessageTypes.REDIRECT, function (data) {
    console.log('redirect received', data);
    window.location = data.url;
  });
  socket.on(MessageTypes.RECEIVED, function () {
    console.log('RECEIVED');
  });
  socket.on(MessageTypes.GAME, function (action) {
    console.log('action received', action);
    store.dispatch(action);
  });

  UpdateGame.init(socket);
};

/**
 * Render the game.
 */
function render() {
  ReactDom.render(
    <Provider store={store}>
      <GameComponent />
    </Provider>,
    document.getElementById('game-react')
  );
}
