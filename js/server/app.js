'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const logger = require('morgan');
const path = require('path');

const errorHandler = require('./errorHandler');
const GameSocket = require('./socket/GameSocket');
const guaranteeUser = require('./guaranteeUser');
const routes = require('./Routes');

const app = express();

// Paths
const projectPath = path.join(__dirname, '..', '..');
const staticAssetsPath = path.join(projectPath, 'public');
const faviconPath = path.join(staticAssetsPath, 'images', 'favicon.png');
const scssDestPath = path.join(staticAssetsPath, 'css');
const scssSourcePath = path.join(projectPath, 'styles');
const webSourcePath = path.join(projectPath, 'js', 'web');
const templatesPath = path.join(projectPath, 'templates');

// Urls
const cssUrl = '/css';

// view engine setup
app.set('views', templatesPath);
hbs.registerPartials(templatesPath);
app.set('view engine', 'hbs');

// 3rd Party middleware
app.use(logger('dev', {
  'skip': (req, res) => {
    return res.statusCode < 400;
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(favicon(faviconPath));
app.use(express.static(staticAssetsPath));
app.use(express.static(path.join(projectPath, 'dist')));

// My middleware
app.use(guaranteeUser);
app.use(routes);
app.use(errorHandler(app));

app.initIo = (io) => {
  app.io = io;
  // Bind cookies to socket.request.cookies
  const ioCookieParser = cookieParser();
  io.use((socket, next) => {
    return ioCookieParser(socket.request, null, next);
  });
  GameSocket.init(io);
};

module.exports = app;
