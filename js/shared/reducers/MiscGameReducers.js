'use strict';
// @flow


const Immutable = require('immutable');

const ActionTypes = require('../ActionTypes');


/**
 * Replace the entire game.
 * @param state
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.REPLACE_GAME] = (state, action) => {
  if (!action.game) {
    throw Error('Replacement game action:' + JSON.stringify(action));
  }
  return Immutable.fromJS(action.game);
};

/**
 * Set the user id.
 * @param state
 * @param action
 * @returns {*}
 */
exports[ActionTypes.CLIENT.SET_USER_ID] = (state, action) => {
  if (!action.userId) {
    throw Error('Cannot set null userId');
  }
  return state.set('userId', action.userId);
};
