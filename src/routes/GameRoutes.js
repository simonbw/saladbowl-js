var express = require('express');

var gameDao = require('../data/GameDAO').instance;
var router = express.Router({mergeParams: true});

// TODO: Validation / Remove race conditions
// TODO: REST?
// TODO: More ajax


/**
 * Attach game to request. 404 if game not found.
 *
 * @param req
 * @param res
 * @param next
 */
var attachGame = function (req, res, next) {
  gameDao.fromId(req.params['gameId'])
    .then(
      function (game) {
        if (!game) {
          var error = new Error('Could not find game: ' + req.gameId);
          error.status = 404;
          throw error;
        }
        req.game = game;
        next();
      }, next).catch(next);
};

/**
 * Attaches the player to the request.
 * Redirects to join page if not joined.
 *
 * @param req
 * @param res
 * @param next
 */
var attachPlayer = function (req, res, next) {
  var player = req.game.getPlayer(req.user);
  if (player) {
    req.player = player;
    next();
  } else {
    if (req.xhr) {
      res.send({'redirect': req.game.getUrl()});
    } else {
      res.redirect(req.game.getUrl('join'));
    }
  }
};

router.use('/', attachGame);

/**
 *
 */
router.get('/', attachPlayer, function (req, res, next) {
  var game = req.game;
  var player = game.getPlayer(req.user);
  if (player) {
    if (player.words.length < game.wordsPerPlayer) {
      res.redirect(game.getUrl('add-word'));
    } else {
      var data = {
        currentPlayer: game.currentPlayer,
        game: game,
        phase: game.phases[game.currentPhase],
        player: player,
        serverTime: Date.now(),
        teams: game.getTeams(true),
        user: req.user
      };
      res.render('game/main', data);
    }
  } else {
    res.redirect(game.getUrl('join'));
  }
});

/**
 *
 */
router.get('/json', function (req, res, next) {
  var data = {
    game: req.game,
    serverTime: Date.now(),
    user: req.user
  };
  res.send(data);
});

/**
 *
 */
router.get('/join', function (req, res, next) {
  res.render('join', {
    user: req.user,
    username: req.username,
    game: req.game
  });
});

/**
 *
 */
router.post('/join', function (req, res, next) {
  gameDao.addPlayer(req.game, req.user, req.body.playerName)
    .then(function (game) {
      res.cookie('username', req.body.playerName);
      res.redirect(game.getUrl());
    }, function (error) {
      if (error.name == 'JoinError') {
        if (error.message === 'ALREADY JOINED') {
          res.redirect(req.game.getUrl());
        } else if (error.message === 'NAME TAKEN') {
          res.redirect(req.path);
        }
      } else {
        throw error;
      }
    })
    .catch(next);
});

/**
 *
 */
router.get('/leave', function (req, res, next) {
  gameDao.removePlayer(req.game._id, req.user)
    .then(function (game) {
      res.redirect('/');
    }, next)
    .catch(next);
});

/**
 *
 */
router.get('/delete', function (req, res, next) {
  gameDao.remove(req.game._id)
    .then(function () {
      res.redirect('/');
    }, next)
    .catch(next);
});

/**
 *
 */
router.post('/join-team', attachPlayer, function (req, res, next) {
  gameDao.setTeam(req.game, req.user, req.body.team)
    .then(function (game) {
      res.redirect(game.getUrl());
    }, next)
    .catch(next);
});

/**
 *
 */
router.get('/add-word', attachPlayer, function (req, res, next) {
  res.render('add-word', {
    'game': req.game,
    'player': req.player,
    'user': req.user
  });
});

/**
 *
 */
router.post('/add-word', attachPlayer, function (req, res, next) {
  if (req.body.word) {
    gameDao.addWord(req.game, req.user, req.body.word)
      .then(function (game) {
        res.redirect(game.getUrl());
      }, next)
      .catch(next);
  } else {
    res.redirect(req.game.getUrl('add-word'));
  }
});

/**
 *
 */
router.get('/start-game', attachPlayer, function (req, res, next) {
  gameDao.startGame(req.game)
    .then(function (game) {
      res.redirect(game.getUrl());
    }, next)
    .catch(next);
});

/**
 *
 */
router.get('/next-team', attachPlayer, function (req, res, next) {
  gameDao.nextTeam(req.game)
    .then(function (game) {
      res.redirect(game.getUrl());
    }, next)
    .catch(next);
});

/**
 *
 */
router.get('/correct-word', attachPlayer, function (req, res, next) {
  gameDao.correctWord(req.game)
    .then(function (game) {
      res.redirect(game.getUrl());
    }, next)
    .catch(next);
});

/**
 *
 */
router.get('/skip-word', attachPlayer, function (req, res, next) {
  gameDao.skipWord(req.game)
    .then(function (game) {
      res.redirect(game.getUrl());
    }, next)
    .catch(next);
});

/**
 *
 */
router.get('/start-round', attachPlayer, function (req, res, next) {
  gameDao.startRound(req.game)
    .then(function (game) {
      res.redirect(game.getUrl());
    }, next)
    .catch(next);
});


exports.init = function (app) {
  app.use('/:gameId([\\w-]{7,14})', router);
};

