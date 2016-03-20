var shortid = require('shortid');

var COOKIE_AGE = 24 * 60 * 60 * 1000; // one day

/**
 * Guarantee user.
 */
module.exports = function (req, res, next) {
  req.user = {};
  req.user.name = req.cookies.username;
  if (req.cookies.userId) {
    req.user.id = req.cookies.userId;
  } else {
    req.user.id = shortid.generate();
    res.cookie('userId', req.user.id, {maxAge: COOKIE_AGE});
  }
  next();
};