var util = require('util')
var moment = require('moment')

module.exports = {
  create: function(userID,scanID,org,repo,branch,file,key,db,callback){
    var approvedKeys = db.get('approved_keys');
    approvedKeys.insert({
      user_id: userID,
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
  },
  getPerUser: function(db,userID,callback){
    var approvedKeys = db.get('approved_keys');
    approvedKeys.find({user_id: userID},function(err,keys){
      callback(err,keys)
    })
  }

}
