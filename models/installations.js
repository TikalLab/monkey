module.exports = {
  add: function(db,installationID,accountLogin,senderLogin,callback){
    var installations = db.get('installations')
    installations.insert({
      installation_id: installationID,
      account_login: accountLogin,
      sender_login: senderLogin,
      created_at: new Date()
    },function(err,installation){
      callback(err,installation)
    })
  }
}
