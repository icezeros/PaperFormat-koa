'use strict';

const path = require("path");
const session = require("koa-generic-session");
const MongoStore = require("koa-generic-session-mongo");
const responseTime = require("koa-response-time");
const logger = require("koa-logger");
const json = require('koa-json')
const compress = require("koa-compress");
const bodyParser = require("koa-bodyparser");
const cors = require('koa-cors');
const passport = require('koa-passport');
const config = require('./env');


const staticServer = require('koa-static');
const render = require('koa-ejs');


module.exports = function(app) {
  if (app.env === 'development') {
    app.use(logger());
  }
  app.use(cors({
    origin: true,
    credentials: true
  }));

  app.use(staticServer(path.join(__dirname, '../public')));



  app.use(bodyParser());
  app.use(json());
  app.keys = [config.session.secrets];
  app.use(session({
    key: "jackblog.sid",
    store: new MongoStore(config.mongo),
    cookie: config.session.cookie
  }));
  app.use(passport.initialize());


  render(app, {
    root: path.join(__dirname, '../views'),
    layout: '__layout',
    viewExt: 'html',
    cache: false,
    debug: true
  });
  app.use(function*() {
    yield this.render('index', {
      layout: false
    });
  });


  app.use(compress());
  app.use(responseTime());
};