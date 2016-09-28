var util = require('util')

module.exports = {
  create: function(userID,scm,noOfItems,db,callback){
    var scans = db.get('scans');
    scans.insert({
      user_id: userID,
      scm: scm,
      no_of_items: noOfItems,
      is_finished: false,
      created_at: new Date()
    },function(err,scan){
      callback(err,scan)
    })
  }
}
