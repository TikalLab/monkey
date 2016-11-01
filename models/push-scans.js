var util = require('util')
var moment = require('moment')

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
          key: suspectedKey
        })
      })
    })

    pushScans.insert({
      user_id: userID,
      push: push,
      suspected_keys: suspectedKeys,
      created_at: new Date()
    },function(err,pushScan){
      callback(err,pushScan)
    })
  },
}
