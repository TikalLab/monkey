module.exports = {
	enforce: function(req,res,next,callback){
		if(!req.session.user){
			req.session.afterReconnectGoTo = req.originalUrl;
			res.redirect('/reconnect');
		}else{
			callback();
		}
	}
}
