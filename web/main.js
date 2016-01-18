require('setimmediate');
window.Promise = window.Promise || require('promise-polyfill');

const Axios = require('axios');
const Provider = require('react-redux').Provider;
const React = require('react');
const ReactDom = require('react-dom');
const io = require('socket.io-client');

const gameStore = require('./stores/gameStore');
const GameComponent = require('./components/GameComponent.jsx');

window.onload = function () {
  if (document.getElementById('game-react')) {
    console.log('game page');
    render();
    var socket = io();
    socket.on('game.test', function (data) {
      console.log(data);
    });
    socket.on('game.heartbeat', function (data) {
      console.log('heartbeat');
    });
  }
};

function render() {
  ReactDom.render(
    <Provider store={gameStore}>
      <GameComponent />
    </Provider>,
    document.getElementById('game-react')
  );
}