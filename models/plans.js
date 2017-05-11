module.exports = {
  getAll: function(db,callback){
    var plans = db.get('plans');
    plans.find({},{sort: {price: 1}},function(err,plans){
      callback(err,plans)
    })
  },
  getFeatured: function(db,callback){
    var plans = db.get('plans');
    plans.find({is_featured: true},{sort: {price: 1}},function(err,plans){
      callback(err,plans)
    })
  },
  add: function(db,name,description,frequencyType,frequencyInterval,price,currency,isFeatured,paypalID,callback){
    var plans = db.get('plans');
    plans.insert({
      name: name,
      description: description,
      frequency: {
        interval: Number(frequencyInterval),
        type: frequencyType,
      },
      price: Number(price),
      currency: currency,
      is_featured: isFeatured,
      paypal_id: paypalID,
      created_at: new Date()
    },function(err,plan){
      callback(err,plan)
    })
  },
  get: function(db,planID,callback){
    var plans = db.get('plans');
    plans.findOne({_id: planID},function(err,plan){
      callback(err,plan)
    })
  }
}
