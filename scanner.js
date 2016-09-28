var config = require('config');
var util = require('util');
var async = require('async');


//mongo
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.get('mongo.uri'));

var scanItems = require('../models/scan-items')
var scans = require('../models/scans')




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
