var express = require('express');
var router = express.Router();
var util = require('util');
var config = require('config');
var url = require('url');
var async = require('async');
var request = require('request');
var _ = require('underscore');
var crypto = require('crypto');

var github = require('../app_modules/github');
var errorHandler = require('../app_modules/error');

router.get('/authorize',function(req,res,next){
	req.session.afterGithubRedirectTo = req.query.next;
	var redirect = {
		protocol: 'https',
		host: 'github.com',
		pathname: '/login/oauth/authorize',
		query: {
			client_id: config.get('github.client_id'),
			redirect_uri: 'http://' + config.get('github.redirect_domain') + '/github/authorized',
			scope: 'user,read:org,repo,admin:org_hook'

		}
	}
	res.redirect(url.format(redirect));
})

router.get('/authorized',function(req,res,next){
	async.waterfall([
 	    // switch the code for access token
 		function(callback){
 			var form = {
 				client_id: config.get('github.client_id'),
 				client_secret: config.get('github.client_secret'),
 				code: req.query.code,
 			}
 			var headers = {
 				Accept: 'application/json'
 			}
 			request.post('https://github.com/login/oauth/access_token',{form: form, headers: headers},function(error,response,body){
 				if(error){
 					callback(error);
 				}else if(response.statusCode > 300){
 					callback(response.statusCode + ' : ' + body);
 				}else{
 					var data = JSON.parse(body);
console.log('data from github: %s',util.inspect(data))
 					var accessToken = data.access_token;

 					callback(null,accessToken);
 				}
 			});
 		},
		function(accessToken,callback){
			var users = req.db.get('users');
			users.findAndModify({
				_id: req.session.user._id.toString()
			},{
				$set: {
					github: {
						access_token: accessToken
					}
				}
			},{
				new: true
			},function(err,user){
				callback(err,user)
			})
		}
 	],function(err,user){
 		if(err){
 			errorHandler.error(req,res,next,err);
 		}else{
 			req.session.user = user;
			res.redirect('/')
 		}
 	});
})

router.post('/org-webhook',function(req, res, next) {
	console.log('received a ORG webhook notification from github!');
	console.log('%s',util.inspect(req.body));

	// calc the signature according to X-Hub-Signature and verify the hook is valid
	var hmac = crypto.createHmac('sha1', config.get('github.hook_secret'));
	hmac.update(JSON.stringify(req.body));
	// hmac.update(req.rawBody);
	var calcedSignature = hmac.digest('hex');
	console.log('signature is %s',calcedSignature);

	var githubSignature = req.headers['x-hub-signature'].split('=')[1]; // header content is in format sha1={signature}, we need only the {signature} part
	if(githubSignature != calcedSignature){
		console.log('A SPOOFED HOOK RECEIVED!!! github sig: %s, calced sig: %s',githubSignature,calcedSignature);
	}else{
		// find the user that signed the organization and use their access_token
		var users = req.db.get('users');
		users.find({'hooks.orgs.org_name':{$in: [req.body.organization.login]}},function(err,docs){
			if(err){
				console.log('error finding an org-user match: %s',err);
			}else{
				if(docs.length > 0){
					var user = docs[0]; // the first user will do...
//					processHook(user,req.body);

					// what happened in github that caused us to receive this hook?
					console.log('headres are : %s',util.inspect(req.headers));
					switch(req.headers['x-github-event']){
					case 'push':
						console.log('this is a push!');
						processPush(user,req.body,req.db);
						break;
					default:
						console.log('header is : %s',req.headers['x-github-event']);
						break;
					}


				}else{
					console.log('find zero matches org-user!!!');
				}
			}
		})
	}



	res.sendStatus(200);

})

function processPush(user,push,db){
	async.waterfall([
		function(callback){
			github.scanPush(user.github.access_token,push,function(err,filesWithKeys){
				callback(err,filesWithKeys)
			})
		},
		function(filesWithKeys,callback){
			if(!filesWithKeys){
				callback()
			}else{
				// TBD notify user
				console.log('need to notify user about files with keys: %s',util.inspect(filesWithKeys))
			}
		}
	],function(err){
		if(err){
			console.log('error processing push: %s',err)
		}else{
			console.log('push processed succerssfully')
		}
	})

}

module.exports = router;
