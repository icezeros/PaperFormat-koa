/**
 * 用户表
 */
'use strict';


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

let UserSchema = new Schema({

	email: {
		type: String,
		lowercase: true
	},
	nickname: {
		type: String,
		require: false
	},
	hashedPassword: String,
	provider: {
		type: String,
		default: 'local'
	},
	salt: String,
	role: {
		type: String,
		default: 'user'
	},
	status: {
		type: String,
		default: 0
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	weibo: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	qq: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	wechart: {
		id: String,
		token: String,
		email: String,
		name: String
	}

});


/**
 * Virtuals
 */
UserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function() {
		return this._password;
	});

UserSchema
	.virtual('userInfo')
	.get(function() {
		return {
			'nickname': this.nickname,
			'role': this.role,
			'email': this.email,
			'provider': this.provider
		};
	});

UserSchema
	.virtual('providerInfo')
	.get(function() {
		return {
			'qq': this.qq,
			'weibo': this.weibo,
			'wechart': this.wechart
		};
	});


UserSchema
	.virtual('token')
	.get(function() {
		return {
			'_id': this._id,
			'role': this.role
		};
	});

/**
 * 验证
 */
UserSchema
	.path('nickname')
	.validate(function(value, respond) {
		var self = this;
		this.constructor.findOne({
			nickname: value
		}, function(err, user) {
			if (err) throw err;
			if (user) {
				if (self.id === user.id) return respond(true);
				return respond(false);
			}
			respond(true);
		});
	}, '这个呢称已经被使用.');

UserSchema
	.path('email')
	.validate(function(value, respond) {
		var self = this;
		this.constructor.findOne({
			email: value
		}, function(err, user) {
			if (err) throw err;
			if (user) {
				return respond(false);
			}
			respond(true);
		});
	}, '该邮箱已经注册过，请直接登录');



/**
 * 方法
 */

UserSchema.methods = {
	//检查用户权限
	hasRole: function(role) {
		var selfRoles = this.role;
		return (selfRoles.indexOf('admin') !== -1 || selfRoles.indexOf(role) !== -1);
	},

	//生成盐
	makeSalt: function() {
		return crypto.randomBytes(16).toString('base64');
	},
	encryptPassword: function(password) {
		if (!password || !this.salt) return '';
		var salt = new Buffer(this.salt, 'base64');
		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('BASE64');
	},

	//验证用户密码
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashedPassword;
	}
}

UserSchema.set('toObject', {
	virtuals: true
});

module.exports = mongoose.model('User', UserSchema);