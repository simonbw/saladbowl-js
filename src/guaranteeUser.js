var shortid = require('shortid');

/**
 * Guarantee user.
 */
module.exports = function (req, res, next) {
  req.username = req.cookies.username;
  if (req.cookies.userId) {
    req.userId = req.cookies.userId;
  } else {
    req.userId = shortid.generate();
    var maxAge = 24 * 60 * 60 * 1000; // one day
    res.cookie('userId', req.userId, {maxAge: maxAge});
  }
  next();
};