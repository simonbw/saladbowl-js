const ActionTypes = require('../../shared/ActionTypes');

const GameActions = module.exports;

GameActions.setTitle = function (data) {
  return {
    type: ActionTypes.SET_TITLE,
    title: data.title
  }
};