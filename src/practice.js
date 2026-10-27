// Lógica pura del modo "Práctica en voz alta" (sin DOM; se prueba en Node).
var Practice = (function () {
  "use strict";

  function stripAccents(s) {            // quita tildes pero conserva la ñ
    return s.replace(/ñ/g, "\u0001").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .normalize("NFC").replace(/\u0001/g, "ñ");
  }

  function normalizeWords(text) {
    var s = stripAccents(String(text).toLowerCase()).replace(/[¡!¿?.,;:—«»"'“”()…\-]/g, " ");
    return s.split(/\s+/).filter(Boolean);
  }

  function isLower(ch) { return ch && ch !== ch.toUpperCase(); }

  function splitSentences(text) {
    var s = String(text).replace(/\s+/g, " ").trim();
    if (!s) return [];
    var out = [], start = 0, re = /[.!?]+[»”")]*(?= )/g, m;
    while ((m = re.exec(s))) {
      var end = m.index + m[0].length;
      var rest = s.slice(end).replace(/^ +/, "");
      var next = rest.charAt(0) === "—" ? rest.charAt(1) : rest.charAt(0);
      if (rest && isLower(next)) continue;   // sigue la misma frase (— grita, o minúscula)
      out.push(s.slice(start, end).trim());
      start = end;
    }
    var tail = s.slice(start).trim();
    if (tail) out.push(tail);
    return out;
  }

  var api = {
    splitSentences: splitSentences,
    normalizeWords: normalizeWords,
    _stripAccents: stripAccents
  };
  return api;
})();

if (typeof module !== "undefined" && module.exports) module.exports = Practice;
