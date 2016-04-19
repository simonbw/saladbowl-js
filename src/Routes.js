var express = require('express');

var GameStore = require('./GameStore');

var router = express.Router();
module.exports = router;

/**
 * Display the home page.
 */
router.get('/', function (req, res, next) {
  res.render('index');
});

/**
 * Display the join game page.
 */
router.get('/join-game', function (req, res, next) {
  if (req.query['game-id']) {
    res.redirect('/' + req.query['game-id']);
  } else {
    res.render('join-game');
  }
});

/**
 * Display the new game page.
 */
router.get('/new-game', function (req, res, next) {
  res.render('new-game');
});

/**
 * Create a new game.
 */
router.post('/new-game', function (req, res, next) {
  var wordsPerPlayer = parseInt(req.body.wordsPerPlayer);
  GameStore.create(wordsPerPlayer).then(function (game) {
    res.redirect('/' + game.get('id'));
  });
});

/**
 * Display the how to play page.
 */
router.get('/how-to-play', function (req, res, next) {
  res.render('how-to-play');
});

/**
 * Display the game app.
 */
router.get('/:gameId', function (req, res, next) {
  GameStore.get(req.params.gameId)
    .then(function (game) {
      var initialGame = JSON.stringify(game);
      res.render('game', {
        initialGame: initialGame,
        userId: req.user.id,
        scripts: ['/js/gamePage.js']
      });
    })
    .catch(function (error) {
      if (error.status == 404) {
        res.render('game-not-found');
      } else {
        next(error);
      }
    });
});
