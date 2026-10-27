var fs = require("fs");
var path = require("path");

module.exports = function loadContent() {
  var src = ["content.js", "stories-long.js"].map(function (f) {
    return fs.readFileSync(path.join(__dirname, "../../src/" + f), "utf8");
  }).join("\n");
  return new Function(src + "; return CONTENT")();
};
