var ActionTypes = require('../../shared/ActionTypes');
var Immutable = require('immutable');
var defaultGame = require('../../shared/defaultGame.js');


/**
 * Replace the entire game.
 * @param state
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.REPLACE_GAME] = function (state, action) {
  if (!action.game) {
    throw Error('Replacement game action:' + JSON.stringify(action));
  }
  return Immutable.fromJS(action.game);
};
