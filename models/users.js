var moment = require('moment')
var async = require('async')
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
  getByInstallationID: function(db,installationID,callback){
    var users = db.get('users');
    users.findOne({'github.installations.id': installationID},function(err,user){
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
      },
      $setOnInsert: {
        created_at: new Date()
      },
    },{
      new: true,
      upsert: true
    },function(err,user){
      callback(err,user)
    })
  },
  subscribePaypal: function(db,userID,plan,billingAgreement,callback){

    var thisObject = this;
    async.waterfall([
      function(callback){
        var users = db.get('users');
        users.findOneAndUpdate({
          _id: userID
        },{
          $set: {
            subscription: {
              agreement_id: billingAgreement.id,
              plan: plan,
              created_at: new Date(),
              start_date: moment(billingAgreement.start_date).toDate(),
              status: 'active'
            }
          }
        },{
          new: true
        },function(err,user){
          callback(err,user)
        })
      }
    ],function(err,user){
      callback(err,user)
    })
  },
  cancelPaypalSubscription: function(db,paypalBillingAgreementID,callback){
    var users = db.get('users');
    users.findOneAndUpdate({
      'subscription.agreement_id': paypalBillingAgreementID
    },{
      $set: {
        'subscription.status': 'cancelled',
        'subscription.cancelled_at': new Date(),
      }
    },{
      new: true
    },function(err,user){
      callback(err,user)
    })
  },
  suspendPaypalSubscription: function(db,paypalBillingAgreementID,callback){
    var users = db.get('users');
    users.findOneAndUpdate({
      'subscription.agrrement_id': paypalBillingAgreementID
    },{
      $set: {
        'subscription.status': 'suspended',
        'subscription.suspended_at': new Date(),
      }
    },{
      new: true
    },
    function(err,user){
      callback(err,user)
    })
  },
  reactivatePaypalSubscription: function(db,paypalBillingAgreementID,callback){
    var users = db.get('users');
    users.findOneAndUpdate({
      'subscription.agrrement_id': paypalBillingAgreementID
    },{
      $set: {
        'subscription.status': 'reactivated',
        'subscription.reactivated_at': new Date(),
      }
    },{
      new: true
    },
    function(err,user){
      callback(err,user)
    })
  },


}
