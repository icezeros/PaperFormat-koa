'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('User');
const Logs = mongoose.model('Logs');
// const ccap = require('ccap')();
const config = require('../../config/env');

/**
 * 获取验证码
 */

// exports.getCaptcha = function*() {
// 	const ary = ccap.get();
// 	const txt = ary[0];
// 	const buf = ary[1];
// 	this.session.captcha = txt;
// 	this.status = 200;
// 	this.body = buf;
// }


/**
 * 用户注册
 */
exports.register = function*() {
	const email = this.request.body.email ? this.request.body.email.replace(/(^\s+)|(\s+$)/g, "") : '';
	const password = this.request.body.password ? this.request.body.password : '';
	const repeatpassword = this.request.body.repeatpassword ? this.request.body.repeatpassword : '';
	const EMAIL_REGEXP = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;

	const error_msg = {
		email: null,
		password: null,
		repeatpassword: null,
		result: null
	};

	let error_bool = false;

	if (email === '') {
		error_msg.email = "邮箱地址不能为空";
		error_bool = true;
	} else if (email.length <= 4 || email.length > 30 || !EMAIL_REGEXP.test(email)) {
		error_msg.email = "邮箱地址不合法";
		error_bool = true;
	} else if (password === '') {
		error_msg.password = "密码不能为空";
		error_bool = true;
	} else if (password !== repeatpassword) {
		error_msg.repeatpassword = "密码输入不一致";
		error_bool = true;
	}
	if (error_bool) {
		this.status = 422;
		return this.body = {
			error_msg: error_msg
		};
	}
	try {
		let newUser = new User();
		newUser.email = email;
		newUser.password = password;
		newUser.role = 'user';
		newUser.nickname = email;
		const user = yield newUser.save();
		yield Logs.create({
			// uid: this.req.user._id,
			content: "创建新用户 " + (user.email || user.nickname),
			type: "user"
		});
		this.status = 200;
		this.body = {
			success: true,
			user_id: user._id
		};
	} catch (err) {
		if (err.errors.email) {
			error_msg.email = err.errors.email.message;
			this.status = 500;
			return this.body = {
				error_msg: error_msg
			};
		}
		if (err.errors.nickname) {
			error_msg.email = err.errors.nickname.message;
			this.status = 500;
			return this.body = {
				error_msg: error_msg
			};
		}
		this.throw(err);
	}

}

//获取用户信息
exports.getMe = function*() {
	const userId = this.req.user._id;
	try {
		const user = yield User.findById(userId);
		this.status = 200;
		this.body = user.userInfo;
	} catch (err) {
		this.throw(err);
	}
}

// exports.changePassword = function*() {
// 		const email = this.request.body.email ? this.request.body.email.replace(/(^\s+)|(\s+$)/g, "") : '';
// 		const oldpassword = this.request.body.oldpassword ? this.request.body.oldpassword : '';
// 		const newpassword = this.request.body.newpassword ? this.request.body.newpassword : '';
// 		const error_msg = {
// 			email: null,
// 			password: null,
// 			repeatpassword: null,
// 			result: null
// 		};

// 		let error_bool = false;

// 		const user = yield User.findOne({
// 			email: email.toLowerCase()
// 		});

// 		if (!user) {
// 			error_msg.email = "用户名错误"
// 			this.status = 400;
// 			this.body = {
// 				success: false,
// 				error_msg: error_msg,
// 			};
// 		}

// 		if (!user.authenticate(oldpassword)) {
// 			error_msg.email = "密码错误";
// 			this.status = 200;
// 			this.body = {
// 				success: false,
// 				error_msg: error_msg,
// 			}

// 			try {
// 				let newUser = new User();
// 				newUser.email = email;
// 				newUser.password = password;
// 				newUser.role = 'user';
// 				newUser.nickname = email;
// 				const user = yield newUser.save();
// 				yield Logs.create({
// 					// uid: this.req.user._id,
// 					content: "创建新用户 " + (user.email || user.nickname),
// 					type: "user"
// 				});
// 				this.status = 200;
// 				this.body = {
// 					success: true,
// 					user_id: user._id
// 				};
// 			} catch (err) {
// 				if (err.errors.email) {
// 					error_msg.email = err.errors.email.message;
// 					this.status = 500;
// 					return this.body = {
// 						error_msg: error_msg
// 					};
// 				}
// 				if (err.errors.nickname) {
// 					error_msg.email = err.errors.nickname.message;
// 					this.status = 500;
// 					return this.body = {
// 						error_msg: error_msg
// 					};
// 				}
// 				this.throw(err);
// 			}


// 		}