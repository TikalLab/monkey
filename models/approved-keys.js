var util = require('util')
var moment = require('moment')

module.exports = {
  create: function(scanID,org,repo,branch,file,key,db,callback){
    var approvedKeys = db.get('approved_keys');
    approvedKeys.insert({
      scan_id: scanID,
      org: org,
      repo: repo,
      branch: branch,
      file: file,
      key: key,
      created_at: new Date()
    },function(err,approvedKey){
      callback(err,approvedKey)
    })
  },
  all: function(db,callback){
    var approvedKeys = db.get('approved_keys');
    approvedKeys.find({},function(err,keys){
      callback(err,keys)
    })
  }
}
