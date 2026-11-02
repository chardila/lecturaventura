var test = require("node:test");
var assert = require("node:assert/strict");
var fs = require("fs");
var path = require("path");
var Voice = require("../src/voice.js");
var Practice = require("../src/practice.js");
var loadContent = require("./helpers/load-content.js");

test("cobertura: todo texto que speak() puede recibir tiene clip", function () {
  var file = path.join(__dirname, "..", "audio", "manifest.json");
  assert.ok(fs.existsSync(file), "Ejecuta: node tools/generar-voces.js");
  var manifest = JSON.parse(fs.readFileSync(file, "utf8"));
  var clips = Voice.clipsFor(loadContent(), Practice);
  var missing = clips.filter(function (c) {
    var m = manifest.clips[c.key];
    return !m || m.lang !== c.lang;
  });
  assert.equal(missing.length, 0,
    missing.length + " clips faltantes. Ejecuta: node tools/generar-voces.js. Ejemplos: " +
    missing.slice(0, 10).map(function (c) { return "[" + c.lang + "] " + c.text; }).join(" | "));
});
