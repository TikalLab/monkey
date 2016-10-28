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
var s = '6e8bd6bdccbe78899e3cc06b31b6dbf4324c2e56 ae3477e27be955de7e1bc9adfdca626b478d3cb2 ffffffffffffffffffffffffffffffffffffffff';
var matches = s.match(/\b([a-f0-9]{40})\b/g)
console.log(util.inspect(matches))
