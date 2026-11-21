var test = require("node:test");
var assert = require("node:assert/strict");
var Tasks = require("../src/tasks.js");

function seqRng(vals) {
  var i = 0;
  return function () { return vals[i++ % vals.length]; };
}

test("shuffleOptions: conserva todas las opciones y no muta el arreglo original", function () {
  var orig = ["A", "B", "C", "D"];
  var snap = orig.slice();
  var res = Tasks.shuffleOptions(orig, 0, function () { return 0; });
  assert.deepEqual(orig, snap);
  assert.notEqual(res.options, orig);
  assert.equal(res.options.length, orig.length);
  assert.deepEqual(res.options.slice().sort(), orig.slice().sort());
});

test("shuffleOptions: sigue el orden determinista de Fisher-Yates", function () {
  var orig = ["A", "B", "C", "D"];
  var resZero = Tasks.shuffleOptions(orig, 0, function () { return 0; });
  assert.deepEqual(resZero.options, ["B", "C", "D", "A"]);
  assert.equal(resZero.answer, 3);

  var resSeq = Tasks.shuffleOptions(orig, 0, seqRng([0.5, 0.25, 0.9]));
  assert.deepEqual(resSeq.options, ["D", "B", "A", "C"]);
  assert.equal(resSeq.answer, 2);
});

test("shuffleOptions: remapea correctamente índices al inicio, medio y final", function () {
  var orig = ["uno", "dos", "tres", "cuatro", "cinco"];
  [0, 2, 4].forEach(function (idx) {
    var r1 = Tasks.shuffleOptions(orig, idx, function () { return 0; });
    assert.equal(r1.options[r1.answer], orig[idx]);
    var r2 = Tasks.shuffleOptions(orig, idx, seqRng([0.75, 0.1, 0.6, 0.4]));
    assert.equal(r2.options[r2.answer], orig[idx]);
  });
});

test("shuffleOptions: preguntas abiertas (answer -1) barajan opciones y conservan -1", function () {
  var orig = ["op1", "op2", "op3", "op4"];
  var res = Tasks.shuffleOptions(orig, -1, function () { return 0; });
  assert.equal(res.answer, -1);
  assert.deepEqual(res.options, ["op2", "op3", "op4", "op1"]);
  assert.deepEqual(orig, ["op1", "op2", "op3", "op4"]);
});

test("shuffleOptions: casos borde (vacío, un elemento, sin rng)", function () {
  var emptyOpen = Tasks.shuffleOptions([], -1);
  assert.deepEqual(emptyOpen, { options: [], answer: -1 });

  var emptyZero = Tasks.shuffleOptions([], 0);
  assert.deepEqual(emptyZero, { options: [], answer: 0 });

  var single = Tasks.shuffleOptions(["X"], 0);
  assert.deepEqual(single, { options: ["X"], answer: 0 });
});

test("shuffleOptions: distribuye la respuesta correcta entre todas las posiciones", function () {
  var orig = ["correcta", "d1", "d2", "d3"];
  var counts = [0, 0, 0, 0];
  for (var i = 0; i < 200; i++) {
    var res = Tasks.shuffleOptions(orig, 0);
    assert.equal(res.options[res.answer], "correcta");
    counts[res.answer]++;
  }
  counts.forEach(function (c, pos) {
    assert.ok(c > 0, "la posición " + pos + " nunca salió");
  });
});
