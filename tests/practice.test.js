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

test("phoneticKey: equivalentes y distintas", function () {
  [["vaca", "baca"], ["casa", "caza"], ["hola", "ola"], ["calle", "caye"], ["queso", "keso"], ["gente", "jente"]]
    .forEach(function (p) { assert.equal(Practice.phoneticKey(p[0]), Practice.phoneticKey(p[1]), p.join("/")); });
  [["gato", "pato"], ["cama", "casa"], ["guerra", "jerra"]]
    .forEach(function (p) { assert.notEqual(Practice.phoneticKey(p[0]), Practice.phoneticKey(p[1]), p.join("/")); });
});

var CAMA = "El gato duerme en la cama.";

test("alignReading: lectura correcta", function () {
  var r = Practice.alignReading(CAMA, "el gato duerme en la cama");
  assert.equal(r.allOk, true);
  assert.equal(r.words.length, 6);
  assert.ok(r.words.every(function (w) { return w.ok; }));
});

test("alignReading: palabra omitida (las de ≤2 letras se perdonan)", function () {
  var r = Practice.alignReading("La oruga come y come.", "la oruga come");
  assert.equal(r.allOk, false);
  assert.deepEqual(r.words[4], { text: "come.", ok: false });
  assert.equal(r.words[3].ok, true);
});

test("alignReading: adivinar cama por casa se marca", function () {
  var r = Practice.alignReading(CAMA, "el gato duerme en la casa");
  assert.equal(r.allOk, false);
  assert.equal(r.words[5].ok, false);
  assert.equal(r.words.filter(function (w) { return !w.ok; }).length, 1);
});

test("alignReading: ruido del reconocedor en palabras largas", function () {
  assert.equal(Practice.alignReading("Vio una estrella.", "vio una estrela").allOk, true);
});

test("alignReading: repeticiones y palabras extra", function () {
  assert.equal(Practice.alignReading(CAMA, "el el gato gato duerme en la la cama").allOk, true);
});

test("alignReading: desorden", function () {
  assert.equal(Practice.alignReading(CAMA, "cama la en duerme gato el").allOk, false);
});

test("alignReading: puntuación y diálogo", function () {
  assert.equal(Practice.alignReading("—¡Ven, Mira! —grita Antón.", "ven mira grita anton").allOk, true);
});

test("alignReading: homófonos", function () {
  assert.equal(Practice.alignReading("La casa es grande.", "la caza es grande").allOk, true);
});

test("alignReading: silencio", function () {
  ["", "   "].forEach(function (h) {
    var r = Practice.alignReading(CAMA, h);
    assert.equal(r.unheard, true);
    assert.equal(r.allOk, false);
    assert.ok(r.words.every(function (w) { return !w.ok; }));
  });
});

test("decideNext", function () {
  var good = Practice.alignReading(CAMA, "el gato duerme en la cama");
  var bad = Practice.alignReading(CAMA, "el gato duerme en la casa");
  var none = Practice.alignReading(CAMA, "");
  assert.equal(Practice.decideNext(1, good), "accept");
  assert.equal(Practice.decideNext(1, bad), "reread");
  assert.equal(Practice.decideNext(2, bad), "model");
  assert.equal(Practice.decideNext(3, good), "accept");
  assert.equal(Practice.decideNext(1, none), "again");
  assert.equal(Practice.decideNext(2, none), "again");
});

test("métricas: wpm y pausa", function () {
  assert.equal(Practice.wordsPerMinute(30, 30000), 60);
  assert.equal(Practice.wordsPerMinute(10, 0), 0);
  assert.equal(Practice.PAUSE_AFTER_MS, 600000);
  assert.equal(Practice.shouldOfferPause(599999), false);
  assert.equal(Practice.shouldOfferPause(600000), true);
});

test("palabras difíciles", function () {
  var base = {};
  assert.deepEqual(Practice.mergeDifficult(base, ["bahía", "bahía", "oruga"]), { bahía: 2, oruga: 1 });
  assert.deepEqual(base, {});
  assert.deepEqual(Practice.mergeDifficult({ oruga: 1 }, ["Oruga."]), { oruga: 2 });
  assert.deepEqual(Practice.topDifficult({ bahía: 2, oruga: 1, mariposa: 1 }, 2), ["bahía", "mariposa"]);
});

test("isFluent", function () {
  assert.equal(Practice.isFluent(2, 20), true);
  assert.equal(Practice.isFluent(4, 20), true);
  assert.equal(Practice.isFluent(5, 20), false);
  assert.equal(Practice.isFluent(0, 0), false);
});

test("orden y desbloqueo de historias", function () {
  function st(id, n) { return { id: id, sections: [{ text: { es: new Array(n + 1).join("a ").trim() } }] }; }
  assert.deepEqual(Practice.orderStoriesByWords([st("x", 40), st("y", 10), st("z", 25)], "es"), ["y", "z", "x"]);
  var ids = ["a", "b", "c", "d", "e"];
  assert.deepEqual(Practice.unlockedStoryIds(ids, []), ["a", "b", "c"]);
  assert.deepEqual(Practice.unlockedStoryIds(ids, ["a"]), ["a", "b", "c", "d"]);
  assert.equal(Practice.unlockedStoryIds(ids, ["a", "a", "x"]).length, 4);
});

test("syllabify", function () {
  var table = {
    "bahía": ["ba", "hí", "a"], "mariposa": ["ma", "ri", "po", "sa"], "escondidas": ["es", "con", "di", "das"],
    "estrella": ["es", "tre", "lla"], "perezoso": ["pe", "re", "zo", "so"], "cohete": ["co", "he", "te"],
    "cueva": ["cue", "va"], "brújula": ["brú", "ju", "la"], "oruga": ["o", "ru", "ga"], "a": ["a"],
    "queso": ["que", "so"], "guerra": ["gue", "rra"], "rey": ["rey"]
  };
  Object.keys(table).forEach(function (w) { assert.deepEqual(Practice.syllabify(w), table[w], w); });
  assert.deepEqual(Practice.syllabify("xyz"), ["xyz"]);
  assert.deepEqual(Practice.syllabify(""), []);
});

test("Recognizer", function () {
  var Recognizer = require("../src/recognizer.js");
  assert.equal(Recognizer.mapError("not-allowed"), "not-allowed");
  assert.equal(Recognizer.mapError("service-not-allowed"), "not-allowed");
  assert.equal(Recognizer.mapError("no-speech"), "no-speech");
  assert.equal(Recognizer.mapError("aborted"), "aborted");
  assert.equal(Recognizer.mapError("audio-capture"), "other");
  assert.equal(Recognizer.isSupported(), false);
  var fake = { start: function () {}, stop: function () {} };
  Recognizer.setFactory(function () { return fake; });
  assert.equal(Recognizer.create({}), fake);
  Recognizer.setFactory(null);
});
