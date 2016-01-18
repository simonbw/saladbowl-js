var shortid = require('shortid');

/**
 * Guarantee user.
 */
module.exports = function (req, res, next) {
  req.username = req.cookies.username;
  if (req.cookies.user) {
    req.user = req.cookies.user;
  } else {
    req.user = shortid.generate();
    var maxAge = 24 * 60 * 60 * 1000; // one day
    res.cookie('user', req.user, {maxAge: maxAge});
  }
  next();
};