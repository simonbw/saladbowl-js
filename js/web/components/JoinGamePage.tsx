'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameActions from '../actions/GameActions';
import UIActions from '../actions/UIActions';
import * as Validation from '../../shared/Validation';
import { isPending } from '../reducers/UIReducers';
import { CodeChip, Header, Screen, Spacer } from './ui';
import type { PageProps } from '../types';

/** Pick a name to join the game with. */
export default (props: PageProps) => {
  const dispatch = props.dispatch;
  const ui = props.state.get('ui');
  const game = props.state.get('game');
  const pending = isPending(ui, ActionTypes.SERVER.JOIN_GAME);

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
    <Screen>
      <Header right={<CodeChip code={game.get('id')}/>}/>
      <form className="screen-form" onSubmit={joinGame}>
        <h1 className="title">What's your name?</h1>
        <label>
          <span className="sr-only">Your name</span>
          <input
            autoFocus={true}
            autoComplete="nickname"
            className="slip-input name-input"
            maxLength={Validation.MAX_USER_NAME_LENGTH}
            onChange={(e) => dispatch(UIActions.updateField('userName', e.target.value))}
            placeholder="Your name"
            type="text"
            value={ui.get('userName') ?? ''}
          />
        </label>
        <Spacer/>
        <button className="btn btn-primary" type="submit" disabled={disabled}>{pending ? 'Joining…' : 'Join game'}</button>
      </form>
    </Screen>
  );
};
