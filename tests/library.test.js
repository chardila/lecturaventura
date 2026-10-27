var test = require("node:test");
var assert = require("node:assert/strict");
var Library = require("../src/library.js");

function world(id, over) {
  return Object.assign({ id: id, stories: [
    { id: id + "-1", title: { es: "A", en: "A" } },
    { id: id + "-2", title: { es: "B", en: "B" } },
    { id: id + "-3", title: { es: "C", en: "C" } }
  ] }, over || {});
}
var worlds = [world("w1"), world("w2", { long: true, series: true })];
function ids(list) { return list.map(function (w) { return w.id; }); }

test("visibleWorlds: all deja cortos y largos", function () {
  assert.deepEqual(ids(Library.visibleWorlds(worlds, "es", "all")), ["w1", "w2"]);
});
test("visibleWorlds: short quita los long", function () {
  assert.deepEqual(ids(Library.visibleWorlds(worlds, "es", "short")), ["w1"]);
});
test("visibleWorlds: long deja solo los long", function () {
  assert.deepEqual(ids(Library.visibleWorlds(worlds, "es", "long")), ["w2"]);
});
test("visibleWorlds: sin historia en el idioma no aparece", function () {
  var onlyEs = world("w3", { stories: [{ id: "x", title: { es: "A" } }] });
  assert.deepEqual(ids(Library.visibleWorlds([onlyEs, worlds[0]], "en", "all")), ["w1"]);
  assert.deepEqual(ids(Library.visibleWorlds([world("e", { stories: [] })], "es", "all")), []);
});
test("visibleWorlds: modo desconocido o ausente se trata como all", function () {
  assert.deepEqual(ids(Library.visibleWorlds(worlds, "es", "zzz")), ["w1", "w2"]);
  assert.deepEqual(ids(Library.visibleWorlds(worlds, "es", undefined)), ["w1", "w2"]);
});
test("isStoryOpen: mundo sin series siempre abierto", function () {
  assert.equal(Library.isStoryOpen(worlds[0], 2, {}), true);
});
test("isStoryOpen: en serie, la primera abierta y la segunda tras terminar la primera", function () {
  assert.equal(Library.isStoryOpen(worlds[1], 0, {}), true);
  assert.equal(Library.isStoryOpen(worlds[1], 1, {}), false);
  assert.equal(Library.isStoryOpen(worlds[1], 1, { "w2-1": true }), true);
});
test("isStoryOpen: la tercera necesita la segunda, no la primera", function () {
  assert.equal(Library.isStoryOpen(worlds[1], 2, { "w2-1": true }), false);
  assert.equal(Library.isStoryOpen(worlds[1], 2, { "w2-2": true }), true);
});
