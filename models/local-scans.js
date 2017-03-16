var util = require('util')
var async = require('async')
var _ = require('underscore')

module.exports = {
  createOrgScan: function(userID,orgName,scm,db,callback){
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
  createAccountScan: function(userID,scm,db,callback){
    var localScans = db.get('local_scans');
    localScans.insert({
      user_id: userID,
      is_account_scan: true,
      scm: scm,
      is_finished: false,
      is_scanning: false,
      created_at: new Date()
    },function(err,localScan){
      callback(err,localScan)
    })
  },
  createRepoScan: function(userID,repoOwner,repoName,scm,db,callback){
    var localScans = db.get('local_scans');
    localScans.insert({
      user_id: userID,
      repo: {
        owner: repoOwner,
        name: repoName
      },
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

    // flatten matches

    var suspectedKeys = [];
    _.each(matches,function(match){
      _.each(match.matches,function(suspectedKey){
        suspectedKeys.push({
          repo: match.repo,
          branch: match.branch,
          file: match.file,
          severity: match.severity,
          key: suspectedKey
        })
      })
    })

    suspectedKeys = _.uniq(suspectedKeys);

    localScans.findAndModify({
      _id: localScanID
    },{
      $set:{
        is_scanning: false,
        is_finished: true,
        suspected_keys: suspectedKeys
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
  },
  getPerUser: function(db,userID,callback){
    var localScans = db.get('local_scans');
    localScans.find({user_id: userID},function(err,userLocalScans){
      callback(err,userLocalScans)
    })
  },
  getPerOrg: function(db,userID,orgName,callback){
    var localScans = db.get('local_scans');
    localScans.find({user_id: userID,org_name: orgName},function(err,userLocalScans){
      callback(err,userLocalScans)
    })
  },
  getPerInstallation: function(db,userID,installationID,callback){
    var localScans = db.get('local_scans');
    localScans.find({user_id: userID,installation_id: installationID},function(err,userLocalScans){
      callback(err,userLocalScans)
    })
  },
  getPerRepo: function(db,userID,repoOwner,repoName,callback){
    var localScans = db.get('local_scans');
    localScans.find({user_id: userID,'repo.owner': repoOwner,'repo.name': repoName},function(err,userLocalScans){
      callback(err,userLocalScans)
    })
  },
  getPerAccount: function(db,userID,callback){
    var localScans = db.get('local_scans');
    localScans.find({user_id: userID, is_account_scan: true},function(err,userLocalScans){
      callback(err,userLocalScans)
    })
  }

}
