// Envoltorio del reconocimiento de voz del navegador (Web Speech API).
// La voz no se graba ni se envía desde la app; solo se usa el texto que devuelve el navegador.
var Recognizer = (function () {
  "use strict";
  var factory = null;

  function ctor() {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  function isSupported() { return !!ctor(); }

  function mapError(code) {
    if (code === "not-allowed" || code === "service-not-allowed") return "not-allowed";
    if (code === "no-speech") return "no-speech";
    if (code === "aborted") return "aborted";
    return "other";
  }

  function create(opts) {
    if (factory) return factory(opts);
    var SR = ctor(), rec = new SR(), active = false;
    rec.lang = opts.lang;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    function collect(e, finalOnly) {
      var text = "";
      for (var i = 0; i < e.results.length; i++) {
        if (finalOnly && !e.results[i].isFinal) continue;
        text += " " + e.results[i][0].transcript;
      }
      return text.trim();
    }
    var lastFinal = "";
    rec.onresult = function (e) {
      var last = e.results[e.results.length - 1];
      if (last.isFinal) { lastFinal = collect(e, true); }
      else if (opts.onInterim) opts.onInterim(collect(e, false));
    };
    rec.onerror = function (e) { if (opts.onError) opts.onError(e.error); };
    rec.onend = function () {
      active = false;
      if (lastFinal && opts.onFinal) { var f = lastFinal; lastFinal = ""; opts.onFinal(f); }
      if (opts.onEnd) opts.onEnd();
    };
    return {
      start: function () {
        if (active) return;
        active = true; lastFinal = "";
        try { rec.start(); } catch (err) { active = false; if (opts.onError) opts.onError("other"); }
      },
      stop: function () {
        if (!active) return;
        try { rec.abort(); } catch (err) { /* ya parado */ }
      }
    };
  }

  function setFactory(fn) { factory = fn || null; }

  return { isSupported: isSupported, mapError: mapError, create: create, setFactory: setFactory };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Recognizer;
