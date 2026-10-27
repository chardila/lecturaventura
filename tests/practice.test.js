var test = require("node:test");
var assert = require("node:assert/strict");
var Practice = require("../src/practice.js");
var loadContent = require("./helpers/load-content.js");

test("splitSentences: frases simples", function () {
  assert.deepEqual(
    Practice.splitSentences("Mira camina por la playa. Bajo el brazo lleva a Wali, su ballena de peluche. ¡Es una botella!"),
    ["Mira camina por la playa.", "Bajo el brazo lleva a Wali, su ballena de peluche.", "¡Es una botella!"]);
});

test("splitSentences: diálogo con rayas", function () {
  assert.deepEqual(
    Practice.splitSentences("—Mi barco ha desaparecido —suspira—. Necesito a alguien valiente. —¡Yo no fui! —grita—. Mira hacia arriba."),
    ["—Mi barco ha desaparecido —suspira—.", "Necesito a alguien valiente.", "—¡Yo no fui! —grita—.", "Mira hacia arriba."]);
});

test("splitSentences: comillas angulares", function () {
  assert.deepEqual(
    Practice.splitSentences("Al lado dice: «Camina veinte pasos hacia el este». Mira sonríe."),
    ["Al lado dice: «Camina veinte pasos hacia el este».", "Mira sonríe."]);
});

test("splitSentences: puntos suspensivos no cortan", function () {
  assert.deepEqual(
    Practice.splitSentences("Mira cuenta: uno, dos, tres… ¡veinte! Frente a ella hay una cueva."),
    ["Mira cuenta: uno, dos, tres… ¡veinte!", "Frente a ella hay una cueva."]);
});

test("splitSentences: vacío y sin punto", function () {
  assert.deepEqual(Practice.splitSentences("   "), []);
  assert.deepEqual(Practice.splitSentences("Hola mundo"), ["Hola mundo"]);
});

test("splitSentences: contenido real se reconstruye entero", function () {
  var n = 0;
  loadContent().worlds.forEach(function (w) {
    w.stories.forEach(function (s) {
      s.sections.forEach(function (sec) {
        if (!sec.text || !sec.text.es) return;
        var sents = Practice.splitSentences(sec.text.es);
        assert.equal(sents.join(" "), sec.text.es.replace(/\s+/g, " ").trim(), s.id);
        sents.forEach(function (x) { assert.ok(x.length > 0); });
        n++;
      });
    });
  });
  assert.ok(n >= 15);
});

test("normalizeWords", function () {
  assert.deepEqual(Practice.normalizeWords("—¡Ven, Mira! —grita Antón."), ["ven", "mira", "grita", "anton"]);
  assert.deepEqual(Practice.normalizeWords("El año"), ["el", "año"]);
});
