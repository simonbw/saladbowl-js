var React = require('react');

var ActionTypes = require('../../shared/ActionTypes');
var UpdateGame = require('../UpdateGame');
var Validation = require('../../shared/Validation.js');

/**
 * Renders the Join Game Page.
 * @param props
 * @returns {XML}
 */
module.exports = function (props) {
  var dispatch = props.dispatch;
  var ui = props.state.get('ui');

  var onNameChange = function (e) {
    dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'userName',
      value: e.target.value
    });
  };

  var joinGame = function (e) {
    // TODO: Disable form
    e.preventDefault();
    var userName = ui.get('userName');
    UpdateGame.joinGame(userName);
    localStorage.setItem('userName', userName);
  };

  var disabled = !Validation.validateUserName(ui.get('userName'));

  return (
    <div>
      <h1>Join Game</h1>
      <form onSubmit={joinGame}>
        <div>Your Name</div>
        <input autoFocus={true} type="text" onChange={onNameChange} value={ui.get('userName')}/>
        <button type="submit" disabled={disabled}>Join Game</button>
      </form>
    </div>
  );
};
