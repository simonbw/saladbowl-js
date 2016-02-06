var Redux = require('redux');
var Immutable = require('immutable');

var GameReducers = require('./reducers/GameReducers');
var defaultGame = require('../shared/defaultGame.js');

module.exports = Redux.createStore(GameReducers, defaultGame);