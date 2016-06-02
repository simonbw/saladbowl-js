'use strict';
// @flow


const Immutable = require('immutable');

const ActionTypes = require('../ActionTypes');
const GameHelpers = require('../GameHelpers');

/**
 * Called when a new player has joined.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.PLAYER_JOINED] = (game, action) => {
  // TODO: Make sure player hasn't already joined

  let player = Immutable.fromJS(action.player);
  let playerIndex = action.hasOwnProperty('playerIndex') ? action.playerIndex : game.get('players').size;

  return game
    .set('players', game.get('players').set(playerIndex, player))
    .set('words', game.get('words').withMutations((words) => {
      let wordsPerPlayer = game.get('wordsPerPlayer');
      for (let wordIndex = playerIndex * wordsPerPlayer; wordIndex < (playerIndex + 1) * wordsPerPlayer; wordIndex++) {
        words.set(wordIndex, Immutable.fromJS({
          playerId: player.get('id'),
          word: null,
          skips: 0,
          inBowl: false,
          index: wordIndex
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
exports[ActionTypes.CLIENT.WORDS_UPDATED] = (game, action) => {
  const playerIndex = GameHelpers.getPlayerIndex(game, action.playerId);

  return game.set('words', game.get('words').withMutations((words) => {
    action.words.forEach((wordData) => {
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
exports[ActionTypes.CLIENT.GAME_STARTED] = (game, action) => {
  return game.set('started', true);
};

/**
 * Called when a player joins a team.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.TEAM_JOINED] = (game, action) => {
  let playerIndex = GameHelpers.getPlayerIndex(game, action.playerId);
  return game.setIn(['players', playerIndex, 'team'], action.team);
};