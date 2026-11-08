'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameActions from '../actions/GameActions';
import UIActions from '../actions/UIActions';
import * as Validation from '../../shared/Validation';
import { isPending } from '../reducers/UIReducers';
import type { PageProps } from '../types';

/**
 * Renders the Join Game Page.
 */
export default (props: PageProps) => {
  const dispatch = props.dispatch;
  const ui = props.state.get('ui');
  const game = props.state.get('game');
  const pending = isPending(ui, ActionTypes.SERVER.JOIN_GAME);

  function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(UIActions.updateField('userName', e.target.value));
  }

  const joinGame = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) {
      return;
    }
    const userName = (ui.get('userName') ?? '').trim();
    dispatch(GameActions.joinGame(userName));
    localStorage.setItem('userName', userName);
  };

  const disabled = pending || !Validation.validateUserName(ui.get('userName'));

  return (
    <div>
      <h1>Join Game</h1>
      <h2 className="game-id">Game {game.get('id')}</h2>
      <form onSubmit={joinGame}>
        <div>Your Name</div>
        <input
          autoFocus={true}
          type="text"
          maxLength={Validation.MAX_USER_NAME_LENGTH}
          onChange={onNameChange}
          value={ui.get('userName') ?? ''}
        />
        <button type="submit" disabled={disabled}>{pending ? 'Joining…' : 'Join Game'}</button>
      </form>
    </div>
  );
};
