'use strict';

import React from 'react';
import * as ReactRedux from 'react-redux';

import AddWordsPage from './AddWordsPage';
import CurrentPlayerPage from './CurrentPlayerPage';
import DebugPane from './DebugPane';
import GameHelpers from '../../shared/GameHelpers';
import GameOverPage from './GameOverPage';
import GuessingPlayerPage from './GuessingPlayerPage';
import JoinGamePage from './JoinGamePage';
import JoinTeamsPage from './JoinTeamsPage';
import WaitingPlayerPage from './WaitingPlayerPage';
import type { AppState, Dispatch, PageProps } from '../types';

/**
 *
 * @constructor
 */
function GameComponent(props: PageProps) {
  const dispatch = props.dispatch;
  const state = props.state;
  const game = state.get('game');
  const userId = state.get('userId');
  const ui = state.get('ui');


  if (!ui.get('loaded')) {
    return (<div>loading...</div>);
  }
  if (ui.get('gameNotFound') || !game.get('id')) {
    return (
      <div>
        <h1>Game Not Found</h1>
        <p>Either this game is already over, or you typed the code in wrong.</p>
      </div>
    );
  }

  // Choose which page to show.
  let page;
  if (!GameHelpers.playerIsJoined(game, userId)) {
    if (game.get('started')) {
      page = (<div>You cannot join a game once it has started.</div>)
    } else {
      page = (<JoinGamePage state={state} dispatch={dispatch}/>);
    }
  } else if (!GameHelpers.playerWordsAreValid(game, userId)) {
    page = (<AddWordsPage state={state} dispatch={dispatch}/>);
  } else if (!game.get('started')) {
    page = (<JoinTeamsPage state={state} dispatch={dispatch}/>);
  } else if (game.get('ended')) {
    page = (<GameOverPage state={state} dispatch={dispatch}/>);
  } else if (GameHelpers.getCurrentPlayer(game).get('id') == userId) {
    page = (<CurrentPlayerPage state={state} dispatch={dispatch}/>);
  } else if (GameHelpers.playerIsGuessing(game, userId)) {
    page = (<GuessingPlayerPage state={state} dispatch={dispatch}/>);
  } else {
    page = (<WaitingPlayerPage state={state} dispatch={dispatch}/>);
  }

  const errors = [];
  if (ui.get('connected') === false) {
    errors.push(<div key={0} className="error">Disconnected</div>);
  }

  return (
    <div>
      {errors.length > 0 &&
      <div className="errors">{errors}</div>
      }
      {page}
      {window.DEBUG_MODE &&
      <DebugPane state={state} dispatch={dispatch}/>
      }
    </div>
  );
}


/**
 *
 * @param state
 * @returns {{state: *}}
 */
function mapStateToProps(state: AppState) {
  return {
    'state': state
  };
}

export default ReactRedux.connect(mapStateToProps)(GameComponent);
