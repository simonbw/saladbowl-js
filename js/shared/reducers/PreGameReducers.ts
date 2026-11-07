'use strict';

import * as Immutable from 'immutable';

import ActionTypes from '../ActionTypes';
import GameHelpers from '../GameHelpers';
import type { Game, Action } from '../types';

const reducers: Record<string, (game: Game, action: Action) => Game> = {};

/**
 * Called when a new player has joined.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.PLAYER_JOINED] = (game, action) => {
  const defaultPlayer = {team: 0, active: true}; // TODO: Move to default data somewhere
  const player: any = Immutable.fromJS(Object.assign(defaultPlayer, action.player));

  if (game.get('players').some((otherPlayer: any) => player.get('id') == otherPlayer.get('id'))) {
    throw new Error('Player already in game');
  }

  const playerIndex = Object.hasOwn(action, 'playerIndex') ? action.playerIndex : game.get('players').size;

  return game
    .set('players', game.get('players').set(playerIndex, player))
    .set('words', game.get('words').withMutations((words: any) => {
      const wordsPerPlayer = game.get('wordsPerPlayer');
      for (let wordIndex = playerIndex * wordsPerPlayer; wordIndex < (playerIndex + 1) * wordsPerPlayer; wordIndex++) {
        words.set(wordIndex, Immutable.fromJS({ // TODO: Move to default data somewhere
          inBowl: false,
          index: wordIndex,
          playerId: player.get('id'),
          skips: 0,
          word: null
        }));
      }
    }));
};


/**
 * Called when a word has changed.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.WORDS_UPDATED] = (game, action) => {
  const playerIndex = GameHelpers.getPlayerIndex(game, action.playerId);
  if (playerIndex < 0) {
    throw new Error(`Player ${action.playerId} is not in game`);
  }

  return game.set('words', game.get('words').withMutations((words: any) => {
    action.words.forEach((wordData: any) => {
      const wordIndex = playerIndex * game.get('wordsPerPlayer') + wordData.playerWordIndex;
      const oldWord = words.get(wordIndex);
      if (!oldWord) {
        throw new Error('Cannot update word that doesn\'t exist. wordIndex:' + wordIndex + ' playerIndex:' + playerIndex + ' playerWordIndex:' + wordData.playerWordIndex);
      }
      words.set(wordIndex, oldWord.merge(Immutable.fromJS({
        word: wordData.word,
        inBowl: true
      })));
    });
  }));
};


/**
 * Called when the game has started.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.GAME_STARTED] = (game, action) => {
  return game.set('started', true);
};

/**
 * Called when a player joins a team.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
reducers[ActionTypes.CLIENT.TEAM_JOINED] = (game, action) => {
  const playerIndex = GameHelpers.getPlayerIndex(game, action.playerId);
  return game.setIn(['players', playerIndex, 'team'], action.team);
};

export default reducers;
