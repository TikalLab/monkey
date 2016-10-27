var express = require('express');
var router = express.Router();
var async = require('async');
var config = require('config');
var moment = require('moment');
var request = require('request');

var util = require('util');
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
var _ = require('underscore');
var async = require('async');

var loginEnforcer = require('../app_modules/login-enforcer')
var errorHandler = require('../app_modules/error');
// var unsubscriber = require('../app_modules/unsubscriber');
// var configurations = require('../app_modules/configurations');
var github = require('../app_modules/github');

var scans = require('../models/scans');
var scanItems = require('../models/scan-items');
var localScans = require('../models/local-scans');

router.get('/',function(req, res, next) {
	if(req.session.user){
		res.redirect('/dashboard');
	}else{
		render(req,res,'index/homepage',{
			isHomepage: true
		});

	}
})

router.get('/dashboard',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.parallel([
			function(callback){
				if('github' in req.session.user){
					github.getUserOrgs(req.session.user.github.access_token,function(err,orgs){
						callback(err,orgs)
					})
				}else{
					callback(null,null)
				}
			}
		],function(err,results){
			render(req,res,'index/dashboard',{
				githubOrgs: results[0]
			})

		})
	})
})

router.get('/logout',function(req, res, next) {
	delete req.session.user;
	res.redirect('/');
})

router.get('/reconnect',function(req, res, next) {
	render(req,res,'index/reconnect',{})
})

router.get('/scan-org/:org_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		github.scanOrg(req.session.user.github.access_token,req.params.org_name,function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				console.log('grand scan results are: %s',util.inspect(results))
				render(req,res,'index/scan-results',{
					org_name: req.params.org_name,
					results: results
				})

			}
		})
	})
})

router.get('/build-org-scan/:org_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.waterfall([
			function(callback){
				github.buildOrgScan(req.session.user.github.access_token,req.params.org_name,function(err,results){
					callback(err,results)
				})
			},
			function(items,callback){
				scans.create(req.session.user._id.toString(),'github',items.length,req.db,function(err,scan){
					console.log('created scan: %s',util.inspect(scan))
					callback(err,items,scan)
				})
			},
			function(items,scan,callback){
				async.each(items,function(item,callback){
					console.log('will log item: %s',item.sha)
					scanItems.create(scan._id.toString(),req.session.user._id.toString(),'github',item,req.db,function(err,scanItem){
						console.log('logged item %s',item.sha)
						callback(err)
					})
				},function(err){
					callback(err,items,scan)
				})
			}
		],function(err,items,scan){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				render(req,res,'index/build-org-scan',{
					org_name: req.params.org_name,
					scan: scan
				})
			}
		})

	})
})

router.get('/scan-org-locally/:org_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		github.scanOrgLocally(req.session.user.github.access_token,req.params.org_name,function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				console.log('grand scan results are: %s',util.inspect(results))
				render(req,res,'index/local-scan-results',{
					org_name: req.params.org_name,
					results: results
				})

			}
		})
	})
})

router.get('/build-local-org-scan/:org_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.waterfall([
			function(callback){
				localScans.create(req.session.user._id.toString(),req.params.org_name,'github',req.db,function(err,scan){
					console.log('created scan: %s',util.inspect(scan))
					callback(err,scan)
				})
			},
		],function(err,scan){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				render(req,res,'index/build-local-org-scan',{
					scan: scan
				})
			}
		})

	})
})

router.get('/scan/:scan_id',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		scans.getFull(req.session.user._id.toString,req.params.scan_id,req.db,function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				console.log('grand scan results are: %s',util.inspect(results,{depth:8}))
				render(req,res,'index/scan',{
					org_name: req.params.org_name,
					results: results
				})

			}
		})
	})
})

router.get('/local-scan/:local_scan_id',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		localScans.get(req.db,req.session.user._id.toString(),req.params.local_scan_id,function(err,localScan){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				render(req,res,'index/local-scan',{
					local_scan: localScan
				})

			}
		})
	})
})

router.get('/hook-org/:org_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.waterfall([
			function(callback){
				github.hookOrg(req.session.user.github.access_token,req.params.org_name,function(err,hook){
					callback(err,hook)
				})
			},
			function(hook,callback){
				var users = req.db.get('users');
				users.findAndModify({
					_id: req.session.user._id
				},{
					$addToSet:{
						'hooks.orgs': {
							org_name: req.params.org_name,
							hook_id: hook.id
						}
					}
				},{
					new: true
				},function(err,user){
					callback(err,user)
				});
			}
		],function(err,user){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				req.session.user = user;
				res.redirect('/dashboard')

			}

		})
	})
})

function render(req,res,template,params){

//	params.user = req.session.user;
//	params.alert = req.session.alert;
//	delete req.session.alert;

	params.app = req.app;
	params._ = _;
	params.moment = moment;
	params.appConfig = config;
	params.config = config;

	params.user = req.session.user;

	if(!('active_page' in params)){
		params.active_page = false;
	}

	if(!('isHomepage' in params)){
		params.isHomepage = false;
	}

	res.render(template,params);
}
module.exports = router;
