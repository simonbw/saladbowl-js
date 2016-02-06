var express = require('express');

var GameStore = require('./GameStore');

var router = express.Router();
module.exports = router;

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/new-game', function (req, res, next) {
  res.render('new-game');
});

router.post('/new-game', function (req, res, next) {
  GameStore.create().then(function (game) {
    res.redirect('/' + game.get('id'));
  });
});

router.get('/how-to-play', function (req, res, next) {
  res.render('how-to-play');
});

router.get('/:gameId', function (req, res, next) {
  res.render('game', {
    gameId: req.params.gameId,
    scripts: ['/js/gamePage.js']
  });
});
