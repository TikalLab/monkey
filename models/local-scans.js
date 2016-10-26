var util = require('util')
var async = require('async')

module.exports = {
  create: function(userID,orgName,scm,db,callback){
    var localScans = db.get('local_scans');
    localScans.insert({
      user_id: userID,
      org_name: orgName,
      scm: scm,
      is_finished: false,
      is_scanning: false,
      created_at: new Date()
    },function(err,localScan){
      callback(err,localScan)
    })
  },
  next: function(db,callback){
    var localScans = db.get('local_scans');
    localScans.find({is_finished: false,is_scanning: false},{sort:{_id:1}},function(err,waitingScans){
      callback(err,waitingScans[0])
    })
  },
  markScanning(db,localScanID,callback){
    var localScans = db.get('local_scans');
    localScans.update({_id: localScanID},{$set:{is_scanning: true}},function(err){
      callback(err)
    })
  },
  scanned(db,matches,callback){
    var localScans = db.get('local_scans');
    localScans.findAndModify({_id: localScanID},{$set:{is_scanning: fasle,is_finished: true, matches: matches}},{new: true},function(err,localScan){
      callback(err,localScan)
    })

  }
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
