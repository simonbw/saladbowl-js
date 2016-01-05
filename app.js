var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var hbs = require('hbs');
var logger = require('morgan');
var path = require('path');
var sass = require('node-sass-middleware');

var helpers = require('./shared/helpers');
var db = require('./src/db');
var routes = require('./src/routes/Routes');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
hbs.registerPartials(path.join(__dirname, 'templates'));
app.set('view engine', 'hbs');
helpers.registerAll(hbs.handlebars);

app.use(sass({
  src: path.join(__dirname, 'styles'),
  dest: path.join(__dirname, 'public', 'css'),
  prefix: '/css',
  debug: false,
  sourceMap: true
}));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use('/js', browserify('./web'));
app.use(express.static(path.join(__dirname, 'public')));


routes.init(app);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log('Development Version');
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    if (req.xhr) {
      res.send(err)
    } else {
      res.render('error', {
        message: err.message,
        error: err
      });
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
