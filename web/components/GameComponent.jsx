const React = require('react');
const ReactRedux = require('react-redux');

const UpdateGame = require('../UpdateGame');

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
  return (
    <div>
      Add Some Words
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
