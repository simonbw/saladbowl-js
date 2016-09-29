'use strict';

const express = require('express');
const childProcess = require('child-process-promise');
const GameStore = require('./GameStore');
const MathUtil = require('../shared/MathUtil');

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
  const wordsPerPlayer = MathUtil.clamp(parseInt(req.body.wordsPerPlayer) || 5, 1, 100);
  const secondsPerRound = MathUtil.clamp(parseInt(req.body.secondsPerRound) || 60, 1, 200);
  GameStore.create(wordsPerPlayer, secondsPerRound).then((game) => {
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
 * Display the currently running version.
 */
router.get('/version', (req, res, next) => {
  const logPromise = childProcess.exec('git log -n 10 --pretty=oneline');
  const branchPromise = childProcess.exec('git rev-parse --abbrev-ref HEAD');
  Promise.all([logPromise, branchPromise]).then((results) => {
    const logs = results[0].stdout.trim().split('\n').map((s) => {
      const i = s.indexOf(' ');
      const hash = s.slice(0, i);
      return {
        hash: hash,
        short: hash.slice(0, 7),
        message: s.slice(i + 1),
        url: `https://github.com/simonbw/saladbowl-js/commit/${hash}`
      };
    });
    const branchName = results[1].stdout.trim();

    res.render('version', {
      branchName: branchName,
      branchUrl: `https://github.com/simonbw/saladbowl-js/tree/${branchName}`,
      logs: logs
    });
  });
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
        debugMode: (req.app.get('env') === 'development')
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
