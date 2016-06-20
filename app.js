'use strict'

// 设置默认环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const path = require('path');
const fs = require('fs');
const app = require('koa')();

const mongoose = require('mongoose');
const config = require('./config/env');
const onerror = require('koa-onerror');

const router = require('koa-router')();

//连接数据库
mongoose.connect(config.mongo.uri, config.mongo.options);
const modelsPath = path.join(__dirname, 'model');
fs.readdirSync(modelsPath).forEach(function(file) {
	if (/(.*)\.(js$|coffee$)/.test(file)) {
		require(modelsPath + '/' + file);
	}
});


onerror(app);
require('./config/koa')(app);
require('./routes')(app);



app.listen(config.port, function() {
	console.log('Koa server listening on %d, in %s mode', config.port, app.env);
});

module.exports = app;



// const logger = require('koa-logger');
// const json = require('koa-json');
// const views = require('koa-views');


// const index = require('./routes/index');
// const users = require('./routes/users');

// global middlewares
// app.use(views('views', {
//   root: __dirname + '/views',
//   default: 'jade'
// }));
// app.use(require('koa-bodyparser')());
// app.use(json());
// app.use(logger());

// app.use(function *(next){
//   var start = new Date;
//   yield next;
//   var ms = new Date - start;
//   console.log('%s %s - %s', this.method, this.url, ms);
// });

// app.use(require('koa-static')(__dirname + '/public'));

// routes definition
// koa.use('/', index.routes(), index.allowedMethods());
// koa.use('/users', users.routes(), users.allowedMethods());

// // mount root routes  
// app.use(koa.routes());

// app.on('error', function(err, ctx) {
//   log.error('server error', err, ctx);
// });

// module.exports = app;