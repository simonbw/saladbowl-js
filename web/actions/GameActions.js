const ActionTypes = require('../../shared/ActionTypes');

const GameActions = module.exports;

GameActions.setTitle = function (title) {
  return {
    type: ActionTypes.SET_TITLE,
    title: title
  }
};