module.exports = {
  find: function(content){
    var matches = content.match(/\b([a-f0-9]{40})\b/);
    return matches;
  }
}
