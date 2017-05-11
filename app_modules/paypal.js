var config = require('config');
var request = require('request');
var util = require('util');
var paypal = require('paypal-rest-sdk')
var async = require('async')
var moment = require('moment')

paypal.configure({
  mode: config.get('paypal.mode'),
  client_id: config.get('paypal.client_id'),
  client_secret: config.get('paypal.client_secret'),
})

module.exports = {
  createBillingPlan: function(name,description,price,currency,callback){

    var billingPlanAttributes = {
      name: name,
      description: description,
      type: 'INFINITE',
      payment_definitions: [
        {
          id: 'a',
          name: 'a',
          type: 'REGULAR',
          frequency: 'MONTH',
          frequency_interval: '1',
          cycles: '0',
          amount: {
            currency: currency,
            value: price
          },
          charge_models: []
        }
      ],
      merchant_preferences: {
        // "setup_fee": {
        //     "currency": "USD",
        //     "value": "1"
        // },
        cancel_url: util.format('http://%s/paypal/cancelled',config.get('app.domain')),
        return_url: util.format('http://%s/paypal/paid',config.get('app.domain')),
        // "max_fail_attempts": "0",
        // "auto_bill_amount": "YES",
        // "initial_fail_amount_action": "CONTINUE"
      }
    }

    paypal.billingPlan.create(billingPlanAttributes, function (error, billingPlan) {
      callback(error,billingPlan)
    });
  },

  activateBillingPlan: function(planID,callback){
    var billingPlanUpdateAttributes = [{
      op: 'replace',
      path: '/',
      value: {
          state: 'ACTIVE'
      }
    }];

    paypal.billingPlan.update(planID,billingPlanUpdateAttributes,function(err){
      callback(err)
    })
  },

  createBillingAgreement: function(plan,callback){
    // var isoDate = new Date();
    // isoDate.setSeconds(isoDate.getSeconds() + 4);
    // isoDate.toISOString().slice(0, 19) + 'Z';

    var startDate = moment().format()
    // var startDate = moment().add(plan.frequency.interval,plan.frequency.type).format()
    // var startDate = moment().add(1,'weeks').format()
    // TBD check if to use toISOString instead
    // var startDate = moment().add(1,'weeks').toISOString();


    var billingAgreementAttributes = {
        name: plan.name,
        description: plan.description,
        start_date: startDate,
        plan: {
            id: plan.paypal_id
        },
        payer: {
            payment_method: 'paypal'
        },
    };

    paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement){
      callback(error,billingAgreement)
    });
  },

  executeAgreement: function(token,callback){
    paypal.billingAgreement.execute(token, {}, function (error, billingAgreement){
      callback(error, billingAgreement)
    })
  },

  createAndActivatePlan: function(name,description,price,currency,callback){
    var thisObject = this;
    async.waterfall([
      function(callback){
        thisObject.createBillingPlan(name,description,price,currency,function(err,billingPlan){
          callback(err,billingPlan)
        })
      },
      function(billingPlan,callback){
        thisObject.activateBillingPlan(billingPlan.id,function(err){
          callback(err,billingPlan)
        })
      },
    ],function(err,billingPlan){
      callback(err,billingPlan)
    })
  },

  verifyWebhook: function(req,callback){
    paypal.notification.webhookEvent.verify(req.headers, req.body, config.get('paypal.webhook_id'), function (error, response) {
      if(error){
        callback(error)
      }else{
        console.log('response is %s',util.inspect(response))
        callback(response.verification_status !== "SUCCESS")
      }
    })
  },

  cancelBillingAgreement: function(billingAgreementID,cancelNote,callback){
    paypal.billingAgreement.cancel(billingAgreementID, {note: cancelNote}, function (error, response) {
      console.log('billing agreement id is %s',billingAgreementID)
      console.log('response is %s',util.inspect(response))
      callback(error)
    })
  }

}
