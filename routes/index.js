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

// var loginEnforcer = require('../app_modules/login-enforcer')
var errorHandler = require('../app_modules/error');
// var unsubscriber = require('../app_modules/unsubscriber');
// var configurations = require('../app_modules/configurations');
// var github = require('../app_modules/github');


router.get('/',function(req, res, next) {
	if(req.session.user){
		res.redirect('/dashboard');
	}else{
		render(req,res,'index/homepage',{
		});

	}
})

function render(req,res,template,params){

//	params.user = req.session.user;
//	params.alert = req.session.alert;
//	delete req.session.alert;

	params.app = req.app;
	params._ = _;
	params.moment = moment;
	params.appConfig = config;

	res.render(template,params);
}
module.exports = router;
