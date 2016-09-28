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
      is_scanned: false,
      scan_after: {$lt: new Date()}
    },{
      $set: {is_scanning: true}
    },function(err,next){
      callback(err,next)
    })
  },
  scanned: function(item,matches,db,callback){
    var scanItems = db.get('scan_items');
    scanItems.findOneAndUpdate({
      _id: item._id.toString()
    },{
      $set: {
        is_scanning: false,
        is_scanned: true,
        matches: matches
      }
    },{
      new: true
    },function(err,item){
      callback(err,item)
    })

  }
}