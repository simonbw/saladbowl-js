'use strict';
// @flow


const React = require('react');

const ActionTypes = require('../../shared/ActionTypes');
const GameActions = require('../actions/GameActions');
const UIActions = require('../actions/UIActions');
const Validation = require('../../shared/Validation.js');

/**
 * Renders the Join Game Page.
 * @param props
 * @returns {XML}
 */
module.exports = (props:Object) => {
  const dispatch = props.dispatch;
  const ui = props.state.get('ui');

  function onNameChange(e) {
    dispatch(UIActions.updateField('userName', e.target.value));
  }

  const joinGame = (e) => {
    // TODO: Don't use forms!
    // TODO: Disable form
    e.preventDefault();
    const userName = ui.get('userName');
    dispatch(GameActions.joinGame(userName));
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
