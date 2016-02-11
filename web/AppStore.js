var Immutable = require('immutable');
var Redux = require('redux');

var AppReducers = require('./reducers/AppReducers');

exports.get = function (initialState, enableReduxDevTools) {
  var reduxDevTools = (window.devToolsExtension && enableReduxDevTools) ? window.devToolsExtension() : function (x) {
    return x;
  };
  return Redux.createStore(AppReducers, initialState, reduxDevTools);
};