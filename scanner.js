var config = require('config');
var util = require('util');
var async = require('async');


//mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.get('mongo.uri'));

var scanItems = require('../models/scan-items')
var scans = require('../models/scans')


function scanItem(item){
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
      github.scanItem(user.github.access_token,item,function(err,matches){
        callback(err,user,matches)
      })
    },
    // mark it as scanned
    function(user,matches,callback){
      scanItems.scanned(item,matches,db,function(err){
        callback(err)
      })
    },
    // check if scan is finsihed
    function(callback){
      scans.checkIfFinished(item.scan_id,db,function(err,scan){
        callback(err,scan)
      })
    },
    // notify user if finished
    function(scan,callback){
      if(!scan){
        callback()
      }else{
        // TBD notify user
      }
    }
  ],function(err){
    callback(err)
  })
}

function next(){
  async.waterfall([
    function(callback){
      scanItems.next(db,function(err,item){
        callback(err,item)
      })
    },
    function(item,callback){
      if(!item){
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

next();
