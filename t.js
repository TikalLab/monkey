var s = '@@ -3,3 +3,4 @@ var s = \'c9a70467770469462ad05d88df987e1e0aefc750\';\n var a = 1;\n var b = 2;\n var c = 3;\n+var d = 1;';

var gpa = require('git-patch-additions');

var additions = gpa.get(s);

var util = require('util');
console.log(util.inspect(additions))
