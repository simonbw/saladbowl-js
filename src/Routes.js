var express = require('express');

var apiRoutes = require('./ApiRoutes');

var router = express.Router();
module.exports = router;

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/how-to-play', function (req, res, next) {
  res.render('how-to-play');
});

router.get('/game', function (req, res, next) {
  res.render('game');
});

router.use('/api', apiRoutes);


