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
  markScanning: function(db,localScanID,callback){
    var localScans = db.get('local_scans');
    localScans.update({
      _id: localScanID
    },{
      $set:{
        is_scanning: true
      }
    },function(err){
      callback(err)
    })
  },
  scanned: function(db,localScanID,matches,callback){
    var localScans = db.get('local_scans');
    localScans.findAndModify({
      _id: localScanID
    },{
      $set:{
        is_scanning: false,
        is_finished: true,
        matches: matches
      }
    },{
      new: true
    },function(err,localScan){
      callback(err,localScan)
    })

  },
  get: function(db,userID,localScanID,callback){
    var localScans = db.get('local_scans');
    localScans.findOne({_id: localScanID,user_id: userID},function(err,localScan){
      callback(err,localScan)
    })
  }
}
