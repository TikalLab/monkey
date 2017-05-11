var express = require('express');
var router = express.Router();
var util = require('util');
var config = require('config');
var url = require('url');
var async = require('async');
var request = require('request');
var _ = require('underscore');
var moment = require('moment')
// var github = require('../app_modules/github');

var users = require('../models/users');
var paypal = require('../app_modules/paypal');


router.post('/webhook',function(req,res,next){
	// console.log(util.inspect(req.body))

	paypal.verifyWebhook(req,function(err){
		if(err){
			res.sendStatus(503);
			console.log('error verifing paypal webbhoook: %s',err)
		}else{
			switch(req.body.event_type){
				case 'BILLING.SUBSCRIPTION.CANCELLED':
					processBillingSubscriptionCancelled(req.db,req.body,function(err){
						if(err){
							console.log('err in processBillingSubscriptionCancelled: %s',util.inspect(err))
							res.sendStatus(503)
						}else{
							res.sendStatus(200)
						}
					})
					break;
				case 'BILLING.SUBSCRIPTION.SUSPENDED':
					processBillingSubscriptionSuspended(req.db,req.body,function(err){
						if(err){
							console.log('err in processBillingSubscriptionSuspended: %s',util.inspect(err))
							res.sendStatus(503)
						}else{
							res.sendStatus(200)
						}
					})
					break;
				case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
					processBillingSubscriptionReactivated(req.db,req.body,function(err){
						if(err){
							console.log('err in processBillingSubscriptionReactivated: %s',util.inspect(err))
							res.sendStatus(503)
						}else{
							res.sendStatus(200)
						}
					})
					break;
				default:
					res.sendStatus(200)

			}
		}
	})

})

function processBillingSubscriptionCancelled(db,event,callback){
	async.waterfall([
		function(callback){
			users.cancelSubscription(db,event.resource.id,function(err,user){
				callback(err,user)
			})
		},
		function(user,callback){
			shipments.removeScheduled(db,user._id.toString(),function(err){
				callback(err)
			})
		}
	],function(err){
		callback(err)
	})

}

function processBillingSubscriptionSuspended(db,event,callback){
	async.waterfall([
		function(callback){
			users.suspendSubscription(db,event.resource.id,function(err,user){
				callback(err,user)
			})
		},
		function(user,callback){
			shipments.removeScheduled(db,user._id.toString(),function(err){
				callback(err)
			})
		}
	],function(err){
		callback(err)
	})
}

function processBillingSubscriptionReactivated(db,event,callback){
	async.waterfall([
		function(callback){
			users.reactivateSubscription(db,event.resource.id,function(err,user){
				callback(err,user)
			})
		},
		function(user,callback){
			shipments.schedule(db,user._id.toString(),new Date(),function(err){
				callback(err)
			})
		}
	],function(err){
		callback(err)
	})
}

module.exports = router;
