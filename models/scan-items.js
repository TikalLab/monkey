var util = require('util')

module.exports = {
  create: function(scanID,userID,scm,item,db,callback){
    var scanItems = db.get('scan_items');
    scanItems.insert({
      scan_id: scanID,
      user_id: userID,
      scm: scm,
      item: item,
      is_scanned: false,
      created_at: new Date()
    },function(err,scanItem){
      callback(err,scanItem)
    })
  }
}
