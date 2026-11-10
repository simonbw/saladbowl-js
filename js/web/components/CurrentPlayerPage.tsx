'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameHelpers from '../../shared/GameHelpers';
import { pluralize } from '../../shared/StringUtil';
import { TimerBar, turnTiming } from './Timer';
import GameActions from '../actions/GameActions';
import { carryOverText, slipsThisTurn } from './TurnInfo';
import { isPending } from '../reducers/UIReducers';
import { playSound } from '../Sounds';
import { FittedText, Icon, Name, PhaseHeader, Screen } from './ui';
import type { PageProps } from '../types';

export default (props: PageProps) => {
  const state = props.state;
  if (!state.get('game').get('roundStarted')) {
    return (<ReadyPage state={state} dispatch={props.dispatch}/>);
  } else {
    return (<PlayingPage state={state} dispatch={props.dispatch}/>);
  }
};

/** It's your turn to give clues; start when you're ready. */
function ReadyPage(props: PageProps) {
  const dispatch = props.dispatch;
  const game = props.state.get('game');
  const userId = props.state.get('userId');
  const teammates = GameHelpers.getCurrentTeam(game).get('players')
    .filter((player: any) => player.get('id') !== userId);

  return (
    <Screen>
      <PhaseHeader game={game}/>
      <div className="center-stage">
        <h1 className="title">You're up</h1>
        <p className="lede">{carryOverText(game, 'You') ?? `You have ${game.get('secondsPerRound')} seconds.`}</p>
        {teammates.size > 0 && (
          <p className="lede muted">
            Guessing: {teammates.map((player: any, i: number) => (
              <React.Fragment key={player.get('id')}>{i > 0 && ', '}<Name>{player.get('name')}</Name></React.Fragment>
            )).toArray()}
          </p>
        )}
      </div>
      <button
        className="btn btn-primary btn-big"
        disabled={isPending(props.state.get('ui'), ActionTypes.SERVER.START_ROUND)}
        onClick={() => dispatch(GameActions.startRound())}
      >
        Start turn
      </button>
    </Screen>
  );
}

const SLIP_FIT = { max: 56, min: 24 };

/** The slip you're describing, and Correct / Skip / Undo. */
function PlayingPage(props: PageProps) {
  const game = props.state.get('game');
  const word = game.get('words').get(game.get('wordIndex'));
  const canSkip = GameHelpers.canSkip(game);
  const waitingForServer = props.state.get('ui').get('waitingForServer');
  const wordsInBowl = GameHelpers.getWordsInBowl(game).size;
  const thisTurn = slipsThisTurn(game).size;
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
    <Screen>
      <PhaseHeader game={game}/>
      <TimerBar {...turnTiming(game)}/>
      <div className="slip-stage">
        <div className="slip slip-big" aria-live="polite">
          {!waitingForServer && <FittedText key={word.get('index')} text={word.get('word')} fit={SLIP_FIT}/>}
        </div>
      </div>
      <p className="count-line">{pluralize(wordsInBowl, 'slip')} left · {thisTurn} this turn</p>
      <div className="button-stack">
        <button className="btn btn-primary btn-big" disabled={waitingForServer} onClick={correct}>Correct</button>
        <button className="btn btn-secondary" disabled={waitingForServer || !canSkip} onClick={skip}>
          {canSkip ? 'Skip' : 'Last slip'}
        </button>
        {lastCorrect ? (
          <button className="btn-quiet" disabled={waitingForServer} onClick={() => props.dispatch(GameActions.undoCorrect())}>
            <Icon.Undo/> Undo <span className="hand">{lastCorrect.get('word')}</span>
          </button>
        ) : <div className="btn-quiet" aria-hidden="true"/>}
      </div>
    </Screen>
  );
}
