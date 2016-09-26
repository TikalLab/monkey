var config = require('config');
var request = require('request');
var _ = require('underscore');
var async = require('async');
var parseLinkHeader = require('parse-link-header');
var util = require('util');


module.exports = {
	getAPIHeaders: function(accessToken){
		return {
			Authorization: 'token ' + accessToken,
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': config.get('app.name')
		};
	},
	getUserOrgs: function(accessToken,callback){
		var headers = this.getAPIHeaders(accessToken);
		var orgs = [];
		var page = 1;
		var linkHeader;

		async.whilst(
			function(){
				return page;
			},
			function(callback){
				var qs = {
					page: page
				}
				request('https://api.github.com/user/orgs',{headers: headers, qs: qs},function(error,response,body){
					if(error){
						callback(error);
					}else if(response.statusCode > 300){
						callback(response.statusCode + ' : ' + body);
					}else{
						var data = JSON.parse(body)
						orgs = repos.concat(data);
						linkHeader = parseLinkHeader(response.headers.link);
						page = (linkHeader? ('next' in linkHeader ? linkHeader.next.page : false) : false);
						callback(null,orgs);
					}
				});
			},
			function(err,orgs){
				callback(err,orgs)
			}
		);

	},
	getUserRepos: function(accessToken,callback){
		var headers = this.getAPIHeaders(accessToken);
		var repos = [];
		var page = 1;
		var linkHeader;

		async.whilst(
			function(){
				return page;
			},
			function(callback){
				request('https://api.github.com/user/repos?page=' + page,{headers: headers},function(error,response,body){
					if(error){
						callback(error);
					}else if(response.statusCode > 300){
						callback(response.statusCode + ' : ' + body);
					}else{
						var data = JSON.parse(body)
						repos = repos.concat(data);
//console.log('data is %s',util.inspect(data));
console.log('repos count %s',repos.length);
console.log('link heafer: %s',util.inspect(response.headers));
						linkHeader = parseLinkHeader(response.headers.link);
						page = (linkHeader? ('next' in linkHeader ? linkHeader.next.page : false) : false);
						callback(null,repos);
					}
				});
			},
			function(err,repos){
				callback(err,repos)
			}
		);

	},
	getRepoBranches: function(accessToken,repo,callback){
		var headers = this.getAPIHeaders(accessToken);
		var branches = [];
		var page = 1;
		var linkHeader;

		async.whilst(
			function(){
				return page;
			},
			function(callback){
				request('https://api.github.com/repos/' + repo + '/branches?page=' + page,{headers: headers},function(error,response,body){
					if(error){
						callback(error);
					}else if(response.statusCode > 300){
						callback(response.statusCode + ' : ' + body);
					}else{
						var data = JSON.parse(body)
						branches = branches.concat(data);
//console.log('data is %s',util.inspect(data));
console.log('branches count %s',branches.length);
console.log('link heafer: %s',util.inspect(response.headers));
						linkHeader = parseLinkHeader(response.headers.link);
						page = (linkHeader? ('next' in linkHeader ? linkHeader.next.page : false) : false);
						callback(null,branches);
					}
				});
			},
			function(err,branches){
				callback(err,branches)
			}
		);

	},
	scanRepo: function(accessToken,repo,callback){

	},
	scanOrg: function(accessToken,org,callback){

	},
	getOrgRepos: function(accessToken,org,callback){

	},
	getRepo: function(accessToken,repoName,callback){
		var headers = this.getAPIHeaders(accessToken)
		request('https://api.github.com/repos/' + repo,{headers: headers},function(error,response,body){
      if(error){
        callback(error);
      }else if(response.statusCode > 300){
        callback(response.statusCode + ' : ' + body);
      }else{
        var repo = JSON.parse(body)
        callback(null,repo);
      }
    });
	},
	getBranch: function(accessToken,repo,branchName,callback){
		var headers = this.getAPIHeaders(accessToken)
		request('https://api.github.com/repos/' + repo.full_name + '/branches/' + branchName,{headers: headers},function(error,response,body){
      if(error){
        callback(error);
      }else if(response.statusCode > 300){
        callback(response.statusCode + ' : ' + body);
      }else{
        var branch = JSON.parse(body)
        callback(null,branch);
      }
    });
	},
	getTree: function(accessToken,repo,branch,callback){
	  var headers = this.getAPIHeaders(accessToken);

    var qs = {
      recursive: '1'
    }
    request('https://api.github.com/repos/' + repo.full_name + '/git/trees/' + branch.commit.sha,{headers: headers, qs: qs},function(error,response,body){
      if(error){
        callback(error);
      }else if(response.statusCode > 300){
        callback(response.statusCode + ' : ' + body);
      }else{
        var data = JSON.parse(body)
        callback(null,data.tree);
      }
    });

	}


}
