'use strict';

const Redux = require('redux');

const AppReducers = require('../shared/reducers/AppReducers');

exports.get = (initialState, enableReduxDevTools) => {
  const reduxDevTools = (window.devToolsExtension && enableReduxDevTools) ? window.devToolsExtension() : (x) => {
    return x;
  };
  return Redux.createStore(AppReducers, initialState, reduxDevTools);
};