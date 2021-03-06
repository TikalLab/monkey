var util = require('util')
var async = require('async')

module.exports = {
  create: function(userID,scm,noOfItems,db,callback){
    var scans = db.get('scans');
    scans.insert({
      user_id: userID,
      scm: scm,
      no_of_items: noOfItems,
      is_finished: false,
      created_at: new Date()
    },function(err,scan){
      callback(err,scan)
    })
  },
  checkIfFinished: function(scanID,db,callback){
    var scans = db.get('scans');
    var scanItems = db.get('scan_items');
    async.waterfall([
      function(callback){
        scanItems.count({scan_id: scanID, is_scanned: true},function(err,cnt){
          callback(err,cnt)
        })
      },
      function(cnt,callback){
        scans.findOneAndUpdate({
          _id: scanID,
          no_of_items: cnt
        },{
          $set: {is_finished: true}
        },{
          new: true
        },function(err,scan){
          callback(err,scan)
        })
      }
    ],function(err,scan){
      callback(err,scan)
    })
  },
  getFull: function(userID,scanID,db,callback){
    var scans = db.get('scans');
    var scanItems = db.get('scan_items');
    async.parallel([
      function(callback){
        scans.findOne({_id: scanID, user_id: userID},function(err,scan){
          callback(err,scan)
        })
      },
      function(callback){
        scanItems.find({scan_id: scanID, user_id: userID, matches: {$ne: null}},function(err,items){
          callback(err,items)
        })
      }
    ],function(err,results){
      if(err){
        callback(err)
      }else{
        callback(null,{
          scan: results[0],
          matched_items: results[1]
        })
      }
    })

  }
}
