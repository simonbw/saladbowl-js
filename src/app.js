var bodyParser = require('body-parser');
var browserify = require('browserify-middleware');
var cookieParser = require('cookie-parser');
var express = require('express');
var favicon = require('serve-favicon');
var hbs = require('hbs');
var logger = require('morgan');
var path = require('path');
var sass = require('node-sass-middleware');

var errorHandler = require('./errorHandler');
var GameSocket = require('./socket/GameSocket');
var guaranteeUser = require('./guaranteeUser');
var routes = require('./Routes');

var app = express();

// Paths
var projectPath = path.join(__dirname, '..');
var staticAssetsPath = path.join(projectPath, 'public');
var faviconPath = path.join(staticAssetsPath, 'images', 'favicon.png');
var scssDestPath = path.join(staticAssetsPath, 'css');
var scssSourcePath = path.join(projectPath, 'styles');
var webSourcePath = path.join(projectPath, 'web');
var templatesPath = path.join(projectPath, 'templates');

// Urls
var cssUrl = '/css';
var jsUrl = '/js';

// view engine setup
app.set('views', templatesPath);
hbs.registerPartials(templatesPath);
app.set('view engine', 'hbs');

// 3rd Party middleware
app.use(logger('dev', {
  skip: function (req, res) {
    return res.statusCode < 400;
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(staticAssetsPath));
app.use(favicon(faviconPath));
app.use(jsUrl, browserify(webSourcePath, {'transform': ['reactify']}));
app.use(sass({src: scssSourcePath, dest: scssDestPath, prefix: cssUrl, debug: false, sourceMap: true}));

// My middleware
app.use(guaranteeUser);
app.use(routes);
app.use(errorHandler(app));

app.initIo = function (io) {
  app.io = io;
  // Bind cookies to socket.request.cookies
  var ioCookieParser = cookieParser();
  io.use(function (socket, next) {
    return ioCookieParser(socket.request, null, next);
  });
  GameSocket.init(io);
};

module.exports = app;
