var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var util = require('util');
var partials = require('express-partials');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var fs = require('fs');

//mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.get('mongo.uri'));

var async = require('async');
var users = db.get('users')
var mailer = require('./app_modules/mailer');

var paidVersionIntroTemplate = fs.readFileSync(path.join(__dirname,'./views/emails/paid-version-intro.ejs'), 'utf8');

async.waterfall([
	function(callback){
		users.find({unsubscribes:{$exists:false}},function(err,allUsers){
			callback(err,allUsers)
		})
	},
	function(allUsers,callback){
console.log('got %s users',allUsers.length)
		mailer.sendMulti(
			allUsers, //recipients
			'[' + config.get('app.name') + '] Introducing GitMonkey Paid Version',
			paidVersionIntroTemplate,
			{
			},
			'paid-version-intro',
			function(err){
				callback(err)
			}

		);
	}
],function(err){
	console.log('err is %s',err)
})
