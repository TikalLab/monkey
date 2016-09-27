var config = require('config');
var request = require('request');
var _ = require('underscore');
var async = require('async');
var parseLinkHeader = require('parse-link-header');
var util = require('util');
var atob = require('atob')


var keysFinder = require('../app_modules/keys-finder')

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
						callback(response.statusCode + ' : ' + arguments.callee.toString() + ' : ' + body);
					}else{
						var data = JSON.parse(body)
						orgs = orgs.concat(data);
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
	getOrgRepos: function(accessToken,orgName,callback){
		console.log('getting org repos for %s',orgName)
		var headers = this.getAPIHeaders(accessToken);
		var repos = [];
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
				request('https://api.github.com/orgs/' + orgName + '/repos',{headers: headers, qs: qs},function(error,response,body){
					if(error){
						callback(error);
					}else if(response.statusCode > 300){
						callback(response.statusCode + ' : ' + arguments.callee.toString() + ' : ' + body);
					}else{
						var data = JSON.parse(body)
						repos = repos.concat(data);
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
						callback(response.statusCode + ' : ' + arguments.callee.toString() + ' : ' + body);
					}else{
						var data = JSON.parse(body)
						repos = repos.concat(data);
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
		console.log('getting repo branches for %s',repo.full_name)
		var headers = this.getAPIHeaders(accessToken);
		var branches = [];
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
				request('https://api.github.com/repos/' + repo.full_name + '/branches',{headers: headers,qs: qs},function(error,response,body){
					if(error){
						callback(error);
					}else if(response.statusCode > 300){
						console.log('error in getRepoBranches for %s',repo.full_name)
						callback(response.statusCode + ' : ' + arguments.callee.toString() + ' : ' + body);
					}else{
						var data = JSON.parse(body)
						branches = branches.concat(data);
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
		console.log('scanning repo %s',repo.full_name)
		var thisObject = this;
		async.waterfall([
			function(callback){
				thisObject.getRepoBranches(accessToken,repo,function(err,branches){
					callback(err,branches)
				})
			},
			function(branches,callback){
				var results = [];
				async.each(branches,function(branch,callback){
					thisObject.scanBranch(accessToken,repo,branch,function(err,branchResults){
						if(err){
							callback(err)
						}else{
							results = results.concat(branchResults)
							callback()
						}
					})
				},function(err){
					callback(err,results)
				})
			}
		],function(err,results){
			callback(err,results)
		})
	},
	scanOrg: function(accessToken,orgName,callback){
		console.log('scanning org %s',orgName)
		var thisObject = this;
		async.waterfall([
			function(callback){
				thisObject.getOrgRepos(accessToken,orgName,function(err,repos){
					callback(err,repos)
				})
			},
			function(repos,callback){
				var results = [];
				async.each(repos,function(repo,callback){
					thisObject.scanRepo(accessToken,repo,function(err,repoResults){
						if(err){
							callback(err)
						}else{
							results = results.concat(repoResults);
							callback()
						}
					})
				},function(err){
					callback(err,results)
				})
			}
		],function(err,results){
			callback(err,results)
		})
	},
	getRepo: function(accessToken,repoName,callback){
		var headers = this.getAPIHeaders(accessToken)
		request('https://api.github.com/repos/' + repo,{headers: headers},function(error,response,body){
      if(error){
        callback(error);
      }else if(response.statusCode > 300){
        callback(response.statusCode + ' : ' + arguments.callee.toString() + ' : ' + body);
      }else{
        var repo = JSON.parse(body)
        callback(null,repo);
      }
    });
	},
	getBranch: function(accessToken,repo,branchName,callback){
		console.log('getting barnch %s:%s',repo.full_name,branchName)

		var headers = this.getAPIHeaders(accessToken)
		request('https://api.github.com/repos/' + repo.full_name + '/branches/' + branchName,{headers: headers},function(error,response,body){
      if(error){
        callback(error);
      }else if(response.statusCode > 300){
        callback(response.statusCode + ' : ' + arguments.callee.toString() + ' : ' + body);
      }else{
        var branch = JSON.parse(body)
        callback(null,branch);
      }
    });
	},
	getTree: function(accessToken,repo,branch,callback){
		console.log('getting tree for %s:%s',repo.full_name,branch.name)

	  var headers = this.getAPIHeaders(accessToken);

    var qs = {
      recursive: '1'
    }
    request('https://api.github.com/repos/' + repo.full_name + '/git/trees/' + branch.commit.sha,{headers: headers, qs: qs},function(error,response,body){
      if(error){
        callback(error);
      }else if(response.statusCode > 300){
        callback(response.statusCode + ' : ' + arguments.callee.toString() + ' : ' + body);
      }else{
        var data = JSON.parse(body)
        callback(null,data.tree);
      }
    });

	},
	scanBranch: function(accessToken,repo,branch,callback){
		console.log('scanning branch %s:%s',repo.full_name,branch.name)
		var thisObject = this;
		var headers = this.getAPIHeaders(accessToken);
		async.waterfall([
			function(callback){
				thisObject.getTree(accessToken,repo,branch,function(err,tree){
					callback(err,tree)
				})
			},
			function(tree,callback){
				var filesWithKeys = [];
				async.each(tree,function(item,callback){
					request(item.url,{headers: headers},function(error,response,body){
		        if(error){
		          callback(error);
		        }else if(response.statusCode > 300){
		          callback(response.statusCode + ' : ' + arguments.callee.toString() + ' : ' + body);
		        }else{
		          var data = JSON.parse(body);
		// console.log('data is %s',util.inspect(data))
		          if('content' in data){
		            var content = atob(data.content)
								var matches = keysFinder.find(content);
								if(matches){
									console.log('scan result for %s:%s:%s: affected',repo.full_name,branch.name,item.path)
									filesWithKeys.push({
										repo: repo,
										branch: branch,
										file: item,
										matches: matches
									})
								}else{
									console.log('scan result for %s:%s:%s: not affected',repo.full_name,branch.name,item.path)
								}
		          }
		          callback()
		        }
		      })
				},function(err){
					callback(err,filesWithKeys)
				})
			}
		],function(err,results){
			callback(err,results)
		})

	},
	hookOrg: function(accessToken,orgName,callback){
		var headers = this.getAPIHeaders(accessToken);

		var form = {
			"name": "web",
			"active": true,
			"events": ["push"],
			"config": {
				"url": "https://" + config.get('github.webhook_domain') + "/github/org-webhook",
				"content_type": "json",
				"secret": config.get('github.hook_secret')
			}
		};
		request.post('https://api.github.com/orgs/' + orgName + '/hooks',{headers: headers, body: JSON.stringify(form)},function(error,response,body){
			if(error){
				callback(error);
			}else if(response.statusCode > 300){
				callback(response.statusCode + ' : ' + body);
			}else{
				var hook = JSON.parse(body);
				callback(null,hook);
			}
		});
	},
	scanPush: function(accessToken,push,callback){
		var headers = this.getAPIHeaders(accessToken);
		var filesWithKeys =[];
		async.each(push.commits,function(commit,callback){
				var url = 'https://api.github.com/repos/' + push.repository.owner.name + '/' + push.repository.name + '/commits/' + commit.id;
				request(url,{headers: headers},function(error,response,body){
					if(error){
						callback(error);
					}else if(response.statusCode > 300){
						callback(response.statusCode + ' : ' + body);
					}else{
						var commit = JSON.parse(body);
						_.each(commit.files,function(file){
							var matches = keysFinder.find(file.patch);
							if(matches){
								var refParts = push.ref.split('/');
								var branchName = refParts[refParts.length -1]
								filesWithKeys.push({
									repo: push.repository.name,
									branch: branchName,
									file: file.filename,
									matches: matches
								})
							}
						})
						callback();
					}
				});
		},function(err){
			callback(err,filesWithKeys)
		})
	}


}
