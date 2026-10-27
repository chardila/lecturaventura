var test = require("node:test");
var assert = require("node:assert/strict");
var Profiles = require("../src/profiles.js");

function prof(over) {
  return Object.assign({ id: "a", name: "Ana", avatar: "🦊", lang: "es" }, over || {});
}

test("emptyStore y defaultGame", function () {
  assert.deepEqual(Profiles.emptyStore(), { version: 2, lastLang: null, profiles: [] });
  var g = Profiles.defaultGame();
  g.stars = 5; g.badges.x = true;
  var g2 = Profiles.defaultGame();
  assert.equal(g2.stars, 0);
  assert.deepEqual(g2.badges, {});
  assert.equal(g2.level, 1);
});

test("parseStore: entradas inválidas dan tienda vacía", function () {
  [null, "no es json", '{"coins":5,"stars":3}', '{"version":2}'].forEach(function (raw) {
    assert.deepEqual(Profiles.parseStore(raw), Profiles.emptyStore(), String(raw));
  });
});

test("parseStore: rellena lo que falta", function () {
  var raw = JSON.stringify({ version: 2, profiles: [prof({ lang: "xx" })] });
  var s = Profiles.parseStore(raw);
  assert.equal(s.profiles.length, 1);
  var p = s.profiles[0];
  assert.equal(p.lang, "es");
  assert.equal(p.theme, "light");
  assert.equal(p.sound, true);
  assert.equal(p.game.level, 1);
});

test("parseStore: descarta perfiles inválidos y limita a 8", function () {
  var bad = [prof({ id: undefined }), prof({ name: "  " })];
  var many = [];
  for (var i = 0; i < 10; i++) many.push(prof({ id: "p" + i }));
  var s = Profiles.parseStore(JSON.stringify({ version: 2, profiles: bad.concat(many) }));
  assert.equal(s.profiles.length, 8);
  assert.equal(s.profiles[0].id, "p0");
});

test("parseStore: conserva campos desconocidos de game", function () {
  var s = Profiles.parseStore(JSON.stringify({ version: 2, profiles: [prof({ game: { custom: 1, stars: 4 } })] }));
  assert.equal(s.profiles[0].game.custom, 1);
  assert.equal(s.profiles[0].game.stars, 4);
  assert.equal(s.profiles[0].game.level, 1);
});

test("addProfile", function () {
  var store = Profiles.emptyStore();
  var r = Profiles.addProfile(store, { name: "  Mateo ", avatar: "🐙", lang: "en" });
  assert.equal(r.ok, true);
  assert.equal(r.profile.name, "Mateo");
  assert.equal(r.profile.lang, "en");
  assert.equal(r.profile.theme, "light");
  assert.equal(store.profiles.length, 1);
  assert.equal(Profiles.findProfile(store, r.profile.id), r.profile);
  assert.equal(Profiles.findProfile(store, "nope"), null);
});

test("addProfile: errores", function () {
  var store = Profiles.emptyStore();
  ["", "   ", new Array(22).join("a")].forEach(function (n) {
    assert.equal(Profiles.addProfile(store, { name: n, avatar: "🐙", lang: "es" }).error, "name");
  });
  assert.equal(Profiles.addProfile(store, { name: "A", avatar: "x", lang: "es" }).error, "avatar");
  assert.equal(Profiles.addProfile(store, { name: "A", avatar: "🐙", lang: "fr" }).error, "lang");
  assert.equal(store.profiles.length, 0);
  for (var i = 0; i < 8; i++) assert.equal(Profiles.addProfile(store, { name: "Igual", avatar: "🐙", lang: "es" }).ok, true);
  assert.equal(Profiles.addProfile(store, { name: "Nueve", avatar: "🐙", lang: "es" }).error, "limit");
  assert.equal(store.profiles.length, 8);
  var ids = {}; store.profiles.forEach(function (p) { ids[p.id] = true; });
  assert.equal(Object.keys(ids).length, 8);
});

test("updateProfile", function () {
  var store = Profiles.emptyStore();
  var p = Profiles.addProfile(store, { name: "Ana", avatar: "🦊", lang: "es" }).profile;
  assert.equal(Profiles.updateProfile(store, p.id, { theme: "dark", sound: false, readScale: "large" }).ok, true);
  assert.equal(p.theme, "dark"); assert.equal(p.sound, false); assert.equal(p.readScale, "large");
  assert.equal(Profiles.updateProfile(store, p.id, { theme: "rojo" }).error, "value");
  assert.equal(Profiles.updateProfile(store, p.id, { name: "" }).error, "name");
  assert.equal(Profiles.updateProfile(store, "nope", { theme: "dark" }).error, "id");
  Profiles.updateProfile(store, p.id, { game: { stars: 99 } });
  assert.equal(p.game.stars, 0);
});

test("deleteProfile, resetProgress, resetAll", function () {
  var store = Profiles.emptyStore();
  var p = Profiles.addProfile(store, { name: "Ana", avatar: "🦊", lang: "es" }).profile;
  p.game.stars = 9;
  assert.equal(Profiles.resetProgress(store, p.id), true);
  assert.equal(p.game.stars, 0);
  assert.equal(p.name, "Ana");
  assert.equal(Profiles.resetProgress(store, "nope"), false);
  assert.equal(Profiles.deleteProfile(store, p.id), true);
  assert.equal(store.profiles.length, 0);
  assert.equal(Profiles.deleteProfile(store, p.id), false);
  assert.deepEqual(Profiles.resetAll(), Profiles.emptyStore());
});

test("toState y applyState", function () {
  var store = Profiles.emptyStore();
  var p = Profiles.addProfile(store, { name: "Ana", avatar: "🦊", lang: "es" }).profile;
  var st = Profiles.toState(p);
  assert.equal(st.name, "Ana"); assert.equal(st.lang, "es");
  assert.equal(st.stars, 0); assert.ok(st.practice);
  assert.notEqual(st, p);
  st.stars = 7; st.theme = "dark"; st.extra = 1;
  Profiles.applyState(p, st);
  assert.equal(p.game.stars, 7);
  assert.equal(p.theme, "dark");
  assert.equal(p.game.extra, 1);
  assert.equal(p.stars, undefined);
});
