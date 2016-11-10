module.exports = {
  find: function(content){
    var matches = content.match(/\b([a-f0-9]{40})\b/g);
    var highRiskMatches = content.match(/(secret|token|key).+\b([a-f0-9]{40})\b/g);

    var ret = matches ? {matches: matches, severity: highRiskMatches ? 'high' : 'low'} : null;

    return ret;
  }
}
