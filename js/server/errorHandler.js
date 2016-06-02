'use strict';
// @flow


function debugHandler (err:Error, req:Request, res:Response, next:Next) {
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
}

function productionHandler (err:Error, req:Request, res:Response, next:Next) {
  res.status(err.status || 500);
  if (req.xhr) {
    res.send({message: err.message});
  } else {
    res.render('error', {
      message: err.message,
      error: {}
    });
  }
}

/**
 * Choose which error handler to use.
 * @param app
 */
module.exports = (app:Map<string, any>) => {
  if (app.get('env') === 'development') {
    return debugHandler;
  } else {
    return productionHandler;
  }
};