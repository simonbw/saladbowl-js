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
import { AnnouncementOverlay, ErrorBanner } from './Overlays';
import { Header, Screen } from './ui';
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
    return (<Screen><Header/></Screen>);
  }
  if (ui.get('gameNotFound') || !game.get('id')) {
    return (
      <Screen>
        <Header/>
        <h1 className="title">Game not found</h1>
        <p className="lede">Either this game is already over, or the code is wrong.</p>
        <a className="btn btn-secondary" href="/join-game">Try another code</a>
      </Screen>
    );
  }

  // Choose which page to show.
  let page;
  if (!GameHelpers.playerIsJoined(game, userId)) {
    if (game.get('started')) {
      page = (
        <Screen>
          <Header/>
          <h1 className="title">This game has started</h1>
          <p className="lede">You can't join a game once it's underway.</p>
          <a className="btn btn-secondary" href="/new-game">Start a new game</a>
        </Screen>
      );
    } else {
      page = (<JoinGamePage state={state} dispatch={dispatch}/>);
    }
  } else if (!GameHelpers.playerWordsAreValid(game, userId)) {
    page = (<AddWordsPage state={state} dispatch={dispatch}/>);
  } else if (!game.get('started')) {
    page = (<JoinTeamsPage state={state} dispatch={dispatch}/>);
  } else if (game.get('ended')) {
    page = (<GameOverPage state={state} dispatch={dispatch}/>);
  } else if (GameHelpers.isCurrentPlayer(game, userId)) {
    page = (<CurrentPlayerPage state={state} dispatch={dispatch}/>);
  } else if (GameHelpers.playerIsGuessing(game, userId)) {
    page = (<GuessingPlayerPage state={state} dispatch={dispatch}/>);
  } else {
    page = (<WaitingPlayerPage state={state} dispatch={dispatch}/>);
  }

  return (
    <>
      {ui.get('connected') === false && <div className="banner" role="status">Connection lost. Reconnecting…</div>}
      <ErrorBanner state={state} dispatch={dispatch}/>
      {page}
      <AnnouncementOverlay state={state} dispatch={dispatch}/>
      {window.DEBUG_MODE && <DebugPane state={state} dispatch={dispatch}/>}
    </>
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
