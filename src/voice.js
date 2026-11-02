// Claves y lista de clips de las voces pregeneradas (sin DOM; se prueba en Node).
var Voice = (function () {
  "use strict";

  function normalize(text) {
    return String(text).normalize("NFC").replace(/\s+/g, " ").trim();
  }

  function cyrb53(str) {                // hash de 53 bits, semilla 0
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57, i, ch;
    for (i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  function key(lang, text) {
    var hex = cyrb53(lang + "|" + normalize(text)).toString(16);
    while (hex.length < 14) hex = "0" + hex;
    return hex;
  }

  function clipsFor(content, practice) {
    var seen = {}, out = [];
    function add(lang, text) {
      if (typeof text !== "string") return;
      var t = normalize(text);
      if (!t) return;
      var k = key(lang, t);
      if (seen[lang + "|" + k]) return;
      seen[lang + "|" + k] = true;
      out.push({ key: k, lang: lang, text: t });
    }
    content.worlds.forEach(function (w) {
      w.stories.forEach(function (s) {
        s.sections.forEach(function (sec) {
          var text = sec.text || {}, easy = sec.easy || {};
          add("es", text.es);
          add("es", easy.es);
          add("en", text.en);
          add("en", easy.en);
          (sec.tasks || []).forEach(function (task) {          // "Leer en voz alta" del vocabulario
            if (task && task.type === "vocab" && task.word) { add("es", task.word.es); add("en", task.word.en); }
          });
          if (typeof text.es !== "string") return;
          practice.splitSentences(text.es).forEach(function (sentence) {
            add("es", sentence);
            sentence.split(/\s+/).forEach(function (word) {
              var cw = practice.cleanWord(word);
              if (cw) add("es", cw);
            });
          });
        });
      });
    });
    out.sort(function (a, b) {
      if (a.lang !== b.lang) return a.lang < b.lang ? -1 : 1;
      return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    });
    return out;
  }

  function clipUrl(lang, k) {
    return "audio/" + lang + "/" + k + ".mp3";
  }

  function resolve(manifest, lang, text) {
    if (!manifest || !manifest.clips) return null;
    var k = key(lang, text);
    var clip = Object.prototype.hasOwnProperty.call(manifest.clips, k) ? manifest.clips[k] : null;
    return clip && clip.lang === lang ? clipUrl(lang, k) : null;
  }

  // Clips del idioma que aún no están guardados; isCached(url) decide (la app consulta el caché).
  function pendingFor(manifest, lang, isCached) {
    var out = [];
    if (!manifest || !manifest.clips) return out;
    Object.keys(manifest.clips).sort().forEach(function (k) {
      var c = manifest.clips[k];
      if (c && c.lang === lang && !isCached(clipUrl(lang, k))) out.push({ key: k, bytes: c.bytes || 0 });
    });
    return out;
  }

  return { pendingFor: pendingFor, normalize: normalize, key: key, clipsFor: clipsFor, clipUrl: clipUrl, resolve: resolve };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Voice;
