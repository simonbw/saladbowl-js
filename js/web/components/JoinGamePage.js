'use strict';

const React = require('react');

const ActionTypes = require('../../shared/ActionTypes');
const UpdateGame = require('../UpdateGame');
const Validation = require('../../shared/Validation.js');

/**
 * Renders the Join Game Page.
 * @param props
 * @returns {XML}
 */
module.exports = (props) => {
  const dispatch = props.dispatch;
  const ui = props.state.get('ui');

  function onNameChange(e) {
    dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'userName',
      value: e.target.value
    });
  }

  const joinGame = (e) => {
    // TODO: Disable form
    e.preventDefault();
    const userName = ui.get('userName');
    UpdateGame.joinGame(userName);
    localStorage.setItem('userName', userName);
  };

  const disabled = !Validation.validateUserName(ui.get('userName'));

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
