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

  function phoneticKey(word) {
    var s = stripAccents(String(word).toLowerCase());
    s = s.replace(/ch/g, "\u0003").replace(/qu/g, "k").replace(/gu(?=[ei])/g, "\u0002")
      .replace(/ll/g, "y").replace(/h/g, "").replace(/c(?=[ei])/g, "s").replace(/c/g, "k")
      .replace(/z/g, "s").replace(/v/g, "b").replace(/g(?=[ei])/g, "x").replace(/j/g, "x")
      .replace(/w/g, "u").replace(/\u0002/g, "g");
    return s;
  }

  function editDistance(a, b) {
    var prev = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      var cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  function sameWord(exp, heard) {         // exp/heard ya normalizadas
    if (phoneticKey(exp) === phoneticKey(heard)) return true;
    return exp.length >= 7 && editDistance(exp, heard) <= 1;
  }

  function alignReading(expected, heard) {
    var tokens = String(expected).split(/\s+/).filter(Boolean);
    var heardWords = normalizeWords(heard);
    var norm = tokens.map(function (tk) { return normalizeWords(tk).join(""); });
    var unheard = heardWords.length === 0;
    var n = tokens.length, m = heardWords.length, i, j;
    var L = [];
    for (i = 0; i <= n; i++) { L[i] = []; for (j = 0; j <= m; j++) L[i][j] = 0; }
    for (i = n - 1; i >= 0; i--) {
      for (j = m - 1; j >= 0; j--) {
        L[i][j] = (norm[i] && sameWord(norm[i], heardWords[j]))
          ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
      }
    }
    var matched = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (norm[i] && sameWord(norm[i], heardWords[j]) && L[i][j] === L[i + 1][j + 1] + 1) { matched[i] = true; i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) i++;
      else j++;
    }
    var words = tokens.map(function (tk, k) {
      var ok = unheard ? false : (!norm[k] || matched[k] === true || norm[k].length <= 2);
      return { text: tk, ok: ok };
    });
    return { words: words, allOk: !unheard && words.every(function (w) { return w.ok; }), unheard: unheard };
  }

  function decideNext(attempt, result) {
    if (result.unheard) return "again";
    if (result.allOk) return "accept";
    return attempt <= 1 ? "reread" : "model";
  }

  var api = {
    splitSentences: splitSentences,
    normalizeWords: normalizeWords,
    phoneticKey: phoneticKey,
    alignReading: alignReading,
    decideNext: decideNext,
    _stripAccents: stripAccents
  };
  return api;
})();

if (typeof module !== "undefined" && module.exports) module.exports = Practice;
