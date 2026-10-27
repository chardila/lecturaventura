var fs = require("fs");
var path = require("path");

module.exports = function loadContent() {
  var src = fs.readFileSync(path.join(__dirname, "../../src/content.js"), "utf8");
  return new Function(src + "; return CONTENT")();
};
