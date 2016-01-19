window.Promise = window.Promise || require('promise-polyfill');
require('setimmediate');

const io = require('socket.io-client');
const Provider = require('react-redux').Provider;
const React = require('react');
const ReactDom = require('react-dom');

const GameActions = require('./actions/GameActions.js');
const GameComponent = require('./components/GameComponent.jsx');
const gameStore = require('./stores/gameStore');

/**
 * Render the page and open the socket.
 */
window.onload = function () {
  var gameId = document.getElementById('game-id').value;
  render();

  var socket = io('/', {query: 'gameId=' + gameId});
  socket.on('redirect', function (data) {
    window.location = data.url;
  });
  socket.on('GAME', function (action) {
    gameStore.dispatch(action);
  });
};

/**
 * Render the game.
 */
function render() {
  ReactDom.render(
    <Provider store={gameStore}>
      <GameComponent />
    </Provider>,
    document.getElementById('game-react')
  );
}