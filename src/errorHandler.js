/**
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
var debugHandler = function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);
  if (req.xhr) {
    res.send(err);
  } else {
    res.render('error', {
      message: err.message,
      error: err
    });
  }
};

/**
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
var productionHandler = function (err, req, res, next) {
  res.status(err.status || 500);
  if (req.xhr) {
    res.send({message: err.message});
  } else {
    res.render('error', {
      message: err.message,
      error: {}
    });
  }
};

/**
 * Choose which error handler to use.
 * @param app
 */
module.exports = function (app) {
  if (app.get('env') === 'development') {
    return debugHandler;
  } else {
    return productionHandler;
  }
};