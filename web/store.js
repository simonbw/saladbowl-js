const Redux = require('redux');
const Immutable = require('immutable');

const GameReducers = require('./reducers/GameReducers');
const DefaultGame = require('../shared/DefaultGame.js');

module.exports = Redux.createStore(GameReducers, Immutable.fromJS(DefaultGame.get()));