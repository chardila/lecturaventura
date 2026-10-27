// Lógica pura de perfiles (sin DOM; se prueba en Node).
var Profiles = (function () {
  "use strict";

  var STORE_VERSION = 2;
  var SAVE_KEY = "lecturaventura.save.v2";
  var LEGACY_KEY = "lecturaventura.save.v1";
  var MAX_PROFILES = 8;
  var NAME_MAX = 20;
  var AVATARS = ["🦊", "🐙", "🐼", "🦁", "🐸", "🐵",
    "🦄", "🐢", "🐧", "🦉", "🐬", "🐝"];
  var SETTING_KEYS = ["name", "avatar", "lang", "theme", "readScale", "readFont", "sound"];
  var LANGS = ["es", "en"];
  var CHOICES = {
    theme: ["light", "dark"],
    readScale: ["small", "normal", "large"],
    readFont: ["standard", "dyslexia", "serif"]
  };

  function emptyStore() { return { version: STORE_VERSION, lastLang: null, profiles: [] }; }

  function defaultGame() {
    return {
      coins: 0, stars: 0, level: 1, xp: 0, streak: 0, lastPlayed: null,
      badges: {}, finished: {},
      stats: { sessions: 0, correct: 0, answered: 0, words: 0, seconds: 0,
        byType: { comprehension: { c: 0, n: 0 }, spelling: { c: 0, n: 0 }, vocab: { c: 0, n: 0 } } },
      history: [],
      mission: { day: null, read: false, correct: 0, finished: false },
      week: { id: null, count: 0 },
      practice: { sessions: [], difficult: {}, fluentDone: [], resume: null }
    };
  }

  function cleanName(name) {
    if (typeof name !== "string") return null;
    var n = name.trim();
    return n.length >= 1 && n.length <= NAME_MAX ? n : null;
  }
  function isObj(x) { return x && typeof x === "object" && !Array.isArray(x); }

  function normalizeProfile(p) {
    if (!isObj(p) || typeof p.id !== "string" || !p.id) return null;
    var name = cleanName(p.name);
    if (name === null) return null;
    return {
      id: p.id, name: name,
      avatar: AVATARS.indexOf(p.avatar) >= 0 ? p.avatar : AVATARS[0],
      lang: LANGS.indexOf(p.lang) >= 0 ? p.lang : "es",
      theme: CHOICES.theme.indexOf(p.theme) >= 0 ? p.theme : "light",
      readScale: CHOICES.readScale.indexOf(p.readScale) >= 0 ? p.readScale : "normal",
      readFont: CHOICES.readFont.indexOf(p.readFont) >= 0 ? p.readFont : "standard",
      sound: typeof p.sound === "boolean" ? p.sound : true,
      game: Object.assign(defaultGame(), isObj(p.game) ? p.game : {})
    };
  }

  function parseStore(raw) {
    var data;
    try { data = JSON.parse(raw); } catch (e) { return emptyStore(); }
    if (!isObj(data) || !Array.isArray(data.profiles)) return emptyStore();
    var store = emptyStore();
    store.lastLang = LANGS.indexOf(data.lastLang) >= 0 ? data.lastLang : null;
    data.profiles.forEach(function (p) {
      var np = normalizeProfile(p);
      if (np && store.profiles.length < MAX_PROFILES) store.profiles.push(np);
    });
    return store;
  }

  function findProfile(store, id) {
    for (var i = 0; i < store.profiles.length; i++) if (store.profiles[i].id === id) return store.profiles[i];
    return null;
  }

  function newId(store) {
    var id;
    do { id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); } while (findProfile(store, id));
    return id;
  }

  // Valida una clave de ajuste; devuelve {ok, value} o {ok:false, error}
  function checkSetting(key, value) {
    if (key === "name") { var n = cleanName(value); return n === null ? { ok: false, error: "name" } : { ok: true, value: n }; }
    if (key === "avatar") return AVATARS.indexOf(value) >= 0 ? { ok: true, value: value } : { ok: false, error: "avatar" };
    if (key === "lang") return LANGS.indexOf(value) >= 0 ? { ok: true, value: value } : { ok: false, error: "lang" };
    if (key === "sound") return typeof value === "boolean" ? { ok: true, value: value } : { ok: false, error: "value" };
    return CHOICES[key].indexOf(value) >= 0 ? { ok: true, value: value } : { ok: false, error: "value" };
  }

  function addProfile(store, data) {
    if (store.profiles.length >= MAX_PROFILES) return { ok: false, error: "limit" };
    var checked = {}, keys = ["name", "avatar", "lang"];
    for (var i = 0; i < keys.length; i++) {
      var c = checkSetting(keys[i], data[keys[i]]);
      if (!c.ok) return c;
      checked[keys[i]] = c.value;
    }
    var profile = {
      id: newId(store), name: checked.name, avatar: checked.avatar, lang: checked.lang,
      theme: "light", readScale: "normal", readFont: "standard", sound: true, game: defaultGame()
    };
    store.profiles.push(profile);
    return { ok: true, profile: profile };
  }

  function updateProfile(store, id, patch) {
    var p = findProfile(store, id);
    if (!p) return { ok: false, error: "id" };
    var apply = {};
    for (var i = 0; i < SETTING_KEYS.length; i++) {
      var k = SETTING_KEYS[i];
      if (!Object.prototype.hasOwnProperty.call(patch, k)) continue;
      var c = checkSetting(k, patch[k]);
      if (!c.ok) return c;
      apply[k] = c.value;
    }
    Object.keys(apply).forEach(function (k) { p[k] = apply[k]; });
    return { ok: true };
  }

  function deleteProfile(store, id) {
    for (var i = 0; i < store.profiles.length; i++) {
      if (store.profiles[i].id === id) { store.profiles.splice(i, 1); return true; }
    }
    return false;
  }

  function resetProgress(store, id) {
    var p = findProfile(store, id);
    if (!p) return false;
    p.game = defaultGame();
    return true;
  }

  function resetAll() { return emptyStore(); }

  function toState(profile) {
    var st = Object.assign({}, profile.game);
    SETTING_KEYS.forEach(function (k) { st[k] = profile[k]; });
    return st;
  }

  function applyState(profile, state) {
    var game = {};
    Object.keys(state).forEach(function (k) {
      if (SETTING_KEYS.indexOf(k) >= 0) profile[k] = state[k];
      else game[k] = state[k];
    });
    profile.game = game;
  }

  var api = {
    STORE_VERSION: STORE_VERSION, SAVE_KEY: SAVE_KEY, LEGACY_KEY: LEGACY_KEY,
    MAX_PROFILES: MAX_PROFILES, NAME_MAX: NAME_MAX, AVATARS: AVATARS, SETTING_KEYS: SETTING_KEYS,
    emptyStore: emptyStore, defaultGame: defaultGame, parseStore: parseStore, findProfile: findProfile,
    addProfile: addProfile, updateProfile: updateProfile, deleteProfile: deleteProfile,
    resetProgress: resetProgress, resetAll: resetAll, toState: toState, applyState: applyState
  };
  return api;
})();

if (typeof module !== "undefined" && module.exports) module.exports = Profiles;
