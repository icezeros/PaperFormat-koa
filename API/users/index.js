'use strict';

const router = require("koa-router")();
const controller = require('./user.controller');
const auth = require('../../middlewares/auth/auth.service');


router.post('/register', controller.register);
router.get('/me', auth.isAuthenticated(), controller.getMe);

module.exports = router;