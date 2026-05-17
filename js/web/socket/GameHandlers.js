'use strict';

import ActionTypes from '../../shared/ActionTypes.js';
import MessageTypes from '../../shared/MessageTypes.js';
import UIActions from '../actions/UIActions';
import GameActions from '../actions/GameActions';

export default (socket) => {
  socket.on(MessageTypes.GAME, function (action) {
    const store = socket.store;
    store.dispatch(action);

    if (action.hasOwnProperty('gameHashCode')) {
      let state = store.getState();
      let game = state.get('game');
      let gameHash = game.hashCode();
      if (gameHash != action.gameHashCode) {
        console.log('game not in sync', gameHash, action.gameHashCode);
        store.dispatch(GameActions.outOfSync());
      } else if (!state.get('ui').get('synced')) {
        store.dispatch(UIActions.updateField('synced', true))
      }
    }
  });
};
