'use strict';

import shortid from 'shortid';

const COOKIE_AGE = 24 * 60 * 60 * 1000; // one day

/**
 * Guarantee user.
 */
export default (req, res, next) => {
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
