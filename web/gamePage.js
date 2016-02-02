window.Promise = window.Promise || require('promise-polyfill');
require('setimmediate');

var io = require('socket.io-client');
var Provider = require('react-redux').Provider;
var React = require('react');
var ReactDom = require('react-dom');

var GameComponent = require('./components/GameComponent.jsx');
var store = require('./store');
var MessageTypes = require('../shared/MessageTypes.js');
var UpdateGame = require('./UpdateGame.js');

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
