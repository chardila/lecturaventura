var test = require("node:test");
var assert = require("node:assert/strict");
var loadContent = require("./helpers/load-content.js");

var CONTENT = loadContent();
var LANGS = ["es", "en"];
var TASK_TYPES = ["quiz", "predict", "vocab", "retell", "missing", "syllable", "wordimage", "sentence", "spellfix"];
var SERIES = {
  mili: { total: [300, 450], section: [80, 200], sentence: 14, name: { es: "Mili", en: "Millie" }, mate: { es: "Nubi", en: "Puff" } },
  dani: { total: [800, 1250], section: [120, 280], sentence: 20, name: { es: "Dani", en: "Danny" }, mate: { es: "Croqueta", en: "Crouton" } }
};
var BAD = {
  es: /muert|sangre|matar|monstruo|fantasma|asesin|cad[aá]ver/i,
  en: /\b(death|dead|dies|die|blood|kill|monster|ghost|murder|corpse)\b/i
};

function world(id) { return CONTENT.worlds.filter(function (w) { return w.id === id; })[0]; }
function words(str) { return (str.trim().match(/\S+/g) || []).length; }
function sentences(str) {
  return str.split(/[.!?…]+/).map(function (s) { return s.trim(); }).filter(Boolean);
}
function storyText(story, lang) {
  return story.sections.map(function (s) { return s.text[lang]; }).join(" ");
}

test("mundos largos: existen mili y dani con series y long", function () {
  Object.keys(SERIES).forEach(function (id) {
    var w = world(id);
    assert.ok(w, id);
    assert.equal(w.long, true);
    assert.equal(w.series, true);
    assert.equal(w.unlockStars, 0);
  });
});

test("cada serie tiene 3 historias con ids ordenados", function () {
  Object.keys(SERIES).forEach(function (id) {
    assert.deepEqual(world(id).stories.map(function (s) { return s.id; }), [id + "-1", id + "-2", id + "-3"]);
  });
});

test("los ids de historia no se repiten en todo el contenido", function () {
  var seen = {};
  CONTENT.worlds.forEach(function (w) {
    w.stories.forEach(function (s) { assert.equal(seen[s.id], undefined, s.id); seen[s.id] = true; });
  });
});

test("cada historia tiene título, intro, level y wpm y secciones en es y en", function () {
  Object.keys(SERIES).forEach(function (id) {
    world(id).stories.forEach(function (st) {
      LANGS.forEach(function (l) {
        assert.ok(st.title[l] && st.intro[l], st.id + " " + l);
        st.sections.forEach(function (sec) { assert.ok(sec.text[l], st.id + " " + l); });
      });
      assert.ok(st.level >= 1 && st.level <= 3, st.id);
      assert.ok(st.wpm > 0, st.id);
      assert.ok(st.sections.length >= 3, st.id);
    });
  });
});

test("cada sección tiene 1 o 2 tareas de opción múltiple válidas", function () {
  Object.keys(SERIES).forEach(function (id) {
    world(id).stories.forEach(function (st) {
      st.sections.forEach(function (sec, i) {
        var where = st.id + " sec " + (i + 1);
        assert.ok(sec.tasks.length >= 1 && sec.tasks.length <= 2, where);
        sec.tasks.forEach(function (t) {
          assert.ok(TASK_TYPES.indexOf(t.type) >= 0, where + " tipo " + t.type);
          LANGS.forEach(function (l) {
            assert.ok(t.q[l], where);
            assert.ok(t.options[l].length >= 4 && t.options[l].length <= 6, where);
          });
          assert.equal(t.options.es.length, t.options.en.length, where);
          assert.ok(Number.isInteger(t.answer) && t.answer >= 0 && t.answer < t.options.es.length, where);
          if (t.type === "vocab") {
            LANGS.forEach(function (l) {
              assert.ok(sec.text[l].toLowerCase().indexOf(t.word[l].toLowerCase()) >= 0, where + " vocab " + t.word[l]);
            });
          }
        });
      });
    });
  });
});

test("largo: total y secciones dentro del rango de cada serie, en ambos idiomas", function () {
  Object.keys(SERIES).forEach(function (id) {
    var cfg = SERIES[id];
    world(id).stories.forEach(function (st) {
      LANGS.forEach(function (l) {
        var n = words(storyText(st, l));
        assert.ok(n >= cfg.total[0] && n <= cfg.total[1], st.id + " " + l + " total " + n);
        st.sections.forEach(function (sec, i) {
          var m = words(sec.text[l]);
          assert.ok(m >= cfg.section[0] && m <= cfg.section[1], st.id + " " + l + " sec " + (i + 1) + ": " + m);
        });
      });
    });
  });
});

test("frases cortas: ninguna frase supera el máximo de la serie", function () {
  Object.keys(SERIES).forEach(function (id) {
    world(id).stories.forEach(function (st) {
      LANGS.forEach(function (l) {
        sentences(storyText(st, l)).forEach(function (s) {
          assert.ok(words(s) <= SERIES[id].sentence, st.id + " " + l + ": " + s);
        });
      });
    });
  });
});

test("tono: sin palabras de la lista de comprobación", function () {
  Object.keys(SERIES).forEach(function (id) {
    world(id).stories.forEach(function (st) {
      LANGS.forEach(function (l) {
        assert.doesNotMatch(storyText(st, l), BAD[l], st.id + " " + l);
      });
    });
  });
});

test("continuidad: las historias 2 y 3 mencionan al protagonista y a su compañero", function () {
  Object.keys(SERIES).forEach(function (id) {
    var cfg = SERIES[id];
    world(id).stories.slice(1).forEach(function (st) {
      LANGS.forEach(function (l) {
        var text = storyText(st, l);
        assert.ok(text.indexOf(cfg.name[l]) >= 0, st.id + " " + l + " protagonista");
        assert.ok(text.indexOf(cfg.mate[l]) >= 0, st.id + " " + l + " compañero");
      });
    });
  });
});

test("cada mundo tiene insignia en es y en (Libro del tesoro y fin de historia)", function () {
  var fs = require("fs"), path = require("path");
  var src = ["content.js", "stories-long.js"].map(function (f) {
    return fs.readFileSync(path.join(__dirname, "../src/" + f), "utf8");
  }).join("\n");
  var r = new Function(src + "; return { CONTENT: CONTENT, BADGES: BADGES }")();
  r.CONTENT.worlds.forEach(function (w) {
    var b = r.BADGES[w.id];
    assert.ok(b && b.emoji && b.es && b.en, "falta insignia para " + w.id);
  });
});
