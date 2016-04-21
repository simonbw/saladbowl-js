'use strict';

const express = require('express');

const GameStore = require('./GameStore');

const router = express.Router();
module.exports = router;

/**
 * Display the home page.
 */
router.get('/', (req, res, next) => {
  res.render('index');
});

/**
 * Display the join game page.
 */
router.get('/join-game', (req, res, next) => {
  if (req.query['game-id']) {
    res.redirect('/' + req.query['game-id']);
  } else {
    res.render('join-game');
  }
});

/**
 * Display the new game page.
 */
router.get('/new-game', (req, res, next) => {
  res.render('new-game');
});

/**
 * Create a new game.
 */
router.post('/new-game', (req, res, next) => {
  const wordsPerPlayer = parseInt(req.body.wordsPerPlayer);
  GameStore.create(wordsPerPlayer).then((game) => {
    res.redirect('/' + game.get('id'));
  });
});

/**
 * Display the how to play page.
 */
router.get('/how-to-play', (req, res, next) => {
  res.render('how-to-play');
});

/**
 * Display the game app.
 */
router.get('/:gameId', (req, res, next) => {
  GameStore.get(req.params.gameId)
    .then((game) => {
      const initialGame = JSON.stringify(game);
      res.render('game', {
        initialGame: initialGame,
        userId: req.user.id,
        scripts: ['/js/gamePage.js'],
        debugMode: req.app.get('env') === 'development'
      });
    })
    .catch((error) => {
      if (error.status == 404) {
        res.render('game-not-found');
      } else {
        next(error);
      }
    });
});
