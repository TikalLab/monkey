var github = require('../app_modules/github');

module.exports = {
	enforce: function(req,res,next,callback){
		if(!req.session.user){
			req.session.afterReconnectGoTo = req.originalUrl;
			res.redirect('/reconnect');
		}else if(!('google' in req.session.user)){
			res.redirect('/connect-gmail')
		// }else if(!('installations' in req.session.user.github)){
		// 	res.redirect('/install-integration')
		// }else if(!('orgs' in req.session.user.github)){
		// 	github.getUserOrgs(req.session.user.github.access_token,function(err,orgs){
		// 		req.session.user.github.orgs = orgs;
		// 		res.redirect(req.originalUrl)
		// 	})
		// }else if(!('repos' in req.session.user.github)){
		// 	github.getUserRepos(req.session.user.github.access_token,function(err,repos){
		// 		req.session.user.github.repos = repos;
		// 		res.redirect(req.originalUrl)
		// 	})
		}else{
			callback();
		}
	}
}
