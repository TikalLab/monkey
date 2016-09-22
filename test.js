var async = require('async');
var request = require('request');
var util = require('util');
var atob = require('atob')

function getAPIHeaders(accessToken){
  return {
    Authorization: 'token ' + accessToken,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'tikallab monkey'
  };
}

function getTree(accessToken,repo,sha,callback){
  var headers = getAPIHeaders(accessToken);
  async.waterfall([
    function(callback){
      var qs = {
        recursive: '1'
      }
      request('https://api.github.com/repos/' + repo.full_name + '/git/trees/' + sha,{headers: headers, qs: qs},function(error,response,body){
        if(error){
          callback(error);
        }else if(response.statusCode > 300){
          callback(response.statusCode + ' : ' + body);
        }else{
          var data = JSON.parse(body)
//console.log('tree for %s is: %s',sha,util.inspect(data.tree))
          callback(null,data.tree);
        }
      });
    },
  ],function(err,items){
    callback(err,items)
  })

}


var accessToken = '4bc903b9f3167546fc0e94e0853420134c50d70a';
// var repo = 'TikalLab/npm-as-a-service';
var repo = 'TikalLab/zpder';
var headers = getAPIHeaders(accessToken);

async.waterfall([
  function(callback){
    request('https://api.github.com/repos/' + repo,{headers: headers},function(error,response,body){
      if(error){
        callback(error);
      }else if(response.statusCode > 300){
        callback(response.statusCode + ' : ' + body);
      }else{
        var repo = JSON.parse(body)
//console.log('master of %s is: %s',repo,util.inspect(master))
        callback(null,repo);
      }
    });
  },
  // get the master branch's sha...
  function(repo,callback){
console.log('default branch for %s is %s',repo.full_name,repo.default_branch)
//				request('https://api.github.com/repos/' + repo.full_name + '/git/refs/heads/' + repo.default_branch,{headers: headers},function(error,response,body){
    request('https://api.github.com/repos/' + repo.full_name + '/branches/' + repo.default_branch,{headers: headers},function(error,response,body){
      if(error){
        callback(error);
      }else if(response.statusCode > 300){
        callback(response.statusCode + ' : ' + body);
      }else{
        var master = JSON.parse(body)
//console.log('master of %s is: %s',repo,util.inspect(master))
        callback(null,repo,master);
      }
    });
  },
  function(repo,master,callback){
    getTree(accessToken,repo,master.commit.sha,function(err,items){
      if(err){
        console.log('err is getTree for %s: %s',repo.full_name,err)
        callback(null,[])
      }else{
        callback(err,items)
      }
    })
  },
  function(items,callback){
    // console.log('items are: %s',util.inspect(items))
    var filesWithKeys = [];
    async.each(items,function(item,callback){
      request(item.url,{headers: headers},function(error,response,body){
        if(error){
          callback(error);
        }else if(response.statusCode > 300){
          callback(response.statusCode + ' : ' + body);
        }else{
          var data = JSON.parse(body);
// console.log('data is %s',util.inspect(data))
          if('content' in data){
            var content = atob(data.content)
            var matches = content.match(/\b([a-f0-9]{40})\b/);
  // console.log('matches is %s',util.inspect(matches))
            if(matches){
              filesWithKeys.push(item)
            }

          }
          callback()
        }
      })
    },function(err){
      callback(err,filesWithKeys)
    })
    // var packages = [];
    // async.each(items,function(item,callback){
    //   if(!us.endsWith(item.path,'package.json') || us.include(item.path,'node_modules')){
    //     callback()
    //   }else{
    //     request(item.url,{headers: headers},function(error,response,body){
    //       if(error){
    //         callback(error);
    //       }else if(response.statusCode > 300){
    //         callback(response.statusCode + ' : ' + body);
    //       }else{
    //         var data = JSON.parse(body)
    //         packages.push(data);
    //         callback();
    //       }
    //     });
    //   }
    // },function(err){
    //   callback(err,packages)
    // })
  }
],function(err,filesWithKeys){
  if(err){
    console.log('err is %s',err)
  }else{
    console.log('files with keys are: %s',util.inspect(filesWithKeys))
  }
})
