'use strict';

const ActionTypes = require('../../shared/ActionTypes.js');
const MessageTypes = require('../../shared/MessageTypes.js');
const UIActions = require('../actions/UIActions');

module.exports = (socket) => {
  socket.on(MessageTypes.GAME, function (action) {
    console.log('action received', action);
    const store = socket.store;
    store.dispatch(action);

    if (action.hasOwnProperty('gameHashCode')) {
      let state = store.getState();
      let game = state.get('game');
      let gameHash = game.hashCode();
      if (gameHash != action.gameHashCode) {
        console.log('Game not in sync', gameHash, action.gameHashCode);
        store.dispatch(UIActions.updateField('synced', false));
      } else {
        store.dispatch(UIActions.updateField('synced', true))
      }
    }
  });
};
