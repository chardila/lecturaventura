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

  var PAUSE_AFTER_MS = 600000;
  function shouldOfferPause(elapsedMs) { return elapsedMs >= PAUSE_AFTER_MS; }

  function wordsPerMinute(words, ms) {
    return ms > 0 ? Math.round(words / (ms / 60000)) : 0;
  }

  function cleanWord(w) {
    return String(w).toLowerCase().replace(/[¡!¿?.,;:—«»"'“”()…\-]/g, "").trim();
  }

  function mergeDifficult(store, words) {
    var out = {}, k;
    for (k in store) if (Object.prototype.hasOwnProperty.call(store, k)) out[k] = store[k];
    words.forEach(function (w) {
      var key = cleanWord(w);
      if (key) out[key] = (out[key] || 0) + 1;
    });
    return out;
  }

  function topDifficult(store, n) {
    return Object.keys(store).sort(function (a, b) {
      return (store[b] - store[a]) || (b.length - a.length);
    }).slice(0, n);
  }

  function isFluent(helped, total) { return total > 0 && helped / total <= 0.2; }

  function storyWords(story, lang) {
    var n = 0;
    story.sections.forEach(function (sec) {
      var txt = sec.text && (sec.text[lang] || "");
      n += normalizeWords(txt).length;
    });
    return n;
  }

  function orderStoriesByWords(stories, lang) {
    return stories.map(function (s, i) { return { id: s.id, n: storyWords(s, lang), i: i }; })
      .sort(function (a, b) { return (a.n - b.n) || (a.i - b.i); })
      .map(function (x) { return x.id; });
  }

  function unlockedStoryIds(orderedIds, fluentDone) {
    var seen = {}, extra = 0;
    fluentDone.forEach(function (id) {
      if (!seen[id] && orderedIds.indexOf(id) >= 0) { seen[id] = true; extra++; }
    });
    return orderedIds.slice(0, 3 + extra);
  }

  var VOWELS = "aeiouáéíóúü";
  var INSEPARABLE = ["pr", "br", "tr", "dr", "cr", "gr", "fr", "kr", "pl", "bl", "cl", "gl", "fl"];

  function isHiatus(a, b) {
    if ("íú".indexOf(a) >= 0 || "íú".indexOf(b) >= 0) return true;
    return "iuü".indexOf(a) < 0 && "iuü".indexOf(b) < 0;   // dos vocales fuertes
  }

  function tokenize(w) {
    var toks = [], i = 0, two, c;
    while (i < w.length) {
      c = w.charAt(i); two = w.substr(i, 2);
      if (two === "ch" || two === "ll" || two === "rr") { toks.push({ v: false, s: two }); i += 2; }
      else if ((two === "qu" || two === "gu") && "eéií".indexOf(w.charAt(i + 2)) >= 0 && i + 2 < w.length) { toks.push({ v: false, s: two }); i += 2; }
      else if (VOWELS.indexOf(c) >= 0) {
        var last = toks[toks.length - 1];
        if (last && last.v && !isHiatus(last.s.charAt(last.s.length - 1), c)) last.s += c;
        else toks.push({ v: true, s: c });
        i++;
      } else { toks.push({ v: false, s: c }); i++; }
    }
    return toks;
  }

  function syllabify(word) {
    var w = String(word).toLowerCase();
    if (!w) return [];
    var toks = tokenize(w), nuc = [], i;
    toks.forEach(function (tk, k) { if (tk.v) nuc.push(k); });
    if (!nuc.length) return [w];
    var sylls = [], pos = 0;
    nuc.forEach(function (ni, idx) {
      var nextN = idx + 1 < nuc.length ? nuc[idx + 1] : toks.length;
      var cs = toks.slice(ni + 1, nextN);
      var give;
      if (idx + 1 === nuc.length) give = cs.length;
      else if (cs.length <= 1) give = 0;
      else if (cs.length === 2) give = INSEPARABLE.indexOf(cs[0].s + cs[1].s) >= 0 ? 0 : 1;
      else if (cs.length === 3) give = INSEPARABLE.indexOf(cs[1].s + cs[2].s) >= 0 ? 1 : 2;
      else give = cs.length - 2;
      var end = ni + 1 + give;
      sylls.push(toks.slice(pos, end).map(function (x) { return x.s; }).join(""));
      pos = end;
    });
    return sylls;
  }

  var api = {
    splitSentences: splitSentences,
    normalizeWords: normalizeWords,
    cleanWord: cleanWord,
    phoneticKey: phoneticKey,
    alignReading: alignReading,
    decideNext: decideNext,
    syllabify: syllabify,
    PAUSE_AFTER_MS: PAUSE_AFTER_MS,
    shouldOfferPause: shouldOfferPause,
    wordsPerMinute: wordsPerMinute,
    mergeDifficult: mergeDifficult,
    topDifficult: topDifficult,
    isFluent: isFluent,
    orderStoriesByWords: orderStoriesByWords,
    unlockedStoryIds: unlockedStoryIds,
    _stripAccents: stripAccents
  };
  return api;
})();

if (typeof module !== "undefined" && module.exports) module.exports = Practice;
