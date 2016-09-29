var config = require('config');
var util = require('util');
var async = require('async');
var fs = require('fs')
var path = require('path')


//mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.get('mongo.uri'));

var scanItems = require('./models/scan-items')
var scans = require('./models/scans')

var github = require('./app_modules/github')
var mailer = require('./app_modules/mailer')

var scanReadyTemplate = fs.readFileSync(path.join(__dirname,'./views/emails/scan-ready.ejs'), 'utf8');


function scanItem(item,callback){
  async.waterfall([
    // get the user, need their access token
    function(callback){
      var users = db.get('users');
      users.findOne({_id: item.user_id},function(err,user){
        callback(err,user)
      })
    },
    // scan the item
    function(user,callback){
      github.scanItem(user.github.access_token,item.item,function(err,matches){
        callback(err,user,matches)
      })
    },
    // mark it as scanned
    function(user,matches,callback){
      scanItems.scanned(item,matches,db,function(err){
        callback(err,user)
      })
    },
    // check if scan is finsihed
    function(user,callback){
      scans.checkIfFinished(item.scan_id,db,function(err,scan){
        callback(err,user,scan)
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
					scanReadyTemplate,
					{
						scan_id: scan._id.toString()
					},
					'scan-ready',
					function(err){
						callback(err)
					}

				);
      }
    }
  ],function(err){
    if(err == 'ratelimit'){
      // TBD handle rate limit
      scanItems.postpone(item.user_id,db)
    }else{
      callback(err)
    }
  })
}



function next(){
  async.waterfall([
    function(callback){
      scanItems.next(db,function(err,item){
        if(item){
          console.log('found item to scan: %s',item._id.toString())
        }
        callback(err,item)
      })
    },
    function(item,callback){
      if(!item){
        console.log('queue empty')
        callback('queue empty')
      }else{
        scanItem(item,function(err){
          callback(err)
        })
      }
    },
  ],function(err){
    if(err){
      setTimeout(function(){next()},5000)
    }else{
      return next()
    }
  })
}

console.log('starting')
next();
