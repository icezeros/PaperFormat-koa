'use strict'

var path = require('path');
var lodash = require('lodash');
var fs = require('fs');

var all = {
	env: process.env.NODE_ENV,
	port: process.env.PORT || 9000,
	mongo: {
		options: {
			db: {
				safe: true
			}
		},
	},
	session: {
		secrets: 'jackblog-secret',
	},



}

var config = lodash.merge(all, require('./' + process.env.NODE_ENV + '.JS') || {});

module.exports = config;