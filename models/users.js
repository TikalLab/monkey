var moment = require('moment')

module.exports = {
  get: function(db,userID,callback){
    var users = db.get('users');
    users.findOne({_id: userID},function(err,user){
      callback(err,user)
    })
  },
  getByEmail: function(db,email,callback){
    var users = db.get('users');
    users.findOne({email: email},function(err,user){
      callback(err,user)
    })
  },
  getAll: function(db,callback){
    var users = db.get('users');
    users.find({},function(err,users){
      callback(err,users)
    })
  },
  addInstallation: function(db,githubID,githubLogin,installationID,accountID,accountLogin,callback){
    var users = db.get('users');
    users.findOneAndUpdate({
      'github.id': githubID
    },{
      $addToSet: {
        'github.installations': {
          id: installationID,
          account: {
            id: accountID,
            login: accountLogin
          }
        }
      }
    },{
      new: true
    },function(err,user){
      callback(err,user)
    })
  }
}
