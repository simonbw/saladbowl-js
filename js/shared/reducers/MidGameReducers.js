'use strict';

const Immutable = require('immutable');

const ActionTypes = require('../ActionTypes');
const MathUtil = require('../MathUtil');
const GameHelpers = require('../GameHelpers');

/**
 * Start the round.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.ROUND_STARTED] = (game, action) => {
  return game
    .set('lastCorrectWordIndex', null)
    .set('roundStarted', true)
    .set('roundStartedAt', action.startTime)
    .set('secondsThisRound', action.secondsThisRound)
    .set('secondsLeftover', 0)
    .set('wordIndex', GameHelpers.getNextWordIndex(game));
};


/**
 * End the round.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.ROUND_ENDED] = (game, action) => {
  if (!game.get('roundStarted')) { // Cannot end a round that has not started.
    return game;
  }
  const teams = GameHelpers.getTeams(game);
  const teamIndex = MathUtil.mod(game.get('teamIndex') + 1, teams.size);
  return game
    .set('roundStarted', false)
    .set('teamIndex', teamIndex)
    .set('playerIndex', game.get('playerIndex') + (teamIndex == 0));
};


/**
 * Handle a correct word.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.WORD_CORRECT] = (game, action) => {
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

  const bowlIsEmpty = game.get('words').every((word) => {
    return !word.get('inBowl');
  });

  if (bowlIsEmpty) { // The phase just
    if (game.get('phaseIndex') == 2) { // game is over
      return game
        .set('ended', true);
    } else {
      const roundEndTime = game.get('roundStartedAt') + game.get('secondsThisRound')
      const secondsLeftover = roundEndTime - action.time;
      game = game
        .set('words', game.get('words').map((word) => {
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
exports[ActionTypes.CLIENT.WORD_SKIPPED] = (game, action) => {
  return game
    .updateIn(['words', game.get('wordIndex')], (word) => {
      return word.set('skips', word.get('skips', 0) + 1);
    })
    .set('wordIndex', GameHelpers.getNextWordIndex(game));
};


/**
 * Skip the current player.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.PLAYER_SKIPPED] = (game, action) => {
  if (!action.playerId) {
    throw new Error('Player Skipped action requires action.playerId');
  }
  if (game.get('connections').get(action.playerId)) {
    console.warn('Cannot skip connected player');
    return game;
  }
  const playerIndex = GameHelpers.getPlayerIndex(game, action.playerId);
  return game.setIn(['players', playerIndex, 'active'], false);
};
