var shortid = require('shortid');

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
    var maxAge = 24 * 60 * 60 * 1000; // one day
    res.cookie('userId', req.userId, {maxAge: maxAge});
  }
  next();
};