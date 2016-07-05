'use strict';

const Immutable = require('immutable');

module.exports = Immutable.fromJS({
  connections: {},
  ended: false,
  lastCorrectWordIndex: null,
  phaseIndex: 0,
  playerIndex: 0,
  players: [],
  points: [],
  roundStarted: false,
  secondsPerRound: 60,
  started: false,
  teamIndex: 0,
  wordIndex: 0,
  words: [],
  wordsPerPlayer: 5
});
