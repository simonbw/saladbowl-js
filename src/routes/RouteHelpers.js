var shortid = require('shortid');

/**
 * Provides helper middleware.
 */
module.exports = {
  /**
   * Attach the user or make a new one.
   * @param req
   * @param res
   * @param next
   */
  attachUser: function (req, res, next) {
    if (req.cookies.user) {
      req.user = req.cookies.user;
      console.log('Returning user', req.user);
    } else {
      req.user = shortid.generate();
      res.cookie('user', req.user);
      console.log('New user');
    }
    next();
  }
};