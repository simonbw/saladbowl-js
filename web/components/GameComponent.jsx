const React = require('react');
const ReactRedux = require('react-redux');

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

/**
 *
 * @param state
 * @returns {{state: *}}
 */
function mapStateToProps(state) {
  return {
    players: state.get('players'),
    words: state.get('words')
  };
}

module.exports = ReactRedux.connect(mapStateToProps)(GameComponent);
