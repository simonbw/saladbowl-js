'use strict';

import * as Immutable from 'immutable';

import ActionTypes from '../ActionTypes';
import MathUtil from '../MathUtil';
import GameHelpers from '../GameHelpers';
import type { Game, Action } from '../types';

const reducers: Record<string, (game: Game, action: Action) => Game> = {};

/**
 * Pass the turn to the next team. Each time play wraps back to the first
 * team, every team moves on to its next clue-giver.
 */
function advanceTurn(game: Game): Game {
  const teams = GameHelpers.getTeams(game);
  const teamIndex = MathUtil.mod(game.get('teamIndex') + 1, teams.size);
  return game
    .set('teamIndex', teamIndex)
    .set('playerIndex', game.get('playerIndex') + (teamIndex == 0 ? 1 : 0));
}

/**
 * Start the round.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.ROUND_STARTED] = (game, action) => {
  return game
    .set('lastCorrectWordIndex', null)
    .set('roundStarted', true)
    .set('roundStartedAt', action.startTime)
    .set('secondsThisRound', action.secondsThisRound)
    .set('secondsLeftover', 0)
    // Lets clients say how many words this turn got when it ends.
    .set('pointsAtRoundStart', game.get('points').size)
    .set('wordIndex', GameHelpers.getNextWordIndex(game));
};


/**
 * End the round.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.ROUND_ENDED] = (game, action) => {
  if (!game.get('roundStarted')) { // Cannot end a round that has not started.
    return game;
  }
  return advanceTurn(game.set('roundStarted', false));
};


/**
 * Handle a correct word.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.WORD_CORRECT] = (game, action) => {
  // TODO: Validate that round is started and stuff
  const currentPlayer = GameHelpers.getCurrentPlayer(game);
  game = game
    .set('points', game.get('points')
      .push(Immutable.fromJS({
        wordIndex: game.get('wordIndex'),
        playerId: currentPlayer.get('id'),
        team: currentPlayer.get('team'),
        phaseIndex: game.get('phaseIndex')
      })))
    .setIn(['words', game.get('wordIndex'), 'inBowl'], false)
    .set('lastCorrectWordIndex', game.get('wordIndex'));

  const bowlIsEmpty = game.get('words').every((word: any) => {
    return !word.get('inBowl');
  });

  if (bowlIsEmpty) { // The phase just
    if (game.get('phaseIndex') == 2) { // game is over
      return game
        .set('ended', true);
    } else {
      // roundStartedAt and action.time are ms timestamps; secondsThisRound is seconds.
      const roundEndTime = game.get('roundStartedAt') + game.get('secondsThisRound') * 1000;
      const secondsLeftover = (roundEndTime - action.time) / 1000;
      game = game
        .set('words', game.get('words').map((word: any) => {
          return word.set('inBowl', true);
        }))
        .set('roundStarted', false)
        .set('phaseIndex', game.get('phaseIndex') + 1)
        .set('secondsLeftover', secondsLeftover);
    }
  }

  return game.set('wordIndex', GameHelpers.getNextWordIndex(game));
};


/**
 * Skip the current word.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.WORD_SKIPPED] = (game, action) => {
  const skippedIndex = game.get('wordIndex');
  game = game.updateIn(['words', skippedIndex], (word: any) => {
    return word.set('skips', word.get('skips', 0) + 1);
  });
  // Never hand back the word that was just skipped (unless it's the last one).
  return game.set('wordIndex', GameHelpers.getNextWordIndex(game, skippedIndex));
};


/**
 * Take back the last "Correct" of the running round: remove the point, put the
 * word back in the bowl, and make it the current word again.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.CORRECT_UNDONE] = (game, action) => {
  if (!GameHelpers.canUndoCorrect(game)) {
    return game;
  }
  const wordIndex = game.get('lastCorrectWordIndex');
  return game
    .set('points', game.get('points').pop())
    .setIn(['words', wordIndex, 'inBowl'], true)
    .set('lastCorrectWordIndex', null)
    .set('wordIndex', wordIndex);
};


/**
 * Skip the current player.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.PLAYER_SKIPPED] = (game, action) => {
  if (!action.playerId) {
    throw new Error('Player Skipped action requires action.playerId');
  }
  if (game.get('connections').get(action.playerId)) {
    console.warn('Cannot skip connected player');
    return game;
  }
  const playerIndex = GameHelpers.getPlayerIndex(game, action.playerId);
  if (playerIndex < 0) {
    return game;
  }
  const team = game.getIn(['players', playerIndex, 'team']);
  const skipped = game.setIn(['players', playerIndex, 'active'], false);
  const teamHasActivePlayers = skipped.get('players')
    .some((player: any) => player.get('team') === team && player.get('active'));
  if (teamHasActivePlayers) {
    return skipped;
  }
  // Everyone on this team is gone. Leave this player in the rotation (so the
  // team still has a clue-giver if they come back) and pass the turn instead.
  const isCurrentTeam = GameHelpers.getCurrentTeam(game).get('index') === team;
  return isCurrentTeam && !game.get('roundStarted') ? advanceTurn(game) : game;
};

export default reducers;
