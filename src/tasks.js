// Lógica pura para presentar opciones de tareas (sin DOM; se prueba en Node).
var Tasks = (function () {
  "use strict";

  // Baraja una copia de options con Fisher-Yates y remapea el índice answer.
  // Si answer < 0 (p. ej. predict), baraja igual y conserva answer tal cual.
  function shuffleOptions(options, answer, rng) {
    var list = Array.isArray(options) ? options : [];
    var rand = typeof rng === "function" ? rng : Math.random;
    var order = [];
    for (var i = 0; i < list.length; i++) order.push(i);
    for (var k = order.length - 1; k > 0; k--) {
      var j = Math.floor(rand() * (k + 1));
      var tmp = order[k]; order[k] = order[j]; order[j] = tmp;
    }
    var out = order.map(function (idx) { return list[idx]; });
    var nextAnswer = (typeof answer === "number" && answer >= 0 && answer < list.length)
      ? order.indexOf(answer)
      : answer;
    return { options: out, answer: nextAnswer };
  }

  return { shuffleOptions: shuffleOptions };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Tasks;
