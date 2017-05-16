var util = require('util')
var moment = require('moment')
var _ = require('underscore')

module.exports = {
  create: function(userID,push,matches,db,callback){
    var pushScans = db.get('push_scans');

    var suspectedKeys = [];
    _.each(matches,function(match){
      _.each(match.matches,function(suspectedKey){
        suspectedKeys.push({
          repo: match.repo,
          branch: match.branch,
          file: match.file,
          line: suspectedKey.number,
          severity: match.severity,
          key: suspectedKey.match,
        })
      })
    })

    var filteredPush = {
      commits: push.commits,
      repository: {
        id: push.repository.id,
        name: push.repository.name,
        owner: {
          login: push.repository.owner.login
        }
      },
      sender: {
        login: push.sender.login,
        id: push.sender.id
      },
      installation: {
        id: push.installation.id
      }
    }


    pushScans.insert({
      user_id: userID,
      // push: push,
      push: filteredPush,
      suspected_keys: suspectedKeys,
      created_at: new Date()
    },function(err,pushScan){
      callback(err,pushScan)
    })
  },
  get: function(db,userID,pushScanID,callback){
    var pushScans = db.get('push_scans');
    pushScans.findOne({_id: pushScanID,user_id: userID},function(err,pushScan){
      callback(err,pushScan)
    })
  },
  getPerOrg: function(db,userID,orgName,callback){
    var pushScans = db.get('push_scans');
    pushScans.find({user_id: userID,'push.organization.login': orgName},function(err,orgPushScans){
      callback(err,orgPushScans)
    })
  },
  getPerInstallation: function(db,userID,installationID,callback){
    var pushScans = db.get('push_scans');
    pushScans.find({user_id: userID,'push.installation.id': Number(installationID)},function(err,orgPushScans){
      callback(err,orgPushScans)
    })
  },
  getPerUser: function(db,userID,callback){
    var pushScans = db.get('push_scans');
    pushScans.find({user_id: userID},function(err,pushScans){
      callback(err,pushScans)
    })
  },

}
