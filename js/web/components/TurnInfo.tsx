'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameActions from '../actions/GameActions';
import GameHelpers from '../../shared/GameHelpers';
import { PHASE_COUNT, getPhase } from '../../shared/Phases';
import { isPending } from '../reducers/UIReducers';
import type { Game } from '../../shared/types';
import type { PageProps } from '../types';

/** "Round 2 of 3 · Charades — Just don't make a sound." */
export function PhaseBanner(props: { game: Game }) {
  const phaseIndex = props.game.get('phaseIndex');
  const phase = getPhase(phaseIndex);
  return (
    <div className="phase-banner">
      <div className="phase-name">Round {phaseIndex + 1} of {PHASE_COUNT} · {phase.name}</div>
      <div className="phase-instructions">{phase.instructions}</div>
    </div>
  );
}

/** Seconds the next turn gets when it carries over from the previous phase. */
export function carryOverText(game: Game, who: string): string | null {
  const leftover = Math.round(game.get('secondsLeftover') ?? 0);
  if (leftover <= 0) {
    return null;
  }
  return `${who} keep${who === 'You' ? '' : 's'} going with ${leftover}s + ${game.get('bonusSeconds')}s bonus.`;
}

/**
 * Who is giving clues and what's happening, for everyone but the clue-giver.
 * Between turns it also offers to skip a clue-giver who has dropped off.
 */
export function TurnStatus(props: PageProps & { guessing: boolean }) {
  const { state, dispatch, guessing } = props;
  const game = state.get('game');
  const current = GameHelpers.getCurrentPlayer(game);
  const name = current.get('name');
  const roundStarted = game.get('roundStarted');
  const connected = GameHelpers.isCurrentPlayerConnected(game);

  let status: string;
  if (roundStarted) {
    status = guessing ? `${name} is giving clues. Start guessing!` : `${name} is giving clues.`;
  } else {
    status = `Waiting for ${name} to start their turn.`;
  }
  const carryOver = roundStarted ? null : carryOverText(game, name);

  return (
    <div className="turn-status">
      <div>{status}</div>
      {carryOver && <div className="carry-over">{carryOver}</div>}
      {!roundStarted && !connected && (
        <div className="offline-player">
          <div>{name} seems to be offline.</div>
          <button
            className="skip-player-button"
            disabled={isPending(state.get('ui'), ActionTypes.SERVER.SKIP_PLAYER)}
            onClick={() => dispatch(GameActions.skipPlayer(current.get('id')))}
          >
            Skip {name}
          </button>
          <div className="hint">They'll be back in the rotation as soon as they reconnect.</div>
        </div>
      )}
    </div>
  );
}
