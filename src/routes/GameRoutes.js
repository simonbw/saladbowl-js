var express = require('express');

var gameDao = require('../data/GameDAO').instance;
var RequestError = require('../RequestError');

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
          throw new RequestError('Could not find game: ' + req.params['gameId'], 404);
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
      var error = new Error('You must join the game to complete that action.');
      error.status = 403;
      throw error;
    } else {
      res.redirect(req.game.getUrl('join'));
    }
  }
};

/**
 * Attach a new function to response.
 */
router.use('/', function (req, res, next) {
  res.sendGame = function (game) {
    res.send({
      'game': game,
      'serverTime': Date.now(),
      'user': req.user
    });
  };
  next();
});

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
        phase: game.phases[game.currentPhaseIndex],
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
 * Time waiting between polling database.
 * @type {number}
 */
var POLL_DELAY = 100;

/**
 * Get json of the game.
 * If req.query.lastUpdate is set, will wait to send game until a newer one is found.
 */
router.get('/json', function (req, res, next) {
  var lastUpdate = parseInt(req.query['lastUpdatedAt']) || 0;
  if (req.game.lastUpdatedAt > lastUpdate) {
    res.sendGame(req.game);
  } else {
    var waitAndSend = function () {
      gameDao.fromId(req.params['gameId'])
        .then(function (game) {
          if (game.lastUpdatedAt > lastUpdate) {
            setTimeout(function () {
              res.sendGame(game);
            }, 1);
          } else {
            setTimeout(waitAndSend, POLL_DELAY);
          }
        }, next)
        .catch(next);
    };
    setTimeout(waitAndSend, POLL_DELAY);
  }
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
router.get('/delete', attachPlayer, function (req, res, next) {
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
      res.sendGame(game);
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
router.post('/start-game', attachPlayer, function (req, res, next) {
  gameDao.startGame(req.game)
    .then(function (game) {
      res.sendGame(game);
    }, next)
    .catch(next);
});


/**
 *
 */
router.post('/correct-word', attachPlayer, function (req, res, next) {
  if (req.body.word !== req.game.currentWord) {
    res.sendGame(req.game);
  } else {
    gameDao.correctWord(req.game)
      .then(function (game) {
        res.sendGame(game);
      }, next)
      .catch(next);
  }
});

/**
 *
 */
router.post('/skip-word', attachPlayer, function (req, res, next) {
  if (req.body.word !== req.game.currentWord) {
    res.sendGame(req.game);
  } else {
    gameDao.skipWord(req.game)
      .then(function (game) {
        res.sendGame(game);
      }, next)
      .catch(next);
  }
});

/**
 *
 */
router.post('/start-round', attachPlayer, function (req, res, next) {
  if (req.user != req.player.id) {
    res.sendGame(req.game);
  } else {
    gameDao.startRound(req.game)
      .then(function (game) {
        res.sendGame(game);
      }, next)
      .catch(next);
  }
});


/**
 */
router.get('/next-team', attachPlayer, function (req, res, next) {
  gameDao.nextTeam(req.game)
    .then(function (game) {
      if (req.xhr) {
        res.sendGame(game);
      } else {
        res.redirect(game.getUrl());
      }
    }, next)
    .catch(next);
});


exports.init = function (app) {
  app.use('/:gameId([\\w-]{7,14})', router);
};

