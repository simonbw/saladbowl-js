const React = require('react');
const ReactRedux = require('react-redux');

const UpdateGame = require('../UpdateGame');
const Random = require('../../shared/Random');

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
  return state.toJS();
}

module.exports = ReactRedux.connect(mapStateToProps)(GameComponent);
