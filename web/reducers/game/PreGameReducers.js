var Immutable = require('immutable');

var ActionTypes = require('../../../shared/ActionTypes');
var GameHelpers = require('../../GameHelpers');

/**
 * Called when a new player has joined.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.PLAYER_JOINED] = function (game, action) {
  // TODO: Make sure player hasn't already joined

  var player = Immutable.fromJS(action.player);
  var index = action.hasOwnProperty('playerIndex') ? action.playerIndex : game.get('players').size;

  return game
    .set('players', game.get('players').set(index, player))
    .set('words', game.get('words').withMutations(function (words) {
      var wordsPerPlayer = game.get('wordsPerPlayer');
      for (var i = index * wordsPerPlayer; i < (index + 1) * wordsPerPlayer; i++) {
        words.set(i, Immutable.fromJS({
          playerId: player.get('id'),
          word: null,
          skips: 0,
          inBowl: false
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
exports[ActionTypes.CLIENT.WORDS_UPDATED] = function (game, action) {
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
exports[ActionTypes.CLIENT.GAME_STARTED] = function (game, action) {
  return game.set('started', true);
};

/**
 * Called when a player joins a team.
 * @param game {Immutable.Map}
 * @param action
 * @returns {Immutable.Map}
 */
exports[ActionTypes.CLIENT.TEAM_JOINED] = function (game, action) {
  var playerIndex = GameHelpers.getPlayerIndex(game, action.playerId);
  return game.setIn(['players', playerIndex, 'team'], action.team);
};