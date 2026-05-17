'use strict';

import ActionTypes from '../../shared/ActionTypes';

export default (socket: any) => {
  socket.on('connect', () => {
    console.log('connected');
    socket.store.dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'connected',
      value: true
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
    socket.store.dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'connected',
      value: false
    });
  });
};
