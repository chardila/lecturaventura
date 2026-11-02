var test = require("node:test");
var assert = require("node:assert/strict");
var Voice = require("../src/voice.js");
var Practice = require("../src/practice.js");
var loadContent = require("./helpers/load-content.js");

test("key: estable y de 14 hex", function () {
  var k = Voice.key("es", "Hola mundo");
  assert.match(k, /^[0-9a-f]{14}$/);
  assert.equal(Voice.key("es", "Hola mundo"), k);
  // Literales fijos: el generador (Node) y el navegador deben coincidir siempre.
  assert.equal(Voice.key("es", "Hola mundo"), "1680588257a02a");
  assert.equal(Voice.key("en", "Hello world"), "1db5334e396823");
});

test("key: normaliza espacios", function () {
  assert.equal(Voice.key("es", "Hola\n  mundo "), Voice.key("es", "Hola mundo"));
});

test("key: distingue idioma y puntuación", function () {
  assert.notEqual(Voice.key("es", "Hola"), Voice.key("en", "Hola"));
  assert.notEqual(Voice.key("es", "Hola"), Voice.key("es", "Hola."));
});

test("normalize: conserva ñ y tildes (NFC)", function () {
  var combining = "mama\u0301", precomposed = "mam\u00e1";
  assert.notEqual(combining, precomposed);
  assert.equal(Voice.normalize(combining + " ni\u00f1o"), precomposed + " ni\u00f1o");
  assert.equal(Voice.key("es", combining), Voice.key("es", precomposed));
  assert.equal(Voice.key("es", precomposed), "07b65a05826041");
});

function sections(content) {
  var out = [];
  content.worlds.forEach(function (w) {
    w.stories.forEach(function (s) {
      s.sections.forEach(function (sec) { out.push(sec); });
    });
  });
  return out;
}

test("clipsFor: sin duplicados, ordenado, con textos, frases y palabras", function () {
  var content = loadContent();
  var clips = Voice.clipsFor(content, Practice);
  var keys = clips.map(function (c) { return c.lang + "|" + c.key; });
  assert.equal(new Set(keys).size, keys.length);
  var sorted = clips.slice().sort(function (a, b) {
    return a.lang < b.lang ? -1 : a.lang > b.lang ? 1 : a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });
  assert.deepEqual(clips, sorted);
  var has = function (lang, text) {
    var k = Voice.key(lang, text);
    return clips.some(function (c) { return c.lang === lang && c.key === k; });
  };
  var sec = sections(content).filter(function (s) { return s.easy && s.easy.es; })[0];
  assert.ok(sec, "hay una sección con easy");
  assert.ok(has("es", sec.text.es));
  assert.ok(has("es", sec.easy.es));
  assert.ok(has("en", sec.text.en));
  var sents = Practice.splitSentences(sec.text.es);
  assert.ok(sents.length > 0);
  sents.forEach(function (s) {
    assert.ok(has("es", s));
    assert.ok(!has("en", s));
    s.split(/\s+/).forEach(function (w) {
      var cw = Practice.cleanWord(w);
      if (cw) {
        assert.ok(has("es", cw));
        assert.ok(!has("en", cw));
      }
    });
  });
});

test("clipsFor: incluye easy.en", function () {
  var content = loadContent();
  var clips = Voice.clipsFor(content, Practice);
  var sec = sections(content).filter(function (s) { return s.easy && s.easy.en; })[0];
  assert.ok(sec, "hay una sección con easy.en");
  var k = Voice.key("en", sec.easy.en);
  assert.ok(clips.some(function (c) { return c.lang === "en" && c.key === k; }));
});

test("clipUrl", function () {
  assert.equal(Voice.clipUrl("es", "abc"), "audio/es/abc.mp3");
});

test("resolve: URL o null", function () {
  var k = Voice.key("es", "Hola mundo");
  var m = { version: 1, clips: {} };
  m.clips[k] = { lang: "es", bytes: 1 };
  assert.equal(Voice.resolve(m, "es", "Hola mundo"), "audio/es/" + k + ".mp3");
  assert.equal(Voice.resolve(null, "es", "Hola mundo"), null);
  assert.equal(Voice.resolve(m, "es", "Otra cosa"), null);
  assert.equal(Voice.resolve(m, "en", "Hola mundo"), null);
});

test("pendingFor: solo clips del idioma que aún no están guardados", function () {
  var manifest = { version: 1, clips: {
    aaa: { lang: "es", bytes: 10 }, bbb: { lang: "es", bytes: 20 },
    ccc: { lang: "en", bytes: 30 }
  } };
  var cached = { "audio/es/aaa.mp3": true };
  var out = Voice.pendingFor(manifest, "es", function (url) { return !!cached[url]; });
  assert.deepEqual(out, [{ key: "bbb", bytes: 20 }]);
  assert.deepEqual(Voice.pendingFor(manifest, "en", function () { return false; }), [{ key: "ccc", bytes: 30 }]);
  assert.deepEqual(Voice.pendingFor(null, "es", function () { return false; }), []);
});

test("clipsFor: incluye las palabras de vocabulario (es y en)", function () {
  var content = loadContent();
  var clips = Voice.clipsFor(content, Practice);
  var n = 0;
  sections(content).forEach(function (sec) {
    (sec.tasks || []).forEach(function (task) {
      if (task.type !== "vocab") return;
      ["es", "en"].forEach(function (lang) {
        var w = task.word && task.word[lang];
        if (!w) return;
        n++;
        var k = Voice.key(lang, w);
        assert.ok(clips.some(function (c) { return c.lang === lang && c.key === k; }), lang + ": " + w);
      });
    });
  });
  assert.ok(n > 0);
});
