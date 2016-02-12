var Immutable = require('immutable');

module.exports = Immutable.fromJS({
  ended: false,
  phaseIndex: 0,
  playerIndex: 0,
  players: [],
  roundStarted: false,
  started: false,
  teamIndex: 0,
  wordIndex: 0,
  words: [],
  wordsPerPlayer: 2
});
