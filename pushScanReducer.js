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


//mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.get('mongo.uri'));

var async = require('async');
var pushScans = db.get('push_scans')

async.waterfall([
	function(callback){
		pushScans.find({},function(err,allPushScans){
			console.log('found %s push scans',allPushScans.length)
			callback(err,allPushScans)
		})
	},
	function(allPushScans,callback){
		async.eachLimit(allPushScans,10,function(pushScan,callback){

			var updateSet = {
					commits: pushScan.push.commits,
					repository: {
						id: pushScan.push.repository.id,
						name: pushScan.push.repository.name,
						owner: {
							login: pushScan.push.repository.owner.login
						}
					},
					sender: {
						login: pushScan.push.sender.login,
						id: pushScan.push.sender.id
					},
			};

			if('installation' in pushScan.push){
				updateSet['installation'] = {id: pushScan.push.installation.id}
			}

			pushScans.findOneAndUpdate({
				_id: pushScan._id
			},{
				$set: {
					push: updateSet
				}
			},{
				new: true
			},function(err,pushScan){

				if(err){
					callback(err)
				}else{
					console.log('updated push %s',pushScan._id)
					callback()
				}
			})
		},function(err){
			callback(err)
		})
	}
],function(err){
	console.log('err is %s',err)
})
