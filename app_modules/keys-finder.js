module.exports = {
  find: function(content){
    // var matches = content.match(/\b([a-zA-Z0-9]{12,})\b/g);
    var matches = content.match(/\b(?=[a-zA-Z0-9]{12,}).*\d+.*\b/g);

    // var highRiskMatches = content.match(/(secret|token|key).+\b([a-zA-Z0-9]{16,})\b/g);
    var highRiskMatches = content.match(/(secret|token|key).+\b(?=[a-zA-Z0-9]{12,}).*\d+.*\b/g);

    var ret = matches ? {matches: matches, severity: highRiskMatches ? 'high' : 'low'} : null;

    return ret;
  }
}
