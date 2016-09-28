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
      is_scanning: false,
      scan_after: new Date(),
      created_at: new Date()
    },function(err,scanItem){
      callback(err,scanItem)
    })
  },
  next: function(db,callback){
    var scanItems = db.get('scan_items');
    scanItems.findOneAndUpdate({
      is_scanning: false,
      scan_after:{$lt: new Date()}
    },{
      $set:{is_scanning: true}
    },function(err,next){
      callback(err,next)
    })
  }
}
