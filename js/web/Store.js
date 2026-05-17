'use strict';

import * as Redux from 'redux';

import AppReducers from './reducers/AppReducers';
import loggingMiddleware from './middleware/loggingMiddleware';
import socketMiddleware from './middleware/socketMiddleware';
import thunkMiddleware from './middleware/thunkMiddleware';

/**
 *
 * @param initialState
 * @param socket
 * @param enableReduxDevTools
 * @returns {*}
 */
export default (initialState, socket, enableReduxDevTools) => {
  const reduxDevTools = (window.devToolsExtension && enableReduxDevTools) ? window.devToolsExtension() : (x) => x;
  return Redux.createStore(
    AppReducers,
    initialState,
    Redux.applyMiddleware(
      thunkMiddleware,
      loggingMiddleware,
      socketMiddleware(socket)
    ));
};
