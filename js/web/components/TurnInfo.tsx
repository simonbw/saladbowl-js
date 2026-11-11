'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameActions from '../actions/GameActions';
import GameHelpers from '../../shared/GameHelpers';
import { pluralize } from '../../shared/StringUtil';
import { isPending } from '../reducers/UIReducers';
import { TimerRing, turnTiming } from './Timer';
import { MiniSlip, Name, PhaseHeader, Screen, shortTeamName } from './ui';
import type { Game } from '../../shared/types';
import type { PageProps } from '../types';

/** Seconds the next turn gets when it carries over from the previous phase. */
export function carryOverText(game: Game, who: string): string | null {
  const leftover = Math.round(game.get('secondsLeftover') ?? 0);
  if (leftover <= 0) {
    return null;
  }
  return `${who} keep${who === 'You' ? '' : 's'} going with ${leftover}s + ${game.get('bonusSeconds')}s bonus.`;
}

/** The slips guessed so far in the running turn (this phase only). */
export function slipsThisTurn(game: Game): any {
  const atStart = game.get('pointsAtRoundStart') ?? game.get('points').size;
  const phase = game.get('phaseIndex');
  return game.get('points').skip(atStart)
    .filter((point: any) => point.get('phaseIndex') === phase)
    .map((point: any) => game.get('words').get(point.get('wordIndex')))
    .filter(Boolean);
}

/**
 * What everyone but the clue-giver sees: during a turn, the countdown and the
 * slips guessed so far; between turns, who's up next.
 * `guessing` is true for the clue-giver's teammates.
 */
export function WatchingPage(props: PageProps & { guessing: boolean }) {
  const game = props.state.get('game');
  const current = GameHelpers.getCurrentPlayer(game);
  const team = GameHelpers.getCurrentTeam(game);
  const left = GameHelpers.getWordsInBowl(game).size;

  if (!game.get('roundStarted')) {
    return (
      <Screen>
        <PhaseHeader game={game}/>
        <div className="center-stage">
          <h1 className="title">{props.guessing ? 'Your team is up' : `${shortTeamName(team.get('name'))} are up`}</h1>
          <TurnStatus state={props.state} dispatch={props.dispatch}/>
        </div>
        <p className="count-line">{pluralize(left, 'slip')} left</p>
      </Screen>
    );
  }

  const guessed = slipsThisTurn(game);
  return (
    <Screen>
      <PhaseHeader game={game}/>
      <div className="center-stage">
        <TimerRing {...turnTiming(game)}/>
        <p className="lede giving-clues">
          <Name>{current.get('name')}</Name> is giving clues{props.guessing ? '.' : ` to the ${shortTeamName(team.get('name'))}.`}
        </p>
      </div>
      <div className="this-turn">
        {guessed.size > 0 && (
          <>
            <span className="label">This turn</span>
            <div className="mini-slips">
              {guessed.map((word: any) => <MiniSlip key={word.get('index')}>{word.get('word')}</MiniSlip>).toArray()}
            </div>
          </>
        )}
        <p className="count-line">{pluralize(left, 'slip')} left</p>
      </div>
    </Screen>
  );
}

/**
 * Between turns: who we're waiting on. Offers to skip a clue-giver who has
 * dropped off.
 */
function TurnStatus(props: PageProps) {
  const { state, dispatch } = props;
  const game = state.get('game');
  const current = GameHelpers.getCurrentPlayer(game);
  const name = current.get('name');
  const carryOver = carryOverText(game, name);

  return (
    <>
      <p className="lede">Waiting for <Name>{name}</Name> to start.</p>
      {carryOver && <p className="lede muted">{carryOver}</p>}
      {!GameHelpers.isCurrentPlayerConnected(game) && (
        <div className="offline-player">
          <p><Name>{name}</Name> seems to be offline. They'll be back in the rotation as soon as they reconnect.</p>
          <button
            className="btn btn-secondary"
            disabled={isPending(state.get('ui'), ActionTypes.SERVER.SKIP_PLAYER)}
            onClick={() => dispatch(GameActions.skipPlayer(current.get('id')))}
          >
            Skip <Name>{name}</Name>
          </button>
        </div>
      )}
    </>
  );
}
