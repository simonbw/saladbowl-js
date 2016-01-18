var Redux = require('redux');
var GameReducers = require('../reducers/GameReducers');
module.exports = Redux.createStore(GameReducers);