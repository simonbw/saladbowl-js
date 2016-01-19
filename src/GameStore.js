const shortId = require('shortid');

const db = require('./db');

games = {};


exports.get = function (gameId) {
  return Promise.resolve(games[gameId]);
};

exports.create = function () {
  var id = shortId.generate();
  games[id] = {
    id: id,
    words: ['GameStore Word'],
    players: ['GameStore Player']
  };
  return Promise.resolve(games[id]);
};

