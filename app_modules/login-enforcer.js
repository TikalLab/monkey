var github = require('../app_modules/github');

module.exports = {
	enforce: function(req,res,next,callback){
		if(!req.session.user){
			req.session.afterReconnectGoTo = req.originalUrl;
			res.redirect('/reconnect');
		}else if(!('github' in req.session.user)){
			res.redirect('/connect-scm')
		}else if(!('orgs' in req.session.user.github)){
			github.getUserOrgs(req.session.user.github.access_token,function(err,orgs){
				req.session.user.github.orgs = orgs;
				res.redirect('/')
			})
		}else if(!('repos' in req.session.user.github)){
			github.getUserRepos(req.session.user.github.access_token,function(err,repos){
				req.session.user.github.repos = repos;
				res.redirect('/')
			})
		}else{
			callback();
		}
	}
}
