// var grep = require('grep1');
//
// grep(['-rE','/\b([a-f0-9]{40})\b/','/tmp/pubsublab-tlvdemo-test/*'],function(err, stdout, stderr) {
//   if (err || stderr) {
//     console.log(err, stderr);
//   } else {
//     console.log(stdout);
//   }
// })

var util = require('util')
// var grep = require('simple-grep');
// grep('\b[0-9a-f]{5,40}\b', '/tmp/pubsublab-tlvdemo-test/', function(list){
//   console.log(util.inspect(list,{depth:8}));
// });

// grep(['hello','/tmp/pubsublab-tlvdemo-test/*'],function(err, stdout, stderr) {
//   if (err || stderr) {
//     console.log(err, stderr);
//   } else {
//     console.log(stdout);
//   }
// })


// const execFile = require('child_process').execFile;
// // const child = execFile('grep', ['-rE',"'\b[0-9a-f]{5,40}\b'",'/tmp/pubsublab-tlvdemo-test/*'], function(error, stdout, stderr) {
// const child = execFile('grep', ["-rE", "'\b[0-9a-f]{5,40}\b'","/tmp/pubsublab-tlvdemo-test/"], function(error, stdout, stderr) {
//     if (error) {
//         console.error('stderr', stderr);
//         console.log('stdout', stdout);
//         throw error;
//     }
//     console.log('stdout', stdout);
// });
// var exec = require('child_process').exec;
//
//
// // exec("grep -rE '\b[0-9a-f]{5,40}\b' /tmp/pubsublab-tlvdemo-test/*", function(err, stdin, stdout){
// exec("grep -rE '[0-9a-f]{40}' /tmp/tikalk-fuse.dbsynch.sample-master/*", function(err, stdin, stdout){
//   if(err){
//     console.log('err: ',util.inspect(err))
//   }else{
//     var lines = stdin.split('\n');
//     console.log('lines: %s',util.inspect(lines))
//   }
//
//   // console.log('stdin: ',util.inspect(stdin))
//   // console.log('stdout: ',util.inspect(stdout))
// })
// var slug = require('slug');
// console.log(slug('a/b'))
// var s = '6e8bd6bdccbe78899e3cc06b31b6dbf4324c2e56 ae3477e27be955de7e1bc9adfdca626b478d3cb2 ffffffffffffffffffffffffffffffffffffffff';
// var matches = s.match(/\b([a-f0-9]{40})\b/g)
// console.log(util.inspect(matches))

var async = require('async');
var request = require('request')

var hooks = [
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "cheapwetsuits"
					},
					"hook_id" : 10537058
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "api-models"
					},
					"hook_id" : 10537059
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "atom-trello"
					},
					"hook_id" : 10537060
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "cmprop1"
					},
					"hook_id" : 10537061
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "cmfos"
					},
					"hook_id" : 10537063
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "demo-for-fuse-day"
					},
					"hook_id" : 10537062
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "demo-repo-for-fuseday-2106"
					},
					"hook_id" : 10537064
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "docs"
					},
					"hook_id" : 10537065
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "dotedu-demo-training"
					},
					"hook_id" : 10537066
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "fullstack-workshop"
					},
					"hook_id" : 10537067
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "fuzeday2016"
					},
					"hook_id" : 10537068
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "gpanalyzer"
					},
					"hook_id" : 10537069
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "goproeditor"
					},
					"hook_id" : 10537070
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "gradle-for-noobs"
					},
					"hook_id" : 10537071
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "java-for-noobs"
					},
					"hook_id" : 10537072
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "jQuery-Knob"
					},
					"hook_id" : 10537073
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "ksphere"
					},
					"hook_id" : 10537074
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "biz-ops-for-noobs"
					},
					"hook_id" : 10537075
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "LetsTalkAboutIt"
					},
					"hook_id" : 10537076
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "linkedhere"
					},
					"hook_id" : 10537077
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "multigit"
					},
					"hook_id" : 10537078
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "mysql-internals"
					},
					"hook_id" : 10537079
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "opensourceproject"
					},
					"hook_id" : 10537080
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "nativity"
					},
					"hook_id" : 10537081
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "php-for-noobs"
					},
					"hook_id" : 10537082
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "php-for-nubs"
					},
					"hook_id" : 10537083
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "PhpHerokuTest"
					},
					"hook_id" : 10537084
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "plain"
					},
					"hook_id" : 10537085
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "plugin.video.quasar"
					},
					"hook_id" : 10537086
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "podmod"
					},
					"hook_id" : 10537087
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "ruby-for-noobs"
					},
					"hook_id" : 10537088
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "quicky-js"
					},
					"hook_id" : 10537089
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "rxjava-workshop"
					},
					"hook_id" : 10537090
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "sale2gether"
					},
					"hook_id" : 10537091
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "sale2gether-ios"
					},
					"hook_id" : 10537092
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "scala-for-experts"
					},
					"hook_id" : 10537093
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "scala-for-noobs"
					},
					"hook_id" : 10537094
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "skavias"
					},
					"hook_id" : 10537095
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "skavias2"
					},
					"hook_id" : 10537096
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "SlackPress"
					},
					"hook_id" : 10537097
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "SlackPressBlog"
					},
					"hook_id" : 10537098
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "swagger.io"
					},
					"hook_id" : 10537099
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "test"
					},
					"hook_id" : 10537100
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "test-1"
					},
					"hook_id" : 10537101
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "testcar"
					},
					"hook_id" : 10537102
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "tikal_share_android"
					},
					"hook_id" : 10537103
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "tracklassi"
					},
					"hook_id" : 10537104
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "vagrant-aws"
					},
					"hook_id" : 10537105
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "twipi"
					},
					"hook_id" : 10537106
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "untagged"
					},
					"hook_id" : 10537107
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "twintent"
					},
					"hook_id" : 10537108
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "werido-ripper"
					},
					"hook_id" : 10537109
				},
				{
					"repo" : {
						"owner" : "shaharsol",
						"name" : "whatsadmin"
					},
					"hook_id" : 10537110
				}
			]

var headers = {
  Authorization: 'token 81c910d3503c41fe2955f4ccc8d4114cedfc6aa4',
  Accept: 'application/vnd.github.v3+json',
  'User-Agent': 'tjs'
}


// async.each(hooks,function(hook,callback){
//   var qs = {access_token: '81c910d3503c41fe2955f4ccc8d4114cedfc6aa4'}
//   var url = util.format('https://api.github.com/repos/%s/%s/hooks/%s',hook.repo.owner,hook.repo.name,hook.hook_id);
//   request.delete(url,{headers: headers},function(error,response,body){
//     if(error){
//       console.log(error);
//     }else{
//       console.log(body)
//     }
//     callback()
//   })
// },function(err){
//
// })

var moment = require('moment')
console.log(moment(Number(1488799520 + '000')).toDate())
