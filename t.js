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

// var moment = require('moment')
// console.log(moment(Number(1488799520 + '000')).toDate())
//
// var os = require('os')
// var content = 'var secret="fsdfsdk89sd8f9sdfdsfsd9f8sd98f9ds8f9sd";' + os.EOL + "console.log('hello workd');" + os.EOL + 'var secret="fsdfsdk89sd8f9sdfdsfsd9f8sd98f9ds8f9sd";'
//
// var lineNumber = require('line-number')
// var matches = content.match(/\b(?=(?:[a-zA-Z]*\d){3})(?=.*\d[a-zA-Z]+\d)[a-zA-Z\d]{12,}\b/g);
// var matches = lineNumber(content,/\b(?=(?:[a-zA-Z]*\d){3})(?=.*\d[a-zA-Z]+\d)[a-zA-Z\d]{12,}\b/g);
// console.log(util.inspect(matches))
var a = '10000';
// console.log(a.toLocaleString())


var obj = {
	"user_id" : "58f8b5506e38872e58810c26",
	"push" : {
		"ref" : "refs/heads/260_populate_node_var",
		"before" : "4e5142a11a159e615580c2354c23f563a9ab1bee",
		"after" : "987af93275951dd83d93215a248472cd19cbcea3",
		"created" : false,
		"deleted" : false,
		"forced" : false,
		"base_ref" : null,
		"compare" : "https://github.com/mobdata/md-rules/compare/4e5142a11a15...987af9327595",
		"commits" : [
			{
				"id" : "987af93275951dd83d93215a248472cd19cbcea3",
				"tree_id" : "9d5ab5f18aa85bd8b4ec0462b31501cdd4ccbaa3",
				"distinct" : false,
				"message" : "Supports mobdata/replication#260 by adding support in DSL for populating target node's attributes in filters",
				"timestamp" : "2017-04-18T19:34:02Z",
				"url" : "https://github.com/mobdata/md-rules/commit/987af93275951dd83d93215a248472cd19cbcea3",
				"author" : {
					"name" : "Timothy D. McKernan",
					"email" : "timbitsandbytes@gmail.com",
					"username" : "bitsandbytes"
				},
				"committer" : {
					"name" : "Timothy D. McKernan",
					"email" : "timbitsandbytes@gmail.com",
					"username" : "bitsandbytes"
				},
				"added" : [ ],
				"removed" : [ ],
				"modified" : [
					"peg/mobdata_grammar.pegjs",
					"peg/mobdata_parser.js"
				]
			}
		],
		"head_commit" : {
			"id" : "987af93275951dd83d93215a248472cd19cbcea3",
			"tree_id" : "9d5ab5f18aa85bd8b4ec0462b31501cdd4ccbaa3",
			"distinct" : false,
			"message" : "Supports mobdata/replication#260 by adding support in DSL for populating target node's attributes in filters",
			"timestamp" : "2017-04-18T19:34:02Z",
			"url" : "https://github.com/mobdata/md-rules/commit/987af93275951dd83d93215a248472cd19cbcea3",
			"author" : {
				"name" : "Timothy D. McKernan",
				"email" : "timbitsandbytes@gmail.com",
				"username" : "bitsandbytes"
			},
			"committer" : {
				"name" : "Timothy D. McKernan",
				"email" : "timbitsandbytes@gmail.com",
				"username" : "bitsandbytes"
			},
			"added" : [ ],
			"removed" : [ ],
			"modified" : [
				"peg/mobdata_grammar.pegjs",
				"peg/mobdata_parser.js"
			]
		},
		"repository" : {
			"id" : 64392746,
			"name" : "md-rules",
			"full_name" : "mobdata/md-rules",
			"owner" : {
				"name" : "mobdata",
				"email" : "mobdatasolution@gmail.com",
				"login" : "mobdata",
				"id" : 16724252,
				"avatar_url" : "https://avatars0.githubusercontent.com/u/16724252?v=3",
				"gravatar_id" : "",
				"url" : "https://api.github.com/users/mobdata",
				"html_url" : "https://github.com/mobdata",
				"followers_url" : "https://api.github.com/users/mobdata/followers",
				"following_url" : "https://api.github.com/users/mobdata/following{/other_user}",
				"gists_url" : "https://api.github.com/users/mobdata/gists{/gist_id}",
				"starred_url" : "https://api.github.com/users/mobdata/starred{/owner}{/repo}",
				"subscriptions_url" : "https://api.github.com/users/mobdata/subscriptions",
				"organizations_url" : "https://api.github.com/users/mobdata/orgs",
				"repos_url" : "https://api.github.com/users/mobdata/repos",
				"events_url" : "https://api.github.com/users/mobdata/events{/privacy}",
				"received_events_url" : "https://api.github.com/users/mobdata/received_events",
				"type" : "Organization",
				"site_admin" : false
			},
			"private" : true,
			"html_url" : "https://github.com/mobdata/md-rules",
			"description" : "DSL for specifying replication rules",
			"fork" : false,
			"url" : "https://github.com/mobdata/md-rules",
			"forks_url" : "https://api.github.com/repos/mobdata/md-rules/forks",
			"keys_url" : "https://api.github.com/repos/mobdata/md-rules/keys{/key_id}",
			"collaborators_url" : "https://api.github.com/repos/mobdata/md-rules/collaborators{/collaborator}",
			"teams_url" : "https://api.github.com/repos/mobdata/md-rules/teams",
			"hooks_url" : "https://api.github.com/repos/mobdata/md-rules/hooks",
			"issue_events_url" : "https://api.github.com/repos/mobdata/md-rules/issues/events{/number}",
			"events_url" : "https://api.github.com/repos/mobdata/md-rules/events",
			"assignees_url" : "https://api.github.com/repos/mobdata/md-rules/assignees{/user}",
			"branches_url" : "https://api.github.com/repos/mobdata/md-rules/branches{/branch}",
			"tags_url" : "https://api.github.com/repos/mobdata/md-rules/tags",
			"blobs_url" : "https://api.github.com/repos/mobdata/md-rules/git/blobs{/sha}",
			"git_tags_url" : "https://api.github.com/repos/mobdata/md-rules/git/tags{/sha}",
			"git_refs_url" : "https://api.github.com/repos/mobdata/md-rules/git/refs{/sha}",
			"trees_url" : "https://api.github.com/repos/mobdata/md-rules/git/trees{/sha}",
			"statuses_url" : "https://api.github.com/repos/mobdata/md-rules/statuses/{sha}",
			"languages_url" : "https://api.github.com/repos/mobdata/md-rules/languages",
			"stargazers_url" : "https://api.github.com/repos/mobdata/md-rules/stargazers",
			"contributors_url" : "https://api.github.com/repos/mobdata/md-rules/contributors",
			"subscribers_url" : "https://api.github.com/repos/mobdata/md-rules/subscribers",
			"subscription_url" : "https://api.github.com/repos/mobdata/md-rules/subscription",
			"commits_url" : "https://api.github.com/repos/mobdata/md-rules/commits{/sha}",
			"git_commits_url" : "https://api.github.com/repos/mobdata/md-rules/git/commits{/sha}",
			"comments_url" : "https://api.github.com/repos/mobdata/md-rules/comments{/number}",
			"issue_comment_url" : "https://api.github.com/repos/mobdata/md-rules/issues/comments{/number}",
			"contents_url" : "https://api.github.com/repos/mobdata/md-rules/contents/{+path}",
			"compare_url" : "https://api.github.com/repos/mobdata/md-rules/compare/{base}...{head}",
			"merges_url" : "https://api.github.com/repos/mobdata/md-rules/merges",
			"archive_url" : "https://api.github.com/repos/mobdata/md-rules/{archive_format}{/ref}",
			"downloads_url" : "https://api.github.com/repos/mobdata/md-rules/downloads",
			"issues_url" : "https://api.github.com/repos/mobdata/md-rules/issues{/number}",
			"pulls_url" : "https://api.github.com/repos/mobdata/md-rules/pulls{/number}",
			"milestones_url" : "https://api.github.com/repos/mobdata/md-rules/milestones{/number}",
			"notifications_url" : "https://api.github.com/repos/mobdata/md-rules/notifications{?since,all,participating}",
			"labels_url" : "https://api.github.com/repos/mobdata/md-rules/labels{/name}",
			"releases_url" : "https://api.github.com/repos/mobdata/md-rules/releases{/id}",
			"deployments_url" : "https://api.github.com/repos/mobdata/md-rules/deployments",
			"created_at" : 1469708089,
			"updated_at" : "2016-09-09T17:37:34Z",
			"pushed_at" : 1492701986,
			"git_url" : "git://github.com/mobdata/md-rules.git",
			"ssh_url" : "git@github.com:mobdata/md-rules.git",
			"clone_url" : "https://github.com/mobdata/md-rules.git",
			"svn_url" : "https://github.com/mobdata/md-rules",
			"homepage" : null,
			"size" : 239,
			"stargazers_count" : 0,
			"watchers_count" : 0,
			"language" : "JavaScript",
			"has_issues" : true,
			"has_projects" : true,
			"has_downloads" : true,
			"has_wiki" : true,
			"has_pages" : false,
			"forks_count" : 0,
			"mirror_url" : null,
			"open_issues_count" : 0,
			"forks" : 0,
			"open_issues" : 0,
			"watchers" : 0,
			"default_branch" : "master",
			"stargazers" : 0,
			"master_branch" : "master",
			"organization" : "mobdata"
		},
		"pusher" : {
			"name" : "bitsandbytes",
			"email" : "bitsandbytes@users.noreply.github.com"
		},
		"organization" : {
			"login" : "mobdata",
			"id" : 16724252,
			"url" : "https://api.github.com/orgs/mobdata",
			"repos_url" : "https://api.github.com/orgs/mobdata/repos",
			"events_url" : "https://api.github.com/orgs/mobdata/events",
			"hooks_url" : "https://api.github.com/orgs/mobdata/hooks",
			"issues_url" : "https://api.github.com/orgs/mobdata/issues",
			"members_url" : "https://api.github.com/orgs/mobdata/members{/member}",
			"public_members_url" : "https://api.github.com/orgs/mobdata/public_members{/member}",
			"avatar_url" : "https://avatars0.githubusercontent.com/u/16724252?v=3",
			"description" : ""
		},
		"sender" : {
			"login" : "bitsandbytes",
			"id" : 761244,
			"avatar_url" : "https://avatars2.githubusercontent.com/u/761244?v=3",
			"gravatar_id" : "",
			"url" : "https://api.github.com/users/bitsandbytes",
			"html_url" : "https://github.com/bitsandbytes",
			"followers_url" : "https://api.github.com/users/bitsandbytes/followers",
			"following_url" : "https://api.github.com/users/bitsandbytes/following{/other_user}",
			"gists_url" : "https://api.github.com/users/bitsandbytes/gists{/gist_id}",
			"starred_url" : "https://api.github.com/users/bitsandbytes/starred{/owner}{/repo}",
			"subscriptions_url" : "https://api.github.com/users/bitsandbytes/subscriptions",
			"organizations_url" : "https://api.github.com/users/bitsandbytes/orgs",
			"repos_url" : "https://api.github.com/users/bitsandbytes/repos",
			"events_url" : "https://api.github.com/users/bitsandbytes/events{/privacy}",
			"received_events_url" : "https://api.github.com/users/bitsandbytes/received_events",
			"type" : "User",
			"site_admin" : false
		},
		"installation" : {
			"id" : 21161
		}
	},
	"suspected_keys" : [ ],
}

var _ = require('underscore')
var picked = _.pick(obj.push,'commits')
console.log(util.inspect(picked))


var moment = require('moment')
console.log(moment().add(30,'days').toDate())
