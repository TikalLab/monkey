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
  }
}
