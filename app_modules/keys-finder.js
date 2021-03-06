var lineNumber = require('line-number');
module.exports = {
  find: function(content){
    var ret = null;

    if(content){
      // var matches = content.match(/\b([a-zA-Z0-9]{12,})\b/g);
      // var matches = content.match(/\b(?=[a-zA-Z0-9]{12,}).*\d+.*\b/g);
      // var matches = content.match(/\b(?=(?:[a-zA-Z]*\d){3})(?=.*\d[a-zA-Z]+\d)[a-zA-Z\d]{12,}\b/g);
      var matches = lineNumber(content,/\b(?=(?:[a-zA-Z]*\d){3})(?=.*\d[a-zA-Z]+\d)[a-zA-Z\d]{12,}\b/g);



      // var highRiskMatches = content.match(/(secret|token|key).+\b([a-zA-Z0-9]{16,})\b/g);
      // var highRiskMatches = content.match(/(secret|token|key).+\b(?=[a-zA-Z0-9]{12,}).*\d+.*\b/g);
      var highRiskMatches = content.match(/(secret|token|key).+\b(?=(?:[a-zA-Z]*\d){3})(?=.*\d[a-zA-Z]+\d)[a-zA-Z\d]{12,}\b/g);

      ret = matches ? {matches: matches, severity: highRiskMatches ? 'high' : 'low'} : null;

    }

    return ret;
  }
}
