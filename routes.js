var router = require('koa-router')();
var auth = require('./middlewares/auth');
var users = require('./API/users');



module.exports = function(app) {
	router.use('/api/auth', auth.routes(), auth.allowedMethods());
	router.use('/api/users', users.routes(), users.allowedMethods());



	app.use(router.routes());
}