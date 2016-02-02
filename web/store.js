var Redux = require('redux');
var Immutable = require('immutable');

var GameReducers = require('./reducers/GameReducers');
var DefaultGame = require('../shared/DefaultGame.js');

module.exports = Redux.createStore(GameReducers, Immutable.fromJS(DefaultGame.get()));