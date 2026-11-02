var test = require("node:test");
var assert = require("node:assert/strict");
var G = require("../tools/generar-voces.js");

test("constantes de voz", function () {
  assert.equal(G.VOICES.es, "es-CO-SalomeNeural");
  assert.equal(G.VOICES.en, "en-GB-LibbyNeural");
  assert.equal(G.RATE, "-10%");
});

test("planMissing: solo los que no existen", function () {
  var clips = [{ key: "a", lang: "es", text: "a" }, { key: "b", lang: "en", text: "b" }];
  var seen = [];
  var out = G.planMissing(clips, function (p) { seen.push(p); return p.indexOf("/es/a.mp3") !== -1; });
  assert.deepEqual(out.map(function (c) { return c.key; }), ["b"]);
  assert.equal(seen.length, 2);
});

test("buildManifest: omite clips con tamano 0", function () {
  var clips = [{ key: "a", lang: "es", text: "a" }, { key: "b", lang: "en", text: "b" }, { key: "c", lang: "es", text: "c" }];
  var m = G.buildManifest(clips, function (p) { return p.indexOf("/es/a.mp3") !== -1 ? 1234 : p.indexOf("/en/b.mp3") !== -1 ? 0 : 99; });
  assert.deepEqual(m, { version: 1, clips: { a: { lang: "es", bytes: 1234 }, c: { lang: "es", bytes: 99 } } });
});
