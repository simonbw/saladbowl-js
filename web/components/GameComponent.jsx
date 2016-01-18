const React = require('react');
const ReactRedux = require('react-redux');

/**
 *
 * @param todos
 * @returns {XML}
 * @constructor
 */
function GameComponent(todos) {
  return (
    <div>
      <h1>Game</h1>
      <p>This is a paragraph</p>
    </div>
  );
}

/**
 *
 * @param state
 * @returns {{state: *}}
 */
function mapStateToProps(state) {
  return {state};
}

module.exports = ReactRedux.connect(mapStateToProps)(GameComponent);
