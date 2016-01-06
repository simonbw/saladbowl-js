var express = require('express');
var shortid = require('shortid');

var gameDao = require('../data/GameDAO').instance;
var gameRoutes = require('./GameRoutes');

var router = express.Router();


/**
 * Guarantee user.
 */
router.use(function (req, res, next) {
  if (req.cookies.user) {
    req.user = req.cookies.user;
  } else {
    req.user = shortid.generate();
    res.cookie('user', req.user);
  }
  next();
});

/**
 * Home Page
 */
router.get('/', function (req, res, next) {
  gameDao.recent()
    .then(function (games) {
      var data = {
        user: req.user,
        games: games
      };
      if (req.xhr) {
        res.send(data);
      } else {
        res.render('index', data);
      }
    }, next)
    .catch(next);
});

/**
 * Home Page
 */
router.get('/recent-games', function (req, res, next) {
  gameDao.recent()
    .then(function (games) {
      var data = {
        user: req.user,
        games: games
      };
      if (req.xhr) {
        res.send(data);
      } else {
        res.render('index', data);
      }
    }, next)
    .catch(next);
});

/**
 * Show the instructions.
 */
router.get('/how-to-play', function (req, res, next) {
  res.render('how-to-play');
});

/**
 * Show the new game page.
 */
router.get('/new-game', function (req, res, next) {
  res.render('new-game');
});

/**
 * Create a new game and link to that game.
 */
router.post('/new-game', function (req, res, next) {
  gameDao.create({
      'name': req.body.gameName,
      'wordsPerPlayer': parseInt(req.body.wordsPerPlayer) || 5
    })
    .then(function (game) {
      res.redirect(game.getUrl());
    }, next)
    .catch(next);
});


exports.init = function (app) {
  gameRoutes.init(router);
  app.use('/', router);
};

