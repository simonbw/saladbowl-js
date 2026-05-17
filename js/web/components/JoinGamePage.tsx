'use strict';

import React from 'react';

import GameActions from '../actions/GameActions';
import UIActions from '../actions/UIActions';
import * as Validation from '../../shared/Validation';
import type { PageProps } from '../types';

/**
 * Renders the Join Game Page.
 */
export default (props: PageProps) => {
  const dispatch = props.dispatch;
  const ui = props.state.get('ui');
  const game = props.state.get('game');

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(UIActions.updateField('userName', e.target.value));
  }

  const joinGame = (e: React.FormEvent<HTMLFormElement>) => {
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
      <h2 className="game-id">GameID: {game.get('id')}</h2>
      <form onSubmit={joinGame}>
        <div>Your Name</div>
        <input autoFocus={true} type="text" onChange={onNameChange} value={ui.get('userName')}/>
        <button type="submit" disabled={disabled}>Join Game</button>
      </form>
    </div>
  );
};
