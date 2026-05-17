'use strict';

import MessageTypes from '../../shared/MessageTypes';
import UIActions from '../actions/UIActions';
import GameActions from '../actions/GameActions';
import type { Action } from '../types';

export default (socket: any) => {
  socket.on(MessageTypes.GAME, function (action: Action) {
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
