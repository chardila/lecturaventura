/* ============================================================
   LecturAventura – Lógica de la app
   ------------------------------------------------------------
   Architektur (bewusst rahmenfrei, ein State-Objekt):
     state        – persistenter Spielstand (localStorage)
     session      – fluechtiger Zustand der laufenden Geschichte
     render*()    – zeichnen die Screens neu (datengetrieben)
     t() / loc()  – i18n-Helfer
   Erweiterbar: neue Welten/Geschichten -> content.js,
   neue Sprache -> UI[code] + flag in SUPPORTED_LANGS.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Konstanten / Balancing ---------- */
    var WPM = { 1: 55, 2: 70, 3: 85 };      // realistische Lesegeschw. Klasse 2
  var TASK_SECONDS = 18;                    // Zeitpuffer je Aufgabe
  var JOKER_PER_SESSION = 3;
  var JOKER_SECONDS = 30;
  var COINS_CORRECT = 5, COINS_SECTION = 10;
  var WEEK_GOAL = 5;                        // Geschichten pro Woche

  /* ---------- Perfiles: tienda y estado del jugador activo ---------- */
  // `state` es una copia plana del perfil activo (Profiles.toState); save() la escribe de vuelta.
  function readRaw() { try { return localStorage.getItem(Profiles.SAVE_KEY); } catch (e) { return null; } }
  var store = Profiles.parseStore(readRaw());
  var activeId = null;
  function baseState(lang) {
    return Profiles.toState({ name: "", avatar: "", lang: lang, theme: "light", readScale: "normal",
      readFont: "standard", sound: true, timers: true, game: Profiles.defaultGame() });
  }
  var state = baseState(Profiles.defaultUiLang(store.lastLang, navigator.language));
  var session = null;
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- DOM-Helfer ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  var app = $("#app");

  /* ---------- i18n ---------- */
  function t(key) {
    var lang = state.lang || "es";
    var v = (UI[lang] && UI[lang][key]);
    if (v == null) v = UI.es[key];
    return v;
  }
  function loc(obj) {                       // contenido multilingüe con fallback a español
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    var lang = state.lang || "es";
    return obj[lang] != null ? obj[lang] : obj.es;
  }
  // Solo los mundos con historias en el idioma elegido (CONTENT.worlds es la lista completa)
  function worlds() {
    var lang = state.lang || "es";
    return CONTENT.worlds.filter(function (w) {
      return w.stories.length && w.stories[0].title && w.stories[0].title[lang] != null;
    });
  }
  function fmt(str, n) { return String(str).replace("{n}", n); }

  /* ---------- Skill-Kategorie je Aufgabentyp (fuer Eltern-Report) ---------- */
  function taskCategory(type) {
    if (["missing", "syllable", "sentence", "spellfix"].indexOf(type) >= 0) return "spelling";
    if (["vocab", "wordimage"].indexOf(type) >= 0) return "vocab";
    return "comprehension";
  }
  function ensureStats() {
    if (!state.stats) state.stats = {};
    var s = state.stats;
    if (s.sessions == null) s.sessions = 0;
    if (s.correct == null) s.correct = 0;
    if (s.answered == null) s.answered = 0;
    if (s.words == null) s.words = 0;
    if (s.seconds == null) s.seconds = 0;
    if (!s.byType) s.byType = { comprehension: { c: 0, n: 0 }, spelling: { c: 0, n: 0 }, vocab: { c: 0, n: 0 } };
    if (!state.history) state.history = [];
  }

  /* ---------- Guardar ---------- */
  function persistStore() {
    try { localStorage.setItem(Profiles.SAVE_KEY, JSON.stringify(store)); } catch (e) {}
  }
  function save() {
    var p = activeId && Profiles.findProfile(store, activeId);
    if (!p) return;
    Profiles.applyState(p, state);
    persistStore();
  }

  /* ---------- Theme / Lesbarkeit anwenden ---------- */
  function applyPrefs() {
    var root = document.documentElement;
    root.setAttribute("data-theme", state.theme);
    root.setAttribute("data-readfont", state.readFont);
    var scale = state.readScale === "small" ? 0.9 : state.readScale === "large" ? 1.25 : 1.05;
    root.style.setProperty("--read-scale", scale);
  }

  /* ---------- Datum / Missionen / Streak ---------- */
  function todayKey() { var d = new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); }
  function weekKey() {
    var d = new Date(); var onejan = new Date(d.getFullYear(),0,1);
    var week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay()+1)/7);
    return d.getFullYear()+"-W"+week;
  }
  function ensureDailyState() {
    var day = todayKey();
    if (state.mission.day !== day) {
      // Streak-Pflege: nur fortführen, wenn gestern gespielt
      if (state.lastPlayed) {
        var diff = (new Date(day) - new Date(state.lastPlayed)) / 86400000;
        if (diff > 1.5) state.streak = 0;
      }
      state.mission = { day: day, read: false, correct: 0, finished: false };
    }
    if (state.week.id !== weekKey()) state.week = { id: weekKey(), count: 0 };
  }

  /* ---------- Belohnungen / Level ---------- */
  function addCoins(n) { state.coins += n; }
  function addStars(n) { state.stars += n; checkLevel(); checkWorldUnlock(); }
  function checkLevel() {
    var need = state.level * 5;            // einfache, sichtbare Kurve
    while (state.stars >= levelThreshold(state.level)) state.level++;
    void need;
  }
  function levelThreshold(lvl) {           // Sterne, die fuer das *naechste* Level noetig sind
    var sum = 0; for (var i = 1; i <= lvl; i++) sum += 4 + i; return sum;
  }
  function checkWorldUnlock() {
    worlds().forEach(function (w) {
      if (state.stars >= w.unlockStars && !state._announced) { /* announce handled elsewhere */ }
    });
  }

  /* ============================================================
     SCREEN-ROUTING
     ============================================================ */
  function show(id) {
    stopPracticeListening();
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) screens[i].classList.remove("active");
    var target = document.getElementById(id);
    if (target) target.classList.add("active");
    window.scrollTo(0, 0);
  }

  /* ---------- HUD ---------- */
  function hudHtml() {
    return '<div class="hud">' +
      '<div class="avatar">' + (state.avatar || "\uD83E\uDDD2") + '</div>' +
      '<div class="who">' + (state.name ? esc(state.name) : t("hello")) +
        '<small>' + t("level") + " " + state.level + '</small></div>' +
      '<span class="chip gold"><span class="ic">\u2b50</span>' + state.stars + '</span>' +
      '<span class="chip"><span class="ic">\uD83E\uDE99</span>' + state.coins + '</span>' +
      '<span class="chip" title="' + t("streak") + '"><span class="ic">\uD83D\uDD25</span>' + state.streak + '</span>' +
      '<button class="icon-btn" data-act="switch" aria-label="' + t("switchPlayer") + '">\uD83D\uDC65</button>' +
      '</div>';
  }

  /* ============================================================
     1) ¿QUIÉN JUEGA? (selección de perfil)
     ============================================================ */
  function renderProfiles() {
    var html = '<div class="center-col" style="padding-top:5vh;text-align:center">' +
      '<div style="font-size:4rem">\uD83D\uDCDA\u2728</div><h1>' + t("whoPlays") + '</h1>';
    if (!store.profiles.length) html += '<p class="muted">' + t("noProfiles") + '</p>';
    else {
      html += '<div class="grid cards profile-grid">';
      store.profiles.forEach(function (p) {
        html += '<button class="card profile-tile" data-profile="' + esc(p.id) + '">' +
          '<span class="profile-avatar">' + p.avatar + '</span><h3>' + esc(p.name) + '</h3>' +
          '<p class="meta">\u2b50 ' + (p.game.stars || 0) + '</p></button>';
      });
      html += '</div>';
    }
    html += '<div class="spacer"></div><button class="btn ghost" data-act="parents">\uD83D\uDD12 ' + t("parentZone") + '</button>' +
      '<p class="muted" style="font-size:.85rem;margin-top:14px">' + t("storageNote") + '</p></div>';
    $("#screen-profiles").innerHTML = html;
  }
  function enterProfile(id) {
    var p = Profiles.findProfile(store, id);
    if (!p) return;
    activeId = id;
    state = Profiles.toState(p);
    ensureStats(); ensurePractice();
    store.lastLang = state.lang;
    save(); applyPrefs();
    renderHome(); show("screen-home");
  }
  function leaveProfile() {
    stopTimer(); stopPracticeListening(); closeSheet();
    save();
    session = null; activeId = null;
    state = baseState(Profiles.defaultUiLang(store.lastLang, navigator.language));
    applyPrefs(); renderProfiles(); show("screen-profiles");
  }

  /* ============================================================
     2) HOME / ABENTEUERKARTE
     ============================================================ */
  function renderHome() {
    ensureDailyState();
    var w = $("#screen-home");
    var html = hudHtml() + '<div class="spacer"></div>';

    // Missions-Box
    html += '<section><h2>' + t("missions") + ' \uD83C\uDFAF</h2>';
    html += mission("\uD83D\uDCD6", t("missionRead"), state.mission.read ? 1 : 0, 1);
    html += mission("\u2705", t("missionCorrect"), Math.min(state.mission.correct,3), 3);
    html += mission("\uD83C\uDFC6", t("missionFinish"), state.mission.finished ? 1 : 0, 1);
    var wk = Math.min(state.week.count, WEEK_GOAL);
    html += '<div class="mission"><span class="big-ic">\uD83D\uDCC5</span><div style="flex:1">' +
      '<strong>' + t("weekGoal") + '</strong> <span class="muted">' + wk + '/' + WEEK_GOAL + '</span>' +
      '<div class="bar"><span style="width:' + (wk/WEEK_GOAL*100) + '%"></span></div></div></div>';
    html += '</section><div class="spacer"></div>';

    // Welten-Karte
    html += '<section><div class="sec-head"><h2 style="margin:0">' + t("map") + ' \uD83D\uDDFA\ufe0f</h2>' +
      '<button class="btn ghost" data-act="discover">\uD83D\uDD2D ' + t("discover") + '</button>' +
      '<button class="btn ghost" data-act="collection">\uD83D\uDCD5 ' + t("collection") + '</button>' +
      (state.lang === "es" ? '<button class="btn ghost" data-act="practice">\uD83D\uDDE3\uFE0F ' + t("practiceTitle") + '</button>' : '') + '</div>';
    html += '<div class="map grid cards">';
    worlds().forEach(function (world) {
      var unlocked = state.stars >= world.unlockStars;
      var done = world.stories.filter(function (s) { return state.finished[s.id]; }).length;
      html += '<button class="card' + (unlocked ? "" : " locked") + '" ' +
        (unlocked ? 'data-world="' + world.id + '"' : 'data-locked="1"') + '>' +
        (unlocked ? "" : '<span class="lock">\uD83D\uDD12</span>') +
        '<span class="emoji">' + world.emoji + '</span>' +
        '<h3>' + loc(world.name) + '</h3>' +
        '<p class="meta">' + loc(world.desc) + '</p>' +
        '<p class="meta">' + (unlocked
          ? ('\u2b50 ' + done + '/' + world.stories.length + ' \u00b7 ' + world.stories.length + ' ' + t("stories"))
          : fmt(t("unlockAt"), world.unlockStars)) + '</p>' +
        '</button>';
    });
    html += '</div></section>';
    w.innerHTML = html;
  }
  function mission(ic, label, val, max) {
    var done = val >= max;
    return '<div class="mission' + (done ? " done" : "") + '"><span class="big-ic">' + (done ? "\u2705" : ic) + '</span>' +
      '<div style="flex:1"><strong>' + label + '</strong>' +
      '<div class="bar"><span style="width:' + (val/max*100) + '%"></span></div></div></div>';
  }

  /* ============================================================
     3) GESCHICHTEN-AUSWAHL
     ============================================================ */
  function renderWorld(worldId) {
    var world = findWorld(worldId);
    var w = $("#screen-world");
    var html = hudHtml() +
      '<div class="btn-row spacer"><button class="btn ghost" data-act="home">\u2190 ' + t("map") + '</button></div>' +
      '<section><h1>' + world.emoji + ' ' + loc(world.name) + '</h1>' +
      '<p class="muted">' + t("chooseStory") + '</p><div class="grid cards">';
    world.stories.forEach(function (story) {
      var mins = estimateStoryMinutes(story);
      var fin = state.finished[story.id];
      html += '<button class="card" data-story="' + story.id + '">' +
        '<span class="emoji">' + world.emoji + '</span>' +
        '<h3>' + loc(story.title) + (fin ? ' \u2b50' : '') + '</h3>' +
        '<p class="meta">' + loc(story.intro) + '</p>' +
        '<p class="meta">\u23f1\ufe0f ' + t("readTime") + ': ~' + mins + ' ' + t("minutes") +
        ' \u00b7 ' + difficultyDots(story.level) + '</p></button>';
    });
    html += '</div></section>';
    w.innerHTML = html;
  }
  function difficultyDots(lvl) { var s=""; for (var i=1;i<=3;i++) s += i<=lvl ? "\u25cf" : "\u25cb"; return s; }

  /* ---------- Lesezeit realistisch schaetzen ---------- */
  function countWords(str) { return (str.trim().match(/\S+/g) || []).length; }
  function sectionSeconds(section, level) {
    var words = countWords(loc(section.text));
    var read = words / WPM[level] * 60;
    var tasks = (section.tasks ? section.tasks.length : 0) * TASK_SECONDS;
    return Math.max(25, Math.round(read + tasks));
  }
  function estimateStoryMinutes(story) {
    var total = 0;
    story.sections.forEach(function (s) { total += sectionSeconds(s, story.level); });
    return Math.max(1, Math.round(total / 60));
  }

  /* (Modus-Wahl entfernt: Geschichten starten direkt in einem einzigen Standard-Modus.) */

  /* ============================================================
     5) SESSION (Lesen + Aufgaben)
     ============================================================ */
  function startSession(storyId, mode) {
    var info = findStory(storyId);
    var totalSecs = 0;
    info.story.sections.forEach(function (s) { totalSecs += sectionSeconds(s, info.story.level); });
    totalSecs = Math.round(totalSecs * 1.15);   // ein einziger, kindgerechter Standard-Modus

    session = {
      world: info.world, story: info.story, mode: mode,
      si: 0, phase: "read",        // phase: read -> tasks
      ti: 0,                        // aktuelle Aufgabe
      timeLeft: totalSecs, jokers: JOKER_PER_SESSION,
      correct: 0, answered: 0, coins: 0, stars: 0, words: 0,
      adapt: 0,                     // adaptiver Schwierigkeits-Drift (-2..+2)
      easyText: null,               // null=auto (folgt adapt), true/false = manuell gewaehlt
      elapsed: 0,                   // verbrachte Sekunden (fuer Eltern-Report)
      surpriseUsed: false, timer: null
    };
    session.startedAt = Date.now();
    if (state.timers !== false) startTimer();
    renderSection();
    show("screen-session");
  }

  function timerHtml() {                    // en la práctica en voz alta no hay cronómetro visible
    return session && (session.mode === "practice" || state.timers === false) ? "" :
      '<div class="timer" id="timer"><span>\u23f1\ufe0f</span><span class="ring">0:00</span></div>';
  }

  function startTimer() {
    stopTimer();
    session.timer = setInterval(function () {
      session.timeLeft--;
      session.elapsed++;
      updateTimer();
      if (session.timeLeft === 20) toast(t("timeUp"));
      if (session.timeLeft <= 0) { session.timeLeft = 0; updateTimer(); }
    }, 1000);
  }
  function stopTimer() { if (session && session.timer) { clearInterval(session.timer); session.timer = null; } }
  function updateTimer() {
    var elx = $("#timer"); if (!elx) return;
    var m = Math.floor(session.timeLeft / 60), s = session.timeLeft % 60;
    elx.querySelector(".ring").textContent = m + ":" + (s < 10 ? "0" : "") + s;
    elx.classList.toggle("low", session.timeLeft <= 30);
  }

  /* ---------- Adaptive Textvariante: leicht vs. normal ---------- */
  // Auto: bei Schwierigkeiten (adapt<0) wird automatisch die kuerzere,
  // einfachere Variante gezeigt. Das Kind kann jederzeit manuell umschalten.
  function useEasy(sec) {
    if (!sec || !sec.easy) return false;
    if (session.easyText === true) return true;
    if (session.easyText === false) return false;
    return session.adapt < 0;
  }
  function sectionDisplayText(sec) { return useEasy(sec) ? loc(sec.easy) : loc(sec.text); }

  function renderSection() {
    var sec = session.story.sections[session.si];
    var total = session.story.sections.length;
    var w = $("#screen-session");
    var progress = (session.si / total) * 100;
    var jokerLabel = session.jokers > 0 ? fmt(t("jokerLeft"), session.jokers) : "";

    var html = '<div class="sec-head">' +
      '<button class="icon-btn" data-act="quit">\u2715</button>' +
      '<div class="bar" title="' + t("progress") + '"><span style="width:' + progress + '%"></span></div>' +
      timerHtml() +
      '</div>';

    // Lese-Karte mit anklickbaren Vokabeln
    html += '<div class="read-card"><p class="eyebrow">' + session.world.emoji + ' ' + loc(session.story.title) +
      ' \u00b7 ' + (session.si + 1) + '/' + total + '</p>' +
      (useEasy(sec) ? '<div class="btn-row" style="margin-bottom:8px"><span class="chip">' + t("easyOn") + '</span></div>' : '') +
      '<div class="story-text">' + markVocab(sectionDisplayText(sec), sec) + '</div>';

    // Aktionsleiste: Vorlesen (nur Helfer-Modus dauerhaft sichtbar), Zeitjoker, Weiter
    html += '<div class="btn-row" style="margin-top:18px">';
    html += '<button class="btn ghost" data-act="speak">\uD83D\uDD0A ' + t("readAloud") + '</button>';
    if (sec.easy)
      html += '<button class="btn ghost" data-act="toggleEasy">\uD83E\uDEB6 ' + (useEasy(sec) ? t("normalText") : t("easierText")) + '</button>';
    if (state.timers !== false)
      html += '<button class="btn ghost" data-act="joker">\u23f3 ' + t("timeJoker") +
        (jokerLabel ? ' (' + jokerLabel + ')' : '') + '</button>';
    html += '<button class="btn primary" style="margin-left:auto" data-act="toTasks">' + t("next") + ' \u2192</button>';
    html += '</div></div>';

    w.innerHTML = html;
    updateTimer();
  }

  // Vokabeln im Text anklickbar machen (Wortschatz-Impuls)
  function markVocab(text, sec) {
    var vocabTask = (sec.tasks || []).filter(function (x) { return x.type === "vocab"; });
    vocabTask.forEach(function (vt) {
      var word = loc(vt.word);
      if (!word) return;
      var re = new RegExp("(" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "i");
      text = text.replace(re, '<span class="vocab" data-vocab="' + encodeURIComponent(word) +
        '" data-def="' + encodeURIComponent(loc(vt.options)[vt.answer]) + '">$1</span>');
    });
    return text;
  }

  /* ---------- Aufgaben rendern (Multiple Choice 4–6) ---------- */
  function renderTask() {
    var sec = session.story.sections[session.si];
    var tasks = sec.tasks || [];
    if (session.ti >= tasks.length) { nextSection(); return; }
    var task = tasks[session.ti];
    if (task.type === "detector") { renderDetector(task, tasks); return; }
    var w = $("#screen-session");
    var total = session.story.sections.length;

    // adaptiver Hinweis: bei Schwierigkeiten (adapt<0) Hilfe direkt zeigen
    var showHintNow = session.adapt < 0 && task.hint;
    var intro = task.type === "predict" ? ('<p class="muted">' + t("predictIntro") + '</p>') : "";

    var html = '<div class="sec-head">' +
      '<button class="icon-btn" data-act="quit">\u2715</button>' +
      '<div class="bar"><span style="width:' + (((session.si + (session.ti+1)/(tasks.length+1)) / total) * 100) + '%"></span></div>' +
      timerHtml() +
      '</div>';

    html += '<div class="read-card"><p class="eyebrow">' + taskBadge(task.type) + '</p>' +
      intro + '<h2>' + loc(task.q) + '</h2>';
    if (showHintNow) html += '<p class="muted">\uD83D\uDCA1 ' + loc(task.hint) + '</p>';

    var opts = loc(task.options);
    var two = opts.every(function (o) { return String(o).length <= 14; }) && opts.length >= 4;
    html += '<div class="mc-list' + (two ? " two" : "") + '">';
    var keys = "ABCDEF";
    opts.forEach(function (o, i) {
      html += '<button class="mc" data-opt="' + i + '"><span class="key">' + keys[i] + '</span><span>' + o + '</span></button>';
    });
    html += '</div>';
    html += '<div class="feedback" id="fb"></div>';
    html += '<div class="btn-row" style="margin-top:14px"><button class="btn primary hidden" id="nextBtn" style="margin-left:auto">' + t("next") + ' \u2192</button></div>';
    html += '</div>';
    w.innerHTML = html;
    updateTimer();
  }

  function taskBadge(type) {
    var map = {
      quiz: "\u2753 " + (state.lang==="en"?"Understand":"Comprender"),
      predict: "\uD83D\uDD2E " + (state.lang==="en"?"Predict":"Adivinar"),
      vocab: "\uD83D\uDCAC " + (state.lang==="en"?"Word":"Vocabulario"),
      missing: "\uD83D\uDD24 " + (state.lang==="en"?"Missing letter":"Letra que falta"),
      syllable: "\uD83E\uDDE9 " + (state.lang==="en"?"Syllables":"Sílabas"),
      wordimage: "\uD83D\uDDBC\ufe0f " + (state.lang==="en"?"Word & picture":"Palabra e imagen"),
      sentence: "\uD83D\uDD17 " + (state.lang==="en"?"Sentence":"Ordenar"),
      spellfix: "\uD83D\uDD0E " + (state.lang==="en"?"Find mistake":"Encuentra el error"),
      retell: "\uD83D\uDDE3\ufe0f " + (state.lang==="en"?"Retell":"Cuéntalo"),
      detector: "\uD83D\uDD0D " + (state.lang==="en"?"Metal detector":"Detector de metales")
    };
    return map[type] || "\u2753";
  }

  /* ---------- Metalldetektor-Suche (Touch, mit Signal-Feedback) ---------- */
  // Exploratives Mini-Game: je naeher an der Fundstelle, desto lauter das Piepen.
  // Bewusst NICHT in die Trefferquote gerechnet – es ist ein Entdecker-Moment.
  function renderDetector(task, tasks) {
    var w = $("#screen-session");
    var total = session.story.sections.length;
    var html = '<div class="sec-head">' +
      '<button class="icon-btn" data-act="quit">\u2715</button>' +
      '<div class="bar"><span style="width:' + (((session.si + (session.ti + 1) / (tasks.length + 1)) / total) * 100) + '%"></span></div>' +
      timerHtml() +
      '</div>';
    html += '<div class="read-card"><p class="eyebrow">' + taskBadge("detector") + '</p>' +
      '<h2>' + loc(task.q) + '</h2><p class="muted">' + t("detectorSweep") + '</p>';
    var opts = loc(task.options);
    html += '<div class="mc-list detector">';
    opts.forEach(function (o, i) {
      html += '<button class="mc" data-spot="' + i + '"><span>' + o + '</span></button>';
    });
    html += '</div><div class="feedback" id="fb"></div>';
    html += '<div class="btn-row" style="margin-top:14px"><button class="btn primary hidden" id="nextBtn" style="margin-left:auto">' + t("next") + ' \u2192</button></div>';
    html += '</div>';
    w.innerHTML = html;
    updateTimer();
  }
  function detectorTap(i) {
    var sec = session.story.sections[session.si];
    var task = sec.tasks[session.ti];
    var btns = document.querySelectorAll(".mc[data-spot]");
    var dist = Math.abs(i - task.answer);
    var fb = $("#fb");
    var btn = btns[i];
    if (dist === 0) {
      for (var k = 0; k < btns.length; k++) btns[k].disabled = true;
      btn.classList.remove("warm", "hot"); btn.classList.add("correct");
      session.coins += COINS_CORRECT;
      fb.className = "feedback ok show";
      fb.innerHTML = t("sigFound") + (task.fact ? '<br><span class="muted">\u2728 ' + t("didYouKnow") + ' ' + loc(task.fact) + '</span>' : '');
      ding(true); maybeSurprise();
      var nb = $("#nextBtn"); nb.classList.remove("hidden");
      nb.onclick = function () { session.ti++; renderTask(); };
    } else {
      btn.classList.remove("warm", "hot");
      btn.classList.add(dist === 1 ? "hot" : "warm");
      fb.className = "feedback show";
      fb.textContent = dist === 1 ? t("sigHot") : dist === 2 ? t("sigWarm") : t("sigCold");
      beep(1 / (dist + 1));
    }
  }
  function beep(strength) {
    if (!state.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = "square";
      o.frequency.value = 240 + strength * 520;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.08 + strength * 0.1, audioCtx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
      o.start(); o.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  /* ---------- Antwort auswerten ---------- */
  function answer(optIndex) {
    var sec = session.story.sections[session.si];
    var task = sec.tasks[session.ti];
    var buttons = document.querySelectorAll(".mc");
    for (var i = 0; i < buttons.length; i++) buttons[i].disabled = true;

    // "predict" hat answer:-1 => jede Antwort ist gültig (Vermutung zählt immer)
    var isOpen = task.answer < 0;
    var correct = isOpen || optIndex === task.answer;
    session.answered++;
    var cat = taskCategory(task.type);
    if (state.stats.byType && state.stats.byType[cat]) { state.stats.byType[cat].n++; if (correct) state.stats.byType[cat].c++; }

    var fb = $("#fb");
    if (correct) {
      buttons[optIndex].classList.add("correct");
      session.correct++;
      session.coins += COINS_CORRECT;
      session.adapt = Math.min(2, session.adapt + 1);   // adaptiv: schwerer
      state.mission.correct++;
      var praise = isOpen ? t("yourGuess") : t("correct")[Math.floor(Math.random()*t("correct").length)];
      fb.className = "feedback ok show"; fb.textContent = praise;
      ding(true);
      maybeSurprise();
    } else {
      buttons[optIndex].classList.add("wrong");
      if (buttons[task.answer]) buttons[task.answer].classList.add("correct");
      session.adapt = Math.max(-2, session.adapt - 1);  // adaptiv: leichter + Hilfe
      fb.className = "feedback no show";
      fb.innerHTML = t("wrong") + (task.hint ? "<br>\uD83D\uDCA1 " + loc(task.hint) : "") + "<br>" + t("showAnswer");
      ding(false);
    }
    // Sachwissen-Einschub
    if (task.fact) fb.innerHTML += '<br><span class="muted">\u2728 ' + t("didYouKnow") + " " + loc(task.fact) + '</span>';

    var nb = $("#nextBtn"); nb.classList.remove("hidden");
    nb.onclick = function () { session.ti++; renderTask(); };
    updateHudLive();
  }

  // kleine, sparsame Ueberraschung (max 1 pro Session)
  function maybeSurprise() {
    if (session.surpriseUsed) return;
    if (Math.random() < 0.18) {
      session.surpriseUsed = true;
      session.stars += 1; session.coins += 10;
      toast(t("surprise") + " " + t("bonusStar"));
      confetti();
    }
  }

  function nextSection() {
    // Abschnitt geschafft -> Belohnung
    session.coins += COINS_SECTION;
    if (session.mode !== "practice") session.words += countWords(loc(session.story.sections[session.si].text));
    state.mission.read = true;
    session.si++;
    if (session.si >= session.story.sections.length) { finishSession(); return; }
    session.ti = 0; session.phase = "read";
    if (session.mode === "practice") { session.sn = 0; session.attempt = 0; loadSents(); renderPracticeSentence(); return; }
    renderSection();
  }

  /* ---------- Session-Abschluss ---------- */
  function finishSession() {
    stopTimer();
    if (session.mode === "practice") session.elapsed = Math.round(session.readMs / 1000);
    else if (state.timers === false) session.elapsed = Math.round((Date.now() - session.startedAt) / 1000);
    // Sterne aus Trefferquote (0–3) + evtl. Bonus
    var rate = session.answered ? session.correct / session.answered : 0;
    var earnedStars = rate >= 0.9 ? 3 : rate >= 0.6 ? 2 : 1;
    earnedStars += session.stars; // Bonussterne aus Ueberraschung

    // Spielstand aktualisieren
    var firstTime = !state.finished[session.story.id];
    state.finished[session.story.id] = true;
    addCoins(session.coins);
    state.stats.sessions++; state.stats.correct += session.correct;
    state.stats.answered += session.answered; state.stats.words += session.words;
    state.stats.seconds = (state.stats.seconds || 0) + (session.elapsed || 0);
    if (!state.history) state.history = [];
    state.history.unshift({ date: todayKey(), world: session.world.id, title: loc(session.story.title),
      correct: session.correct, answered: session.answered, stars: earnedStars, seconds: session.elapsed, mode: session.mode });
    state.history = state.history.slice(0, 12);
    state.mission.finished = true;
    state.badges[session.world.id] = true;

    // Streak / Woche
    if (state.lastPlayed !== todayKey()) { state.streak++; }
    state.lastPlayed = todayKey();
    state.week.count++;

    if (session.mode === "practice") finishPracticeBookkeeping();
    var beforeLevel = state.level;
    var unlockedBefore = unlockedWorldIds();
    addStars(earnedStars);
    var leveledUp = state.level > beforeLevel;
    var newWorlds = unlockedWorldIds().filter(function (id) { return unlockedBefore.indexOf(id) < 0; });
    save();

    // Ergebnis-Screen
    var w = $("#screen-result");
    var starRow = ""; for (var i=1;i<=3;i++) starRow += i <= (rate>=0.9?3:rate>=0.6?2:1) ? "\u2b50" : "\u2606";
    var html = '<div class="center-col" style="text-align:center;padding-top:4vh">' +
      '<div style="font-size:4.5rem">' + session.world.emoji + '</div>' +
      '<h1>' + t("sessionDone") + '</h1>' +
      '<div class="stars">' + starRow + '</div>' +
      '<p class="muted">' + t("earned") + ':</p>' +
      '<div class="btn-row" style="justify-content:center">' +
        '<span class="chip gold">\u2b50 +' + earnedStars + '</span>' +
        '<span class="chip">\uD83E\uDE99 +' + session.coins + '</span>' +
        '<span class="chip">\u2705 ' + session.correct + '/' + session.answered + '</span>' +
      '</div>';
    if (firstTime) html += '<div class="collect-item" style="max-width:160px;margin:18px auto"><div class="emoji">' +
      BADGES[session.world.id].emoji + '</div><small>' + loc(BADGES[session.world.id]) + '</small></div>';
    if (leveledUp) html += '<p class="eyebrow pulse">\uD83C\uDF89 ' + t("newLevel") + ' \u2013 ' + t("level") + ' ' + state.level + '</p>';
    newWorlds.forEach(function (id) {
      var nw = findWorld(id);
      html += '<p class="eyebrow pulse">\uD83D\uDDFA\ufe0f ' + t("worldUnlocked") + ' ' + nw.emoji + ' ' + loc(nw.name) + '</p>';
    });
    if (session.mode === "practice") {
      html += '<p class="muted">' + t("parentWpm") + ': ' + Practice.wordsPerMinute(session.words, session.readMs) + '</p>';
      if (session.helped.length) html += '<div class="spacer"></div><button class="btn accent big" data-act="practice-review">\uD83D\uDD0A ' + t("practiceReviewBtn") + '</button>';
    }
    html += '<div class="spacer"></div><button class="btn primary big" data-act="home">' + t("backMap") + '</button>';
    html += '<p class="muted" style="margin-top:14px">\uD83D\uDD25 ' + t("streak") + ': ' + state.streak + '</p>';
    html += '</div>';
    w.innerHTML = html;
    show("screen-result");
    confetti();
  }

  function unlockedWorldIds() {
    return worlds().filter(function (w) { return state.stars >= w.unlockStars; }).map(function (w) { return w.id; });
  }

  function updateHudLive() {
    // Live-Anzeige von gesammelten Münzen/Sternen in der Session (nicht persistent)
    var who = document.querySelector(".hud");
    if (!who) return; // HUD ist im Session-Screen nicht vorhanden – bewusst reduziert
  }

  /* ============================================================
     PRÁCTICA EN VOZ ALTA (solo español; ver docs/superpowers/specs)
     ============================================================ */
  var reviewState = null;

  function allStories() {
    var out = [];
    worlds().forEach(function (w) { w.stories.forEach(function (s) { out.push(s); }); });
    return out;
  }
  function ensurePractice() {
    if (!state.practice || typeof state.practice !== "object") state.practice = {};
    var p = state.practice;
    if (!Array.isArray(p.sessions)) p.sessions = [];
    if (!p.difficult || typeof p.difficult !== "object") p.difficult = {};
    if (!Array.isArray(p.fluentDone)) p.fluentDone = [];
    if (p.resume === undefined) p.resume = null;
  }
  function storyWordCount(story) {
    var n = 0; story.sections.forEach(function (s) { n += countWords(loc(s.text)); }); return n;
  }

  function renderPracticeList() {
    ensurePractice();
    var stories = allStories(), byId = {};
    stories.forEach(function (s) { byId[s.id] = s; });
    var order = Practice.orderStoriesByWords(stories, "es");
    var open = Practice.unlockedStoryIds(order, state.practice.fluentDone);
    var html = hudHtml() +
      '<div class="btn-row spacer"><button class="btn ghost" data-act="home">← ' + t("map") + '</button></div>' +
      '<section><h1>🗣️ ' + t("practiceTitle") + '</h1><p class="muted">' + t("practiceIntro") + '</p>';
    var res = state.practice.resume;
    if (res && byId[res.storyId]) {
      html += '<button class="card" data-practice-story="' + res.storyId + '" data-resume="1">' +
        '<span class="emoji">▶️</span><h3>' + t("practiceResume") + '</h3>' +
        '<p class="meta">' + loc(byId[res.storyId].title) + '</p></button><div class="spacer"></div>';
    }
    html += '<div class="grid cards">';
    order.forEach(function (id) {
      var st = byId[id], unlocked = open.indexOf(id) >= 0, info = findStory(id);
      html += '<button class="card' + (unlocked ? "" : " locked") + '" data-practice-story="' + id + '"' +
        (unlocked ? "" : ' data-practice-locked="1"') + '>' +
        (unlocked ? "" : '<span class="lock">🔒</span>') +
        '<span class="emoji">' + info.world.emoji + '</span>' +
        '<h3>' + loc(st.title) + (state.finished[id] ? ' ⭐' : '') + '</h3>' +
        '<p class="meta">' + storyWordCount(st) + ' ' + (state.lang === "en" ? "words" : "palabras") + '</p></button>';
    });
    html += '</div></section>';
    $("#screen-world").innerHTML = html;
  }

  function loadSents() {
    session.sents = Practice.splitSentences(loc(session.story.sections[session.si].text));
  }
  function startPractice(storyId, resume) {
    var info = findStory(storyId);
    if (!info) return;
    stopPracticeListening();
    session = {
      world: info.world, story: info.story, mode: "practice",
      si: 0, phase: "read", ti: 0, timeLeft: 0, jokers: 0,
      correct: 0, answered: 0, coins: 0, stars: 0, words: 0,
      adapt: 0, easyText: false, elapsed: 0, surpriseUsed: false, timer: null,
      sents: [], sn: 0, sentDone: 0, attempt: 0, helped: [], rereads: 0, readMs: 0,
      startedAt: Date.now(), pauseOffered: false, rec: null, listenStart: 0, modeling: null
    };
    session.sentTotal = 0;
    info.story.sections.forEach(function (s) { session.sentTotal += Practice.splitSentences(loc(s.text)).length; });
    if (resume && resume.storyId === storyId && resume.si < info.story.sections.length) {
      ["si", "sn", "words", "readMs", "rereads", "correct", "answered", "sentDone"].forEach(function (k) {
        if (typeof resume[k] === "number") session[k] = resume[k];
      });
      if (Array.isArray(resume.helped)) session.helped = resume.helped.slice();
    }
    loadSents();
    renderPracticeSentence();
    show("screen-session");
  }

  function practiceHead() {
    var pct = session.sentTotal ? Math.round(session.sentDone / session.sentTotal * 100) : 0;
    return '<div class="sec-head"><button class="icon-btn" data-act="quit">✕</button>' +
      '<div class="bar" title="' + t("progress") + '"><span style="width:' + pct + '%"></span></div></div>';
  }
  function setMsg(html) { var m = $("#practice-msg"); if (m) m.innerHTML = html; }
  function setHidden(sel, hide) { var x = $(sel); if (x) x.classList.toggle("hidden", !!hide); }
  function randomPraise() { var a = t("practicePraise"); return a[Math.floor(Math.random() * a.length)]; }

  function renderPracticeSentence() {
    stopPracticeListening();
    if (session.sn >= session.sents.length) { session.phase = "tasks"; session.ti = 0; renderTask(); return; }
    var sent = session.sents[session.sn], supported = Recognizer.isSupported();
    var words = sent.split(" ").map(function (wd) { return '<span class="pw">' + wd + '</span>'; }).join(" ");
    var html = practiceHead() +
      '<div class="read-card"><p class="eyebrow">' + session.world.emoji + ' ' + loc(session.story.title) +
      ' · ' + (session.si + 1) + '/' + session.story.sections.length + '</p>' +
      '<p class="practice-sentence" id="practice-sentence">' + words + '</p>' +
      '<div class="practice-msg" id="practice-msg" role="status">' + (supported ? "" : t("practiceUnsupported")) + '</div>' +
      '<div class="practice-actions">' +
      (supported ? '<button class="btn primary big" id="practice-mic" data-act="practice-listen">' + t("practiceRead") + '</button>' : '') +
      '<button class="btn ghost" id="practice-hear" data-act="practice-hear">' + t("practiceHear") + '</button>' +
      '<button class="btn accent hidden" id="practice-next" data-act="practice-next">' + t("next") + ' →</button>' +
      '<button class="btn ghost' + (supported ? " hidden" : "") + '" id="practice-adult" data-act="practice-adult-next">' + t("practiceAdultNext") + '</button>' +
      '</div></div>';
    $("#screen-session").innerHTML = html;
  }

  function stopPracticeListening() {
    if (session && session.rec) { var r = session.rec; session.rec = null; try { r.stop(); } catch (e) {} }
    if (reviewState && reviewState.rec) { var r2 = reviewState.rec; reviewState.rec = null; try { r2.stop(); } catch (e) {} }
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  }

  // Ilumina las palabras que ya se han oído mientras la niña lee (resultados parciales)
  function lightWords(interim) {
    if (!session || session.mode !== "practice" || session.modeling) return;
    var r = Practice.alignReading(session.sents[session.sn], interim);
    if (r.unheard) return;
    var last = -1;
    r.words.forEach(function (w, i) { if (w.ok && Practice.normalizeWords(w.text).join("").length > 2) last = i; });
    var spans = document.querySelectorAll("#practice-sentence .pw");
    r.words.forEach(function (w, i) { if (spans[i]) spans[i].classList.toggle("lit", i <= last && w.ok); });
  }

  function practiceListen() {
    if (!session || session.mode !== "practice" || session.rec) return;      // doble toque
    if (!Recognizer.isSupported()) { setMsg(t("practiceUnsupported")); setHidden("#practice-adult", false); return; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    var mine = session, heard = "", got = false, err = null;
    mine.listenStart = Date.now();
    setMsg(t("practiceListening"));
    var mic = $("#practice-mic"); if (mic) mic.classList.add("listening");
    var rec = Recognizer.create({
      lang: "es-CO",
      onInterim: function (txt) { if (session === mine && mine.rec === rec) lightWords(txt); },
      onFinal: function (txt) { got = true; heard = txt; },
      onError: function (code) { err = Recognizer.mapError(code); },
      onEnd: function () {
        if (session !== mine || mine.rec !== rec) return;
        mine.rec = null;
        if (mic) mic.classList.remove("listening");
        if (err === "not-allowed") { setMsg(t("practiceDenied")); setHidden("#practice-adult", false); return; }
        if (mine.modeling) onModelResult(got ? heard : "");
        else onPracticeResult(got ? heard : "");
      }
    });
    mine.rec = rec;
    rec.start();
  }

  function markWords(r) {
    var spans = document.querySelectorAll("#practice-sentence .pw");
    r.words.forEach(function (w, i) {
      if (!spans[i]) return;
      spans[i].classList.remove("lit");
      spans[i].classList.toggle("ok", w.ok);
      spans[i].classList.toggle("doubt", !w.ok);
    });
  }
  function clearMarks() {
    var spans = document.querySelectorAll("#practice-sentence .pw");
    for (var i = 0; i < spans.length; i++) spans[i].className = "pw";
  }

  function onPracticeResult(heardText) {
    var sent = session.sents[session.sn];
    var r = Practice.alignReading(sent, heardText);
    var act = Practice.decideNext(session.attempt + 1, r);
    if (act === "again") { clearMarks(); setMsg(t("practiceNoHear")); return; }
    session.readMs += Date.now() - session.listenStart;
    markWords(r);
    if (act === "accept") { completeSentence(); return; }
    if (act === "reread") {
      session.attempt++; session.rereads++;
      setMsg(t("practiceReread"));
      return;
    }
    startModeling(r);
  }

  function completeSentence() {
    session.words += Practice.normalizeWords(session.sents[session.sn]).length;
    session.sentDone++;
    session.modeling = null;
    setMsg('🌟 ' + randomPraise());
    setHidden("#practice-mic", true); setHidden("#practice-adult", true);
    setHidden("#practice-next", false);
    ding(true);
  }

  function startModeling(r) {
    var words = [];
    r.words.forEach(function (w) {
      var c = Practice.cleanWord(w.text);
      if (!w.ok && c && words.indexOf(c) < 0) words.push(c);
    });
    session.modeling = { words: words, i: 0, tries: 0 };
    renderPracticeModel(words, 0);
  }
  function renderPracticeModel(words, i) {
    session.modeling.i = i; session.modeling.tries = 0;
    setMsg(t("practiceModel") + '<div class="practice-big">' + words[i] + '</div>');
    setHidden("#practice-adult", false);
    speak(words[i]);
  }
  function onModelResult(heardText) {
    var m = session.modeling, word = m.words[m.i];
    if (!heardText.trim()) { setMsg(t("practiceNoHear")); return; }
    m.tries++;
    var ok = Practice.alignReading(word, heardText).allOk;
    if (ok || m.tries >= 2) { modelAdvance(); return; }
    setMsg(t("practiceModel") + '<div class="practice-big">' + word + '</div>');
    speak(word);
  }
  function modelAdvance() {
    var m = session.modeling;
    if (m.i + 1 < m.words.length) { renderPracticeModel(m.words, m.i + 1); return; }
    session.helped = session.helped.concat(m.words);
    completeSentence();
  }

  function practiceNext() {
    session.sn++; session.attempt = 0; session.modeling = null;
    var lastSection = session.si === session.story.sections.length - 1;
    if (!session.pauseOffered && Practice.shouldOfferPause(Date.now() - session.startedAt) &&
        !(lastSection && session.sn >= session.sents.length)) {
      session.pauseOffered = true;
      renderPracticePause();
      return;
    }
    renderPracticeSentence();
  }
  function renderPracticePause() {
    stopPracticeListening();
    $("#screen-session").innerHTML = practiceHead() +
      '<div class="read-card" style="text-align:center"><div style="font-size:4rem">🌟</div>' +
      '<h2>' + t("practicePause") + '</h2><div class="spacer"></div>' +
      '<div class="practice-actions"><button class="btn primary big" data-act="practice-pause-save">' + t("practicePauseSave") + '</button>' +
      '<button class="btn ghost" data-act="practice-pause-go">' + t("practicePauseGo") + '</button></div></div>';
  }
  function savePracticePause() {
    ensurePractice();
    state.practice.resume = {
      storyId: session.story.id, si: session.si, sn: session.sn,
      words: session.words, readMs: session.readMs, helped: session.helped.slice(), rereads: session.rereads,
      correct: session.correct, answered: session.answered, sentDone: session.sentDone
    };
    save(); renderHome(); show("screen-home");
  }

  function finishPracticeBookkeeping() {
    ensurePractice();
    var p = state.practice;
    p.sessions.unshift({
      date: todayKey(), storyId: session.story.id, words: session.words, ms: session.readMs,
      wpm: Practice.wordsPerMinute(session.words, session.readMs),
      helped: session.helped.length, rereads: session.rereads
    });
    p.sessions = p.sessions.slice(0, 60);
    p.difficult = Practice.mergeDifficult(p.difficult, session.helped);
    if (Practice.isFluent(session.helped.length, session.words) && p.fluentDone.indexOf(session.story.id) < 0)
      p.fluentDone.push(session.story.id);
    p.resume = null;
  }

  /* ---------- Repaso de palabras difíciles ---------- */
  function startReview() {
    ensurePractice();
    var words = Practice.topDifficult(state.practice.difficult, 3);
    if (!words.length) { renderHome(); show("screen-home"); return; }
    renderPracticeReview(words);
    show("screen-session");
  }
  function renderPracticeReview(words) {
    reviewState = { words: words, i: 0, step: "syll", rec: null };
    drawReview();
  }
  function drawReview() {
    var rs = reviewState, html = '<div class="sec-head"><button class="icon-btn" data-act="home">✕</button></div>';
    if (rs.i >= rs.words.length) {
      html += '<div class="read-card" style="text-align:center"><div style="font-size:4rem">🎉</div>' +
        '<h2>' + t("practiceReviewDone") + '</h2><div class="spacer"></div>' +
        '<button class="btn primary big" data-act="home">' + t("backMap") + '</button></div>';
      $("#screen-session").innerHTML = html; confetti(); return;
    }
    var w = rs.words[rs.i];
    html += '<div class="read-card" style="text-align:center"><p class="eyebrow">' + t("practiceReviewTitle") +
      ' · ' + (rs.i + 1) + '/' + rs.words.length + '</p><p class="muted">' + t("practiceReviewIntro") + '</p>';
    if (rs.step === "syll") {
      html += '<div class="practice-big">' + Practice.syllabify(w).join(" · ") + '</div>' +
        '<div class="practice-actions"><button class="btn ghost" data-act="review-hear">🔊</button>' +
        '<button class="btn primary big" data-act="review-next">' + t("next") + ' →</button></div>';
    } else {
      html += '<div class="practice-big">' + w + '</div><div class="practice-msg" id="practice-msg" role="status"></div>' +
        '<div class="practice-actions">' +
        (Recognizer.isSupported() ? '<button class="btn primary big" data-act="review-listen">' + t("practiceRead") + '</button>' : '') +
        '<button class="btn ghost" data-act="review-hear">🔊</button>' +
        '<button class="btn accent" data-act="review-next">' + t("next") + ' →</button></div>';
    }
    $("#screen-session").innerHTML = html + '</div>';
  }
  function reviewNext() {
    var rs = reviewState; if (!rs) return;
    stopPracticeListening();
    if (rs.step === "syll") rs.step = "word"; else { rs.i++; rs.step = "syll"; }
    drawReview();
  }
  function reviewListen() {
    var rs = reviewState; if (!rs || rs.rec) return;
    var word = rs.words[rs.i], heard = "", got = false;
    setMsg(t("practiceListening"));
    var rec = Recognizer.create({
      lang: "es-CO",
      onFinal: function (txt) { got = true; heard = txt; },
      onError: function () {},
      onEnd: function () {
        if (reviewState !== rs || rs.rec !== rec) return;
        rs.rec = null;
        if (!heard.trim()) { setMsg(t("practiceNoHear")); return; }
        if (Practice.alignReading(word, heard).allOk) { setMsg('🌟 ' + randomPraise()); ding(true); }
        else { setMsg(t("practiceModel") + ' <b>' + word + '</b>'); speak(word); }
      }
    });
    rs.rec = rec;
    rec.start();
  }

  /* ============================================================
     ZONA DE PADRES (candado + perfiles)
     ============================================================ */
  var parentLock = null, parentUnlocked = false, parentDraft = null;

  function parentsScreen(html) { $("#screen-parents").innerHTML = html; }
  function langLabel(code) {
    var l = SUPPORTED_LANGS.filter(function (x) { return x.code === code; })[0];
    return l ? l.flag + " " + l.name : code;
  }

  function renderLock(wrong) {
    parentsScreen('<div class="center-col" style="padding-top:8vh;text-align:center">' +
      '<div style="font-size:3.5rem">🔒</div><h1>' + t("lockTitle") + '</h1>' +
      '<p class="muted">' + (wrong ? t("lockWrong") : t("lockAsk")) + '</p>' +
      '<p class="practice-big">' + parentLock.question + ' = ?</p>' +
      '<input id="lock-answer" class="text-input" type="text" inputmode="numeric" autocomplete="off">' +
      '<div class="spacer"></div><div class="practice-actions">' +
      '<button class="btn primary big" data-act="lock-submit">' + t("lockEnter") + '</button>' +
      '<button class="btn ghost" data-act="parents-exit">' + t("close") + '</button></div></div>');
    var inp = $("#lock-answer"); if (inp) inp.focus();
  }

  function renderParentsHome() {
    var html = '<div class="center-col" style="padding-top:3vh"><h1>🔓 ' + t("parentZone") + '</h1>' +
      '<p class="muted" style="font-size:.9rem">' + t("storageNote") + '</p>';
    store.profiles.forEach(function (p) {
      html += '<div class="mission"><span class="big-ic">' + p.avatar + '</span><div style="flex:1">' +
        '<strong>' + esc(p.name) + '</strong> <span class="muted">' + langLabel(p.lang) + ' · ⭐ ' + (p.game.stars || 0) + '</span></div>' +
        '<div class="btn-row">' +
        '<button class="btn ghost" data-act="parents-edit" data-id="' + esc(p.id) + '">' + t("editProfile") + '</button>' +
        '<button class="btn ghost" data-act="parents-report" data-id="' + esc(p.id) + '">' + t("viewReport") + '</button>' +
        '<button class="btn ghost" data-act="parents-reset-progress" data-id="' + esc(p.id) + '">' + t("resetProgress") + '</button>' +
        '<button class="btn ghost" data-act="parents-delete" data-id="' + esc(p.id) + '" style="color:var(--c-red)">' + t("deleteProfile") + '</button>' +
        '</div></div>';
    });
    html += '<div class="spacer"></div><div class="practice-actions">' +
      (store.profiles.length >= Profiles.MAX_PROFILES
        ? '<p class="muted">' + t("limitReached") + '</p>'
        : '<button class="btn primary" data-act="parents-new">＋ ' + t("newProfile") + '</button>') +
      (store.profiles.length ? '<button class="btn ghost" data-act="parents-reset-all" style="color:var(--c-red)">' + t("resetAll") + '</button>' : '') +
      '<button class="btn ghost" data-act="parents-exit">' + t("exitParents") + '</button></div></div>';
    parentsScreen(html);
  }

  // Ejecuta fn con `state` sustituido temporalmente por el del perfil indicado (p. ej. para su informe)
  function withProfile(id, fn) {
    var p = Profiles.findProfile(store, id), saved = state;
    if (!p) return;
    state = Profiles.toState(p);
    try { fn(); } finally { state = saved; }
  }

  function newDraft() {
    return { id: null, name: "", avatar: Profiles.AVATARS[0], lang: state.lang === "en" ? "en" : "es",
      theme: "light", readScale: "normal", readFont: "standard", sound: true, timers: true };
  }
  function readDraftName() { var i = $("#profile-name"); if (i && parentDraft) parentDraft.name = i.value; }

  function renderProfileForm(msg) {
    var d = parentDraft;
    function seg(key, opts, cur) {
      return '<div class="seg">' + opts.map(function (o) {
        return '<button data-pset="' + key + '" data-val="' + o.v + '" class="' + (cur === o.v ? "on" : "") + '">' + o.l + '</button>';
      }).join("") + '</div>';
    }
    var avatars = Profiles.AVATARS.map(function (a) {
      return '<button class="avatar-opt' + (d.avatar === a ? " on" : "") + '" data-pset="avatar" data-val="' + a + '">' + a + '</button>';
    }).join("");
    parentsScreen('<div class="center-col" style="padding-top:3vh"><h1>' + (d.id ? t("editProfile") : t("newProfile")) + '</h1>' +
      '<div class="row"><span>' + t("fieldName") + '</span><input id="profile-name" class="text-input" maxlength="' + Profiles.NAME_MAX + '" value="' + esc(d.name) + '"></div>' +
      '<div class="row"><span>' + t("fieldAvatar") + '</span><div class="avatar-grid">' + avatars + '</div></div>' +
      '<div class="row"><span>' + t("language") + '</span>' + seg("lang", SUPPORTED_LANGS.map(function (l) { return { v: l.code, l: l.flag + " " + l.name }; }), d.lang) + '</div>' +
      '<div class="row"><span>' + t("theme") + '</span>' + seg("theme", [{ v: "light", l: t("light") }, { v: "dark", l: t("dark") }], d.theme) + '</div>' +
      '<div class="row"><span>' + t("textSize") + '</span>' + seg("readScale", [{ v: "small", l: t("small") }, { v: "normal", l: t("normal") }, { v: "large", l: t("large") }], d.readScale) + '</div>' +
      '<div class="row"><span>' + t("readFont") + '</span>' + seg("readFont", [{ v: "standard", l: t("standard") }, { v: "dyslexia", l: t("easyRead") }, { v: "serif", l: "Serif" }], d.readFont) + '</div>' +
      '<div class="row"><span>' + t("sound") + '</span>' + seg("sound", [{ v: "on", l: t("on") }, { v: "off", l: t("off") }], d.sound ? "on" : "off") + '</div>' +
      '<div class="row"><span>' + t("timersLabel") + '</span>' + seg("timers", [{ v: "on", l: t("on") }, { v: "off", l: t("off") }], d.timers ? "on" : "off") + '</div>' +
      '<div class="practice-msg" id="parents-msg" role="status">' + (msg || "") + '</div>' +
      '<div class="practice-actions"><button class="btn primary big" data-act="profile-save">' + t("profileSave") + '</button>' +
      '<button class="btn ghost" data-act="profile-cancel">' + t("profileCancel") + '</button></div></div>');
  }

  function saveProfileDraft() {
    readDraftName();
    var d = parentDraft, res;
    var settings = { name: d.name, avatar: d.avatar, lang: d.lang, theme: d.theme, readScale: d.readScale, readFont: d.readFont, sound: d.sound, timers: d.timers };
    if (d.id) res = Profiles.updateProfile(store, d.id, settings);
    else {
      res = Profiles.addProfile(store, { name: d.name, avatar: d.avatar, lang: d.lang });
      if (res.ok) res = Profiles.updateProfile(store, res.profile.id, settings);
    }
    if (!res.ok) { renderProfileForm(res.error === "limit" ? t("limitReached") : t("nameRequired")); return; }
    persistStore();
    parentDraft = null;
    renderParentsHome();
  }

  function parentAction(act, tg) {
    if (act === "parents") {
      parentLock = Profiles.makeLock(); parentUnlocked = false; parentDraft = null;
      renderLock(false); show("screen-parents"); return true;
    }
    if (act === "parents-exit") {
      parentUnlocked = false; parentDraft = null; renderProfiles(); show("screen-profiles"); return true;
    }
    if (act === "lock-submit") {
      var inp = $("#lock-answer");
      if (parentLock && Profiles.checkLock(parentLock, inp ? inp.value : "")) { parentUnlocked = true; renderParentsHome(); }
      else { parentLock = Profiles.makeLock(); renderLock(true); }
      return true;
    }
    if (!parentUnlocked) return false;
    if (act === "parents-new") { parentDraft = newDraft(); renderProfileForm(); return true; }
    if (act === "parents-edit") {
      var p = Profiles.findProfile(store, tg.dataset.id);
      if (!p) return true;
      parentDraft = { id: p.id, name: p.name, avatar: p.avatar, lang: p.lang, theme: p.theme,
        readScale: p.readScale, readFont: p.readFont, sound: p.sound, timers: p.timers };
      renderProfileForm(); return true;
    }
    if (act === "parents-report") {
      var rp = Profiles.findProfile(store, tg.dataset.id);
      if (rp) withProfile(rp.id, parentSheet);
      return true;
    }
    if (act === "parents-reset-progress" || act === "parents-delete") {
      var dp = Profiles.findProfile(store, tg.dataset.id);
      if (!dp) return true;
      var del = act === "parents-delete";
      if (confirm(t(del ? "confirmDelete" : "confirmResetProgress").replace("{name}", dp.name))) {
        if (del) Profiles.deleteProfile(store, dp.id); else Profiles.resetProgress(store, dp.id);
        persistStore(); renderParentsHome();
      }
      return true;
    }
    if (act === "parents-reset-all") {
      if (confirm(t("confirmResetAll"))) { store = Profiles.resetAll(); persistStore(); renderParentsHome(); }
      return true;
    }
    if (act === "profile-cancel") { parentDraft = null; renderParentsHome(); return true; }
    if (act === "profile-save") { if (parentDraft) saveProfileDraft(); return true; }
    return false;
  }

  /* ============================================================
     SHEETS: Einstellungen, Wortschatz, Sammlung, Eltern, Entdecken
     ============================================================ */
  var overlay = $("#overlay"), sheet = $("#sheet");
  function openSheet(html) { sheet.innerHTML = html; overlay.classList.add("show"); }
  function closeSheet() { overlay.classList.remove("show"); }

  function parentSheet() {
    ensureStats();
    var st = state.stats;
    var acc = st.answered ? Math.round(st.correct / st.answered * 100) : 0;
    var mins = Math.round((st.seconds || 0) / 60);
    var bt = st.byType;

    function skillBar(label, o) {
      var pct = o.n ? Math.round(o.c / o.n * 100) : 0;
      return '<div class="mission"><div style="flex:1">' +
        '<strong>' + label + '</strong> <span class="muted">' + (o.n ? pct + "% \u00b7 " + o.c + "/" + o.n : t("noData")) + '</span>' +
        '<div class="bar"><span style="width:' + pct + '%"></span></div></div></div>';
    }

    // Schwaechsten Bereich finden (nur mit genug Daten) -> konkrete Empfehlung
    var tip = t("focusGreat"), worst = null;
    [["comprehension", bt.comprehension, "focusReading"], ["spelling", bt.spelling, "focusSpelling"], ["vocab", bt.vocab, "focusVocab"]].forEach(function (c) {
      if (c[1].n >= 3) { var p = c[1].c / c[1].n; if (worst === null || p < worst.p) worst = { p: p, key: c[2] }; }
    });
    if (worst && worst.p < 0.8) tip = t(worst.key);

    var html = '<button class="btn ghost close" data-act="close">' + t("close") + '</button>' +
      '<h2>\uD83D\uDC6A ' + t("report") + '</h2><p class="muted">' + t("parentInfo") + '</p>' +
      '<div class="btn-row">' +
        '<span class="chip gold">\u2b50 ' + state.stars + '</span>' +
        '<span class="chip">\uD83E\uDE99 ' + state.coins + '</span>' +
        '<span class="chip">\uD83D\uDD25 ' + state.streak + '</span>' +
        '<span class="chip">' + t("level") + ' ' + state.level + '</span>' +
      '</div>' +
      '<div class="row"><span>' + t("sessions") + '</span><strong>' + st.sessions + '</strong></div>' +
      '<div class="row"><span>' + t("accuracy") + '</span><strong>' + acc + '%</strong></div>' +
      '<div class="row"><span>' + t("wordsRead") + '</span><strong>' + st.words + '</strong></div>' +
      '<div class="row"><span>' + t("readingTime") + '</span><strong>' + mins + ' ' + t("minShort") + '</strong></div>' +
      '<div class="spacer"></div><h3>' + t("bySkill") + '</h3>' +
      skillBar(t("comprehension"), bt.comprehension) +
      skillBar(t("spelling"), bt.spelling) +
      skillBar(t("vocabulary"), bt.vocab) +
      '<div class="mission done"><span class="big-ic">\uD83D\uDCA1</span><div style="flex:1"><strong>' + t("focusTip") + '</strong><br><span class="muted">' + tip + '</span></div></div>';

    if (state.lang === "es") {
      ensurePractice();
      var ps = state.practice.sessions;
      html += '<div class="spacer"></div><h3>\uD83D\uDDE3\uFE0F ' + t("parentPractice") + '</h3>';
      if (!ps.length) html += '<p class="muted">' + t("noData") + '</p>';
      else {
        html += '<div class="row"><span>' + t("parentLastSessions") + '</span><strong>' + t("parentWpm") + ' \u00b7 ' + t("parentHelped") + '</strong></div>';
        ps.slice(0, 8).forEach(function (p) {
          html += '<div class="row"><span>' + p.date + '</span><strong>' + p.wpm + ' \u00b7 ' + p.helped + '</strong></div>';
        });
      }
    }

    html += '<div class="spacer"></div><h3>' + t("worldProgress") + '</h3>';
    worlds().forEach(function (wld) {
      var done = wld.stories.filter(function (s) { return state.finished[s.id]; }).length;
      var pct = Math.round(done / wld.stories.length * 100);
      html += '<div class="mission"><span class="big-ic">' + wld.emoji + '</span><div style="flex:1">' +
        '<strong>' + loc(wld.name) + '</strong> <span class="muted">' + done + '/' + wld.stories.length + '</span>' +
        '<div class="bar"><span style="width:' + pct + '%"></span></div></div></div>';
    });

    if (state.history && state.history.length) {
      html += '<div class="spacer"></div><h3>' + t("recent") + '</h3>';
      state.history.slice(0, 6).forEach(function (h) {
        html += '<div class="row"><span>' + h.title + ' <span class="muted">(' + h.date + ')</span></span>' +
          '<strong>\u2b50' + h.stars + ' \u00b7 ' + h.correct + '/' + h.answered + '</strong></div>';
      });
    }

    openSheet(html);
  }

  function collectionSheet() {
    var html = '<button class="btn ghost close" data-act="close">' + t("close") + '</button>' +
      '<h2>\uD83D\uDCD5 ' + t("collection") + '</h2>';
    var any = Object.keys(state.badges).length > 0;
    if (!any) html += '<p class="muted">' + t("collectionEmpty") + '</p>';
    html += '<div class="collection">';
    worlds().forEach(function (w) {
      var b = BADGES[w.id]; var got = state.badges[w.id];
      html += '<div class="collect-item' + (got ? "" : " locked") + '"><div class="emoji">' + b.emoji + '</div><small>' + loc(b) + '</small></div>';
    });
    html += '</div>';
    openSheet(html);
  }

  function discoverSheet() {
    var d = CONTENT.discover[Math.floor(Math.random() * CONTENT.discover.length)];
    openSheet('<button class="btn ghost close" data-act="close">' + t("close") + '</button>' +
      '<h2>\uD83D\uDD2D ' + t("discover") + '</h2><p class="muted">' + t("discoverDesc") + '</p>' +
      '<div class="read-card" style="text-align:center"><div style="font-size:4rem">' + d.emoji + '</div>' +
      '<p class="story-text">' + loc(d) + '</p></div>' +
      '<div class="spacer"></div><button class="btn primary big" data-act="discover">\uD83D\uDD04 ' + t("discover") + '</button>');
  }

  function vocabSheet(word, def) {
    openSheet('<button class="btn ghost close" data-act="close">' + t("close") + '</button>' +
      '<h2>\uD83D\uDCAC ' + t("vocabTitle") + '</h2>' +
      '<div class="read-card" style="text-align:center"><div style="font-size:2.4rem">\uD83D\uDCDD</div>' +
      '<h2>' + word + '</h2><p class="story-text">' + def + '</p>' +
      (session ? '<button class="btn ghost" data-act="speakword" data-w="' + encodeURIComponent(word) + '">\uD83D\uDD0A ' + t("readAloud") + '</button>' : '') +
      '</div><div class="spacer"></div><button class="btn primary big" data-act="close">' + t("gotIt") + '</button>');
  }

  /* ============================================================
     EFFEKTE: Ton (WebAudio), Vorlesen (SpeechSynthesis), Konfetti
     ============================================================ */
  var audioCtx = null;
  function ding(ok) {
    if (!state.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = "sine";
      o.frequency.value = ok ? 660 : 200;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      o.start(); if (ok) { o.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); }
      o.stop(audioCtx.currentTime + 0.32);
    } catch (e) {}
  }
  // Elige una voz del navegador que coincida con el idioma (es-CO > es-* > cualquiera es)
  function pickVoice(langTag) {
    var voices = window.speechSynthesis.getVoices() || [];
    var base = langTag.split("-")[0].toLowerCase();
    var exact = voices.filter(function (v) { return v.lang.replace("_", "-").toLowerCase() === langTag.toLowerCase(); })[0];
    return exact || voices.filter(function (v) { return v.lang.toLowerCase().indexOf(base) === 0; })[0] || null;
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) { toast("\uD83D\uDD07 " + t("noVoice")); return; }
    window.speechSynthesis.cancel();
    var tag = state.lang === "en" ? "en-GB" : "es-CO";
    var u = new SpeechSynthesisUtterance(text);
    var voice = pickVoice(tag);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = tag;
    u.rate = 0.9;
    // Sin voces instaladas o fallo del motor: avisar en vez de quedarse en silencio
    u.onerror = function (e) { if (e.error !== "canceled" && e.error !== "interrupted") toast("\uD83D\uDD07 " + t("noVoice")); };
    window.speechSynthesis.speak(u);
  }
  if ("speechSynthesis" in window) window.speechSynthesis.getVoices();   // algunos navegadores cargan las voces de forma diferida
  function confetti() {
    if (state.theme === undefined) return;
    var emojis = ["\u2b50","\uD83C\uDF89","\u2728","\uD83E\uDE99","\uD83C\uDF8A"];
    for (var i = 0; i < 16; i++) {
      (function (i) {
        var c = el("div", "confetti"); c.textContent = emojis[i % emojis.length];
        c.style.left = Math.random() * 100 + "vw";
        c.style.animationDelay = (Math.random() * 0.5) + "s";
        document.body.appendChild(c);
        setTimeout(function () { c.remove(); }, 2600);
      })(i);
    }
  }
  var toastTimer = null;
  function toast(msg) {
    var tEl = $("#toast"); tEl.textContent = msg; tEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { tEl.classList.remove("show"); }, 2600);
  }

  /* ============================================================
     EVENT-DELEGATION (ein Listener fuer Touch/Click)
     ============================================================ */
  document.addEventListener("click", function (e) {
    var tg = e.target.closest("[data-profile],[data-world],[data-locked],[data-story],[data-mode],[data-act],[data-opt],[data-spot],[data-vocab],[data-practice-story],[data-pset]");
    if (!tg) return;

    // Formulario de perfil (zona de padres)
    if (tg.dataset.pset) {
      if (!parentUnlocked || !parentDraft) return;
      readDraftName();
      parentDraft[tg.dataset.pset] = (tg.dataset.pset === "sound" || tg.dataset.pset === "timers") ? tg.dataset.val === "on" : tg.dataset.val;
      renderProfileForm();
      return;
    }
    // Perfil elegido
    if (tg.dataset.profile) { enterProfile(tg.dataset.profile); return; }
    // Vokabel angeklickt
    if (tg.dataset.vocab) {
      vocabSheet(decodeURIComponent(tg.dataset.vocab), decodeURIComponent(tg.dataset.def));
      return;
    }
    // Práctica en voz alta: tarjeta de historia
    if (tg.dataset.practiceStory) {
      if (tg.dataset.practiceLocked) { toast("\uD83D\uDD12 " + t("practiceLocked")); return; }
      startPractice(tg.dataset.practiceStory, tg.dataset.resume ? state.practice.resume : undefined);
      return;
    }
    // Welt / Geschichte / Modus
    if (tg.dataset.locked) { toast("\uD83D\uDD12 " + t("locked")); return; }
    if (tg.dataset.world && !tg.dataset.act) { renderWorld(tg.dataset.world); show("screen-world"); return; }
    if (tg.dataset.story) { closeSheet(); startSession(tg.dataset.story, "standard"); return; }
    // Antwort-Option
    if (tg.dataset.opt != null) { if (!tg.disabled) answer(parseInt(tg.dataset.opt, 10)); return; }
    // Metalldetektor-Stelle
    if (tg.dataset.spot != null) { if (!tg.disabled) detectorTap(parseInt(tg.dataset.spot, 10)); return; }

    // Aktionen
    var act = tg.dataset.act;
    if (act && parentAction(act, tg)) return;
    switch (act) {
      case "switch": leaveProfile(); break;
      case "close": closeSheet(); break;
      case "collection": collectionSheet(); break;
      case "discover": discoverSheet(); break;
      case "home": closeSheet(); renderHome(); show("screen-home"); break;
      case "world": renderWorld(tg.dataset.world); show("screen-world"); break;
      case "toTasks":
        session.phase = "tasks"; session.ti = 0;
        if (!(session.story.sections[session.si].tasks || []).length) nextSection();
        else renderTask();
        break;
      case "speak": speak(sectionDisplayText(session.story.sections[session.si])); break;
      case "toggleEasy": {
        var s0 = session.story.sections[session.si];
        session.easyText = useEasy(s0) ? false : true;
        renderSection();
        break;
      }
      case "speakword": speak(decodeURIComponent(tg.dataset.w)); break;
      case "joker":
        if (state.timers === false) break;
        if (session.jokers > 0) { session.jokers--; session.timeLeft += JOKER_SECONDS; updateTimer(); toast(t("jokerUsed"));
          if (session.phase === "read") renderSection(); else renderTask(); }
        else toast(t("noJoker"));
        break;
      case "practice": renderPracticeList(); show("screen-world"); break;
      case "practice-listen": practiceListen(); break;
      case "practice-hear":
        if (session && session.mode === "practice")
          speak(session.modeling ? session.modeling.words[session.modeling.i] : session.sents[session.sn]);
        break;
      case "practice-next": if (session && session.mode === "practice") practiceNext(); break;
      case "practice-adult-next":
        if (session && session.mode === "practice") { if (session.modeling) modelAdvance(); else completeSentence(); }
        break;
      case "practice-pause-save": savePracticePause(); break;
      case "practice-pause-go": renderPracticeSentence(); break;
      case "practice-review": startReview(); break;
      case "review-hear": if (reviewState) speak(reviewState.words[reviewState.i]); break;
      case "review-next": reviewNext(); break;
      case "review-listen": reviewListen(); break;
      case "quit": stopTimer(); stopPracticeListening(); if (window.speechSynthesis) window.speechSynthesis.cancel(); renderHome(); show("screen-home"); break;
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target && e.target.id === "lock-answer") {
      var b = $('[data-act="lock-submit"]'); if (b) b.click();
    }
  });
  // Overlay-Hintergrund schliesst Sheet
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeSheet(); });

  /* ---------- Lookups ---------- */
  function findWorld(id) { return worlds().filter(function (w) { return w.id === id; })[0]; }
  function findStory(id) {
    for (var i = 0; i < worlds().length; i++) {
      var w = worlds()[i];
      for (var j = 0; j < w.stories.length; j++) if (w.stories[j].id === id) return { world: w, story: w.stories[j] };
    }
    return null;
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    try { localStorage.removeItem(Profiles.LEGACY_KEY); } catch (e) {}
    applyPrefs();
    renderProfiles();
    show("screen-profiles");
  }
  init();

  // Fuer Tests / Konsole zugaenglich machen
  window.LeseAbenteuer = { state: function () { return state; }, CONTENT: CONTENT, estimateStoryMinutes: estimateStoryMinutes, sectionSeconds: sectionSeconds,
    Recognizer: Recognizer, Practice: Practice, Profiles: Profiles, store: function () { return store; },
    enterProfile: enterProfile, leaveProfile: leaveProfile, session: function () { return session; }, startPractice: startPractice, parentSheet: parentSheet };
})();
