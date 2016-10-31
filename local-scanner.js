var config = require('config');
var util = require('util');
var async = require('async');
var fs = require('fs')
var path = require('path')


//mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.get('mongo.uri'));

var localScans = require('./models/local-scans')

var github = require('./app_modules/github')
var mailer = require('./app_modules/mailer')

var localScanReadyTemplate = fs.readFileSync(path.join(__dirname,'./views/emails/local-scan-ready.ejs'), 'utf8');


function scan(waitingScan,callback){
  async.waterfall([
    // get the user, need their access token
    function(callback){
      console.log('getting user for scan %s',waitingScan._id)
      var users = db.get('users');
      users.findOne({_id: waitingScan.user_id},function(err,user){
        callback(err,user)
      })
    },
    // mark the scan as scanning
    function(user,callback){
      console.log('got user for scan %s: %s',waitingScan._id,user._id)
      localScans.markScanning(db,waitingScan._id.toString(),function(err){
        callback(err,user)
      })
    },
    // scan the scan
    function(user,callback){
      console.log('marked scan %s as scanning',waitingScan._id)
      if('org_name' in waitingScan){
        github.scanOrgLocally(user.github.access_token,waitingScan.org_name,function(err,matches){
          callback(err,user,matches)
        })
      }else if('repo' in waitingScan){
        github.startRepoScan(user.github.access_token,user,waitingScan.repo_owner,waitingScan.repo_name,function(err,matches){
          callback(err,user,matches)
        })
      }
    },
    // mark it as scanned
    function(user,matches,callback){
      console.log('scan %s fisished',waitingScan._id)

      localScans.scanned(db,waitingScan._id.toString(),matches,function(err,localScan){
        callback(err,user,localScan)
      })
    },
    // notify user if finished
    function(user,scan,callback){
      if(!('_id' in scan)){
        callback()
      }else{
        mailer.sendMulti(
					[user], //recipients
					'[' + config.get('app.name') + '] Scan finished',
					localScanReadyTemplate,
					{
						scan_id: scan._id.toString()
					},
					'local-scan-ready',
					function(err){
						callback(err)
					}

				);
      }
    }
  ],function(err){
    callback(err)
  })
}



function next(){
  async.waterfall([
    function(callback){
      localScans.next(db,function(err,waitingScan){
        if(waitingScan){
          console.log('found waiting scan: %s',waitingScan._id.toString())
        }
        callback(err,waitingScan)
      })
    },
    function(waitingScan,callback){
      if(!waitingScan){
        console.log('queue empty')
        callback('queue empty')
      }else{
        scan(waitingScan,function(err){
          callback(err)
        })
      }
    },
  ],function(err){
    if(err){
      console.log('error scanning item, sleeping for 5 secs: %s',err)
      setTimeout(function(){next()},5000)
    }else{
      console.log('scanned item successfuly')
      return next()
    }
  })
}

console.log('starting')
next();
