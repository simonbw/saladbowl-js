'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameHelpers from '../../shared/GameHelpers';
import { pluralize } from '../../shared/StringUtil';
import Timer from './Timer';
import GameActions from '../actions/GameActions';
import { PhaseBanner, carryOverText } from './TurnInfo';
import { isPending } from '../reducers/UIReducers';
import { playSound } from '../Sounds';
import type { PageProps } from '../types';

export default (props: PageProps) => {
  const state = props.state;
  if (!state.get('game').get('roundStarted')) {
    return (<ReadyPage state={state} dispatch={props.dispatch}/>);
  } else {
    return (<PlayingPage state={state} dispatch={props.dispatch}/>);
  }
};

function ReadyPage(props: PageProps) {
  const dispatch = props.dispatch;
  const game = props.state.get('game');
  const userId = props.state.get('userId');
  const teammates = GameHelpers.getCurrentTeam(game).get('players')
    .filter((player: any) => player.get('id') !== userId)
    .map((player: any) => player.get('name'))
    .join(', ');
  const carryOver = carryOverText(game, 'You');

  return (
    <div>
      <PhaseBanner game={game}/>
      <h1>You're up!</h1>
      <div className="turn-status">
        <div>{carryOver ?? `You have ${game.get('secondsPerRound')} seconds.`}</div>
        {teammates && <div>Your team: {teammates}</div>}
      </div>
      <button
        className="start-round-button"
        disabled={isPending(props.state.get('ui'), ActionTypes.SERVER.START_ROUND)}
        onClick={() => dispatch(GameActions.startRound())}
      >
        Ready
      </button>
    </div>
  );
}

function PlayingPage(props: PageProps) {
  const game = props.state.get('game');
  const word = game.get('words').get(game.get('wordIndex'));
  const canSkip = GameHelpers.canSkip(game);
  const waitingForServer = props.state.get('ui').get('waitingForServer');
  const wordsInBowl = GameHelpers.getWordsInBowl(game).size;
  const lastCorrect = GameHelpers.canUndoCorrect(game)
    ? game.get('words').get(game.get('lastCorrectWordIndex'))
    : null;

  const correct = () => {
    playSound('correct-word');
    props.dispatch(GameActions.correctWord());
  };
  const skip = () => {
    playSound('skip-word');
    props.dispatch(GameActions.skipWord());
  };

  return (
    <div>
      <PhaseBanner game={game}/>
      <Timer endTime={game.get('roundStartedAt') + game.get('secondsThisRound') * 1000}/>
      <div className="current-word word">
        {waitingForServer ? ' ' : word.get('word')}
      </div>
      <button
        className="correct-word-button"
        disabled={waitingForServer}
        onClick={correct}
      >
        Correct
      </button>
      <button
        className="skip-word-button"
        onClick={skip}
        disabled={waitingForServer || !canSkip}
      >
        {canSkip ? "Skip" : "Last Word"}
      </button>
      <div className="words-remaining">{pluralize(wordsInBowl, 'word')} left in the bowl</div>
      {lastCorrect && (
        <button
          className="undo-button"
          disabled={waitingForServer}
          onClick={() => props.dispatch(GameActions.undoCorrect())}
        >
          Undo “{lastCorrect.get('word')}”
        </button>
      )}
    </div>
  );
}
