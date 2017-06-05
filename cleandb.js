var config = require('config')
var util = require('util')
var mongo = require('mongodb');
var monk = require('monk');
var db = monk(config.get('mongo.uri'));

var moment = require('moment');

pushScans = db.get('push_scans');

var lastMonth = moment().subtract(1,'months').toDate()

pushScans.remove({created_at:{$lt:lastMonth}},function(err,cnt){
	console.log(err)
	console.log(cnt.result.n)
})
