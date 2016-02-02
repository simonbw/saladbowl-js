var React = require('react');
var ReactRedux = require('react-redux');

var UpdateGame = require('../UpdateGame');
var Random = require('../../shared/Random');

/**
 *
 * @returns {XML}
 * @constructor
 */
function GameComponent(game) {
  return (
    <div>
      <h1>Game</h1>
      <div>{game.words}</div>
      <div>{game.players}</div>
    </div>
  );
}

function AddWordPage(game) {
  var addRandomWord = function () {
    console.log('adding random word');
    UpdateGame.addWord('word' + Random.integer(1, 1000));
  };
  return (
    <div>
      Add Some Words
      <button onClick={addRandomWord}>Add Random Word</button>
    </div>
  );
}

function JoinTeamsPage(game) {
  return (
    <div>
      Join Some Teams
    </div>
  );
}

function CurrentPlayerPage(game) {
  return (
    <div>
      You Are Up
    </div>
  );
}

function GuessingPlayerPage(game) {
  return (
    <div>
      You Are Guessing
    </div>
  );
}

function WaitingPlayerPage(game) {
  return (
    <div>
      You Are Guessing
    </div>
  );
}

function GameOverPage(game) {
  return (
    <div>
      Game Over
    </div>
  );
}

/**
 *
 * @param state
 * @returns {{state: *}}
 */
function mapStateToProps(state) {
  return state;
}

module.exports = ReactRedux.connect(mapStateToProps)(GameComponent);
