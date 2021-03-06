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

var loginEnforcer = require('../app_modules/login-enforcer')
var errorHandler = require('../app_modules/error');
var unsubscriber = require('../app_modules/unsubscriber');
// var configurations = require('../app_modules/configurations');
var github = require('../app_modules/github');
var alertIcons = require('../app_modules/alert-icons');
var paypal = require('../app_modules/paypal');

var scans = require('../models/scans');
var scanItems = require('../models/scan-items');
var localScans = require('../models/local-scans');
var pushScans = require('../models/push-scans');
var approvedKeys = require('../models/approved-keys');
var users = require('../models/users');
var plans = require('../models/plans');

router.get('/',function(req, res, next) {
	if(req.session.user){
		res.redirect('/dashboard');
	}else{
		async.waterfall([
			function(callback){
				plans.getFeatured(req.db,function(err,plans){
					callback(err,plans)
				})
			}
		],function(err,plans){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				render(req,res,'index/homepage',{
					isHomepage: true,
					plans: plans
				});
			}
		})

	}
})

router.get('/reload-user',function(req, res, next) {
	users.get(req.db,req.session.user._id.toString(),function(err,user){
		if(err){
			console.log('err in reload user: %s',err)
			res.sendStatus(500)
		}else{
			req.session.user = user;
			res.json(user)
		}
	})
})

router.get('/install-integration',function(req, res, next) {
		render(req,res,'index/install-integration',{

		})
})

router.get('/tos',function(req, res, next) {
		render(req,res,'index/tos',{

		})
})

router.get('/thank-you',function(req, res, next) {
	async.waterfall([
		function(callback){
			plans.get(req.db,req.session.user.subscription.plan.ours,function(err,plan){
				callback(err,plan)
			})
		}
	],function(err,plan){
		if(err){
			errorHandler.error(req,res,next,err)
		}else{
			render(req,res,'index/thank-you',{
				plan: plan
			})
		}
	})

})

router.get('/pricing',function(req, res, next) {
	async.waterfall([
		function(callback){
			plans.getFeatured(req.db,function(err,plans){
				callback(err,plans)
			})
		}
	],function(err,plans){
		if(err){
			errorHandler.error(req,res,next,err)
		}else{
			render(req,res,'index/pricing',{
				plans: plans
			})
		}
	})

})

router.get('/subscribe/:plan_id',function(req,res,next){

	loginEnforcer.enforce(req,res,next,function(){
		async.waterfall([
			function(callback){
				plans.get(req.db,req.params.plan_id,function(err,plan){
					callback(err,plan)
				})
			},
			function(plan,callback){
				paypal.createBillingAgreement(plan,function(err,billingAgreement){
					callback(err,billingAgreement)
				})
			},
		],function(err,billingAgreement){
			if(err){
				errorHandler.error(req,res,next,err);
			}else{
	console.log('billing agreement is %s',util.inspect(billingAgreement))
				var redirectUrl = _.find(billingAgreement.links,function(link){
					return link.rel == 'approval_url'
				}).href;
				req.session.plan = {
					ours: req.params.plan_id,
					paypal: billingAgreement.plan.id
				}
				res.redirect(redirectUrl)

			}
		})
	})


})

router.get('/paypal/cancelled',function(req,res,next){
	render(req,res,'index/paypal-cancelled',{})
})

router.get('/paypal/paid',function(req,res,next){
	async.waterfall([
		function(callback){
			paypal.executeAgreement(req.query.token,function(err,billingAgreement){
				callback(err,billingAgreement)
			})
		},
		function(billingAgreement,callback){
console.log('aggremnt: %s',util.inspect(billingAgreement,{depth:8}))
			users.subscribePaypal(req.db,req.session.user._id,req.session.plan,billingAgreement,function(err,user){
				callback(err,user)
			})
		},
	],function(err,user){
		if(err){
			errorHandler.error(req,res,next,err);
		}else{
			delete req.session.plan;
			req.session.user = user;
			res.redirect('/thank-you')
		}
	})
})



router.get('/goto-install-integration',function(req, res, next) {
		delete req.session.user;
		res.redirect(config.get('github.integration_url'))
})

router.get('/connect-scm',function(req, res, next) {
		render(req,res,'index/connect-scm',{

		})
})

router.get('/connect-gmail',function(req, res, next) {
		render(req,res,'index/connect-gmail',{

		})
})

router.get('/dashboard',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){
		render(req,res,'users/dashboard',{
			active_page: 'dashboard'
		})
	})
})

router.get('/account',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.parallel([
			function(callback){
				localScans.getPerAccount(req.db,req.session.user._id.toString(),function(err,scans){
					callback(err,scans)
				})
			},
		],function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				render(req,res,'users/account',{
					active_page: 'user',
					scans: results[0]
				})
			}
		})



	})
})

router.get('/installation/:installation_id',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.parallel([
			function(callback){
				localScans.getPerInstallation(req.db,req.session.user._id.toString(),req.params.installation_id,function(err,scans){
					callback(err,scans)
				})
			},
			function(callback){
				pushScans.getPerInstallation(req.db,req.session.user._id.toString(),req.params.installation_id,function(err,scans){
					callback(err,scans)
				})
			},
		],function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{

				var installation = _.find(req.session.user.github.installations,function(installation){
					return installation.id == req.params.installation_id
				})

				render(req,res,'users/installation',{
					installation: installation,
					active_page: 'installation_' + req.params.installation_id,
					scans: results[0],
					push_scans: results[1]
				})
			}
		})



	})
})

router.get('/org/:org_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.parallel([
			function(callback){
				localScans.getPerOrg(req.db,req.session.user._id.toString(),req.params.org_name,function(err,scans){
					callback(err,scans)
				})
			},
			function(callback){
				pushScans.getPerOrg(req.db,req.session.user._id.toString(),req.params.org_name,function(err,scans){
					callback(err,scans)
				})
			},
		],function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				render(req,res,'users/org',{
					org: req.params.org_name,
					active_page: 'org_' + req.params.org_name,
					scans: results[0],
					push_scans: results[1]
				})
			}
		})



	})
})

router.get('/repo/:repo_owner/:repo_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.parallel([
			function(callback){
				localScans.getPerRepo(req.db,req.session.user._id.toString(),req.params.repo_owner,req.params.repo_name,function(err,scans){
					callback(err,scans)
				})
			},
		],function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{

				var repo = _.find(req.session.user.github.repos,function(repo){
					return repo.owner.login == req.params.repo_owner && repo.name == req.params.repo_name
				})

				render(req,res,'users/repo',{
					repo: repo,
					active_page: 'repo_' + req.params.repo_owner + '_' + req.params.repo_name,
					scans: results[0]
				})
			}
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
				localScans.createOrgScan(req.session.user._id.toString(),req.params.org_name,'github',req.db,function(err,scan){
					console.log('created scan: %s',util.inspect(scan))
					callback(err,scan)
				})
			},
		],function(err,scan){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				req.session.alert = {
					type: 'success',
					message: util.format('Scan %s succerssfully started. We will email you when it is ready',scan._id)
				};
				res.redirect('/org/' + req.params.org_name)
				// render(req,res,'index/build-local-org-scan',{
				// 	scan: scan
				// })
			}
		})

	})
})

router.get('/build-local-installation-scan/:installation_id',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.waterfall([
			function(callback){
				localScans.createInstallationScan(req.session.user._id.toString(),req.params.installation_id,'github',req.db,function(err,scan){
					console.log('created scan: %s',util.inspect(scan))
					callback(err,scan)
				})
			},
		],function(err,scan){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				req.session.alert = {
					type: 'success',
					message: util.format('Scan %s succerssfully started. We will email you when it is ready.',scan._id)
				};
				res.redirect('/installation/' + req.params.installation_id)
				// render(req,res,'index/build-local-org-scan',{
				// 	scan: scan
				// })
			}
		})

	})
})

router.get('/build-local-account-scan',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.waterfall([
			function(callback){
				localScans.createAccountScan(req.session.user._id.toString(),'github',req.db,function(err,scan){
					console.log('created scan: %s',util.inspect(scan))
					callback(err,scan)
				})
			},
		],function(err,scan){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				req.session.alert = {
					type: 'success',
					message: util.format('Scan %s succerssfully started. We will email you when it is ready',scan._id)
				};
				res.redirect('/account')
				// render(req,res,'index/build-local-org-scan',{
				// 	scan: scan
				// })
			}
		})

	})
})

router.get('/build-local-repo-scan/:repo_owner/:repo_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.waterfall([
			function(callback){
				localScans.createRepoScan(req.session.user._id.toString(),req.params.repo_owner,req.params.repo_name,'github',req.db,function(err,scan){
					console.log('created scan: %s',util.inspect(scan))
					callback(err,scan)
				})
			},
		],function(err,scan){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{
				req.session.alert = {
					type: 'success',
					message: util.format('Scan %s succerssfully started. We will email you when it is ready',scan._id)
				};
				res.redirect('/repo/' + req.params.repo_owner + '/' + req.params.repo_name)
				// render(req,res,'index/build-local-org-scan',{
				// 	scan: scan
				// })
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

		async.parallel([
			function(callback){
				localScans.get(req.db,req.session.user._id.toString(),req.params.local_scan_id,function(err,localScan){
					callback(err,localScan)
				})
			},
			function(callback){
				approvedKeys.all(req.db,function(err,approvedKeys){
					callback(err,approvedKeys)
				})
			}
		],function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{


				// filter out approved keys
				var localScan = results[0];
				var approvedKeys = results[1];
				var suspectedKeys = _.reject(localScan.suspected_keys,function(suspectedKey){
					return _.find(approvedKeys,function(approvedKey){
						return approvedKey.key == suspectedKey.key
					})
				})

				suspectedKeys = _.sortBy(suspectedKeys,function(suspectedKey){
					return suspectedKey.severity == 'high' ? 1 : 2;
				})

				localScan.suspected_keys = suspectedKeys;
				render(req,res,'users/local-scan',{
					local_scan: localScan,
					active_page: 'org_' + localScan.org_name
				})

			}
		})


	})
})

router.get('/push-scan/:push_scan_id',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.parallel([
			function(callback){
				pushScans.get(req.db,req.session.user._id.toString(),req.params.push_scan_id,function(err,pushScan){
					callback(err,pushScan)
				})
			},
			function(callback){
				approvedKeys.all(req.db,function(err,approvedKeys){
					callback(err,approvedKeys)
				})
			}
		],function(err,results){
			if(err){
				errorHandler.error(req,res,next,err)
			}else{


				// filter out approved keys
				var pushScan = results[0];
				var approvedKeys = results[1];
				var suspectedKeys = _.reject(pushScan.suspected_keys,function(suspectedKey){
					return _.find(approvedKeys,function(approvedKey){
						return approvedKey.key == suspectedKey.key
					})
				})

				suspectedKeys = _.sortBy(suspectedKeys,function(suspectedKey){
					return suspectedKey.severity == 'high' ? 1 : 2;
				})

				pushScan.suspected_keys = suspectedKeys;
				render(req,res,'users/push-scan',{
					push_scan: pushScan,
					active_page: 'repo_' + pushScan.push.repository.owner.name + '_' + pushScan.push.repository.name
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
				req.session.alert = {
					type: 'success',
					message: 'Organization hooked succerssfully. You will now be notified whenever a suspected key is pushed to any of this organization\'s repositories'
				}
				res.redirect('/org/' + req.params.org_name )

			}

		})
	})
})

router.get('/hook-repo/:repo_owner/:repo_name',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.waterfall([
			function(callback){
				github.hookRepo(req.session.user.github.access_token,req.params.repo_owner,req.params.repo_name,function(err,hook){
					callback(err,hook)
				})
			},
			function(hook,callback){
				var users = req.db.get('users');
				users.findAndModify({
					_id: req.session.user._id
				},{
					$addToSet:{
						'hooks.repos': {
							repo: {
								owner: req.params.repo_owner,
								name: req.params.repo_name
							},
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
				req.session.alert = {
					type: 'success',
					message: 'Repository hooked succerssfully. You will now be notified whenever a suspected key is pushed to this repository'
				}
				res.redirect('/repo/' + req.params.repo_owner + '/' + req.params.repo_name)

			}

		})
	})
})

router.get('/hook-account',function(req, res, next) {
	loginEnforcer.enforce(req,res,next,function(){

		async.waterfall([
			function(callback){
				github.getUserRepos(req.session.user.github.access_token,function(err,repos){
					callback(err,repos)
				})
			},
			function(repos,callback){
				var hooks = [];
				async.each(repos,function(repo,callback){

					github.hookRepo(req.session.user.github.access_token,repo.owner.login,repo.name,function(err,hook){
						if(err){
console.log('%s failed to hooked: %s',repo.full_name,err)
							// ignore????
							callback()
						}else{
console.log('%s hooked',repo.full_name)
							hooks.push({
								repo: {
									owner: repo.owner.login,
									name: repo.name
								},
								hook_id: hook.id
							})
							callback()
						}
					})
				},function(err){
					callback(err,hooks)
				})
			},
			function(hooks,callback){
				var users = req.db.get('users');
				users.findAndModify({
					_id: req.session.user._id
				},{
					$addToSet:{
						'hooks.repos': {$each: hooks}
					},
					$set: {
						'github.is_account_hooked': true
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
				req.session.alert = {
					type: 'success',
					message: 'Account hooked succerssfully. You will now be notified whenever a suspected key is pushed to any of your repositories.'
				}
				res.redirect('/account')

			}

		})
	})
})


router.post('/approve-key',function(req, res, next) {
	approvedKeys.create(req.session.user._id.toString(),req.body.scan_id,req.body.org,req.body.repo,req.body.branch,req.body.file,req.body.key,req.db,function(err,approvedKey){
		res.json({
			approved_key: approvedKey
		})
	})
})

router.get('/unsubscribe/:email_type/:user_id/:code', function(req, res, next) {
	if(!unsubscriber.verify(req.params.user_id,req.params.code)){
		// now what?
	}else{
		var users = req.db.get('users');
		var updateSet = {};
		updateSet['unsubscribes.' + req.params.email_type] = true;
		users.update({_id: req.params.user_id},{$set:updateSet},function(err,ok){
			if(err){
				errorHandler.error(req,res,next,err);
			}else{
				render(req,res,'index/unsubscribed',{
					email_type: req.params.email_type
				})
			}
		})
	}
});

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
