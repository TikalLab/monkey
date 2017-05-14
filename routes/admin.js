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
var us = require('underscore.string');
var async = require('async');
var slug = require('slug')
var basicAuth = require('basic-auth');

var loginEnforcer = require('../app_modules/login-enforcer')
var errorHandler = require('../app_modules/error');
var unsubscriber = require('../app_modules/unsubscriber');
// var configurations = require('../app_modules/configurations');
var github = require('../app_modules/github');
var alertIcons = require('../app_modules/alert-icons');
var paypal = require('../app_modules/paypal');

var plans = require('../models/plans');
var users = require('../models/users');
var scans = require('../models/scans');
var scanItems = require('../models/scan-items');
var localScans = require('../models/local-scans');
var pushScans = require('../models/push-scans');
var approvedKeys = require('../models/approved-keys');

var auth = function (req, res, next) {
	function unauthorized(res) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(401);
	};

	var user = basicAuth(req);

	if (!user || !user.name || !user.pass) {
		return unauthorized(res);
	};

	if (user.name === config.get('auth.username') && user.pass === config.get('auth.password')) {
		return next();
	}else{
		return unauthorized(res);
	};
};

router.get('/',auth,function(req,res,next){
	render(req,res,'admin/index',{})
})

router.get('/crm',auth,function(req,res,next){

	async.parallel([
		function(callback){
			users.getAll(req.db,function(err,users){
				callback(err,users)
			})
		},
	],function(err,results){
		if(err){
			errorHandler.error(req,res,next,err);
		}else{
			render(req,res,'admin/crm',{
				users: results[0],
				active_page: 'crm'
			})
		}
	})
})

router.get('/crm/search',auth,function(req,res,next){
	async.waterfall([
		function(callback){
			users.getByEmail(req.db,req.query.email,function(err,user){
				callback(err,user)
			})
		},
	],function(err,user){
		if(err){
			errorHandler.error(req,res,next,err);
		}else if(!user){
			req.session.alert = {
				type: 'danger',
				message: util.format('couldnt find a user with email %s',req.query.email)
			}
			res.redirect('/admin/crm')
		}else{
			res.redirect(util.format('/admin/crm/user/%s',user._id))
		}
	})
})

router.get('/crm/user/:user_id',auth,function(req,res,next){
	async.parallel([
		function(callback){
			users.get(req.db,req.params.user_id,function(err,user){
				callback(err,user)
			})
		},
		function(callback){
			localScans.getPerUser(req.db,req.params.user_id,function(err,localScans){
				callback(err,localScans)
			})
		},
		function(callback){
			pushScans.getPerUser(req.db,req.params.user_id,function(err,pushScans){
				callback(err,pushScans)
			})
		},
	],function(err,results){
		if(err){
			errorHandler.error(req,res,next,err);
		}else{
			render(req,res,'admin/user',{
				user: results[0],
				local_scans: results[1],
				push_scans: results[2],
				active_page: 'crm'
			})
		}
	})
})

router.post('/add-billing-plan',auth,function(req,res,next){
	async.waterfall([
		function(callback){
			paypal.createAndActivatePlan(req.body.name,req.body.description,req.body.price,req.body.currency,function(err,paypalBillingPlan){
				callback(err,paypalBillingPlan)
			})
		},
		function(paypalBillingPlan,callback){
			plans.add(req.db,req.body.name,req.body.description,req.body.frequency_type,req.body.frequency_interval,req.body.full_scans_per_month,req.body.push_scans_per_month,req.body.price,req.body.currency,(req.body.is_featured ? true : false),paypalBillingPlan.id,function(err,plan){
				callback(err,paypalBillingPlan,plan)
			})
		},
	],function(err,paypalBillingPlan,plan){
		if(err){
 			errorHandler.error(req,res,next,err);
 		}else{
			req.session.alert = {
				type: 'success',
				message: util.format('billing plan added successfuly. Paypal ID is %s, our ID is %s',paypalBillingPlan.id,plan._id)
			}
			res.redirect('/admin/billing-plans')
		}
	})
})

router.get('/add-billing-plan',auth,function(req,res,next){
	render(req,res,'admin/add-billing-plan',{
		active_page: 'billing_plans'
	})
})

router.get('/billing-plans',auth,function(req,res,next){
	plans.getAll(req.db,function(err,plans){
		if(err){
			errorHandler.error(req,res,next,err);
		}else{
			render(req,res,'admin/billing-plans',{
				plans: plans,
				active_page: 'billing_plans'
			})
		}
	})
})

function render(req,res,template,params){

//	params.user = req.session.user;
//	params.alert = req.session.alert;
//	delete req.session.alert;

	params.app = req.app;
	params._ = _;
	params.us = us;
	params.moment = moment;
	params.appConfig = config;
	params.config = config;
	params.slug = slug;
	params.util = util;

	params.alertIcons = alertIcons;
	params.alert = req.session.alert;
	delete req.session.alert;


	if(!('active_page' in params)){
		params.active_page = false;
	}

	if(!('isHomepage' in params)){
		params.isHomepage = false;
	}

	res.render(template,params);
}
module.exports = router;
