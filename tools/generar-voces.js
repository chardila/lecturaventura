// Genera los audios pregenerados (audio/<lang>/<clave>.mp3) con edge-tts.
// Uso: node tools/generar-voces.js [--dry-run] [--concurrency N]
var fs = require("fs");
var os = require("os");
var path = require("path");
var execFile = require("child_process").execFile;
var Voice = require("../src/voice.js");

var VOICES = { es: "es-CO-SalomeNeural", en: "en-GB-LibbyNeural" };
var RATE = "-10%";
var KB_PER_CHAR = 0.45;
var ROOT = path.join(__dirname, "..");

function planMissing(clips, exists) {
  return clips.filter(function (c) { return !exists(Voice.clipUrl(c.lang, c.key)); });
}

function buildManifest(clips, sizeOf) {
  var out = { version: 1, clips: {} };
  clips.forEach(function (c) {
    var bytes = sizeOf(Voice.clipUrl(c.lang, c.key));
    if (bytes > 0) out.clips[c.key] = { lang: c.lang, bytes: bytes };
  });
  return out;
}

function findEdgeTts() {
  var dirs = (process.env.PATH || "").split(path.delimiter).concat([path.join(os.homedir(), ".local", "bin")]);
  for (var i = 0; i < dirs.length; i++) {
    if (dirs[i] && fs.existsSync(path.join(dirs[i], "edge-tts"))) return path.join(dirs[i], "edge-tts");
  }
  return "edge-tts";
}

// Unico punto que conoce edge-tts. Sin shell; el texto va como --text=... (seguro si empieza con "-").
function synthesize(clip, outPath) {
  var tmp = outPath + ".tmp";
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  var args = ["-v", VOICES[clip.lang], "--rate=" + RATE, "--text=" + clip.text, "--write-media", tmp];
  return new Promise(function (resolve, reject) {
    execFile(findEdgeTts(), args, { maxBuffer: 10 * 1024 * 1024, timeout: 60000 }, function (err, stdout, stderr) {
      function fail(e) { try { fs.unlinkSync(tmp); } catch (x) {} reject(e); }
      if (err) return fail(new Error("edge-tts fallo: " + (stderr || err.message)));
      var size = 0;
      try { size = fs.statSync(tmp).size; } catch (e) {}
      if (!size) return fail(new Error("edge-tts produjo un archivo vacio para " + clip.key));
      fs.renameSync(tmp, outPath);
      resolve();
    });
  });
}

function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

function withRetries(clip, outPath, tries) {
  var attempt = 0;
  function go() {
    return synthesize(clip, outPath).catch(function (e) {
      attempt++;
      if (attempt >= tries) throw e;
      return sleep(1000 * attempt * attempt).then(go);
    });
  }
  return go();
}

function abs(rel) { return path.join(ROOT, rel); }
function existsNonEmpty(rel) { try { return fs.statSync(abs(rel)).size > 0; } catch (e) { return false; } }
function sizeOf(rel) { try { return fs.statSync(abs(rel)).size; } catch (e) { return 0; } }

function main(argv) {
  var dry = argv.indexOf("--dry-run") !== -1;
  var ci = argv.indexOf("--concurrency");
  var concurrency = ci !== -1 ? parseInt(argv[ci + 1], 10) : 4;
  if (!(concurrency > 0)) concurrency = 4;

  var clips = Voice.clipsFor(require("../tests/helpers/load-content.js")(), require("../src/practice.js"));
  var missing = planMissing(clips, existsNonEmpty);
  var chars = missing.reduce(function (n, c) { return n + c.text.length; }, 0);
  var allChars = clips.reduce(function (n, c) { return n + c.text.length; }, 0);
  console.log("Clips totales: " + clips.length + " (" + allChars + " caracteres)");
  console.log("Faltantes: " + missing.length + " (" + chars + " caracteres)");
  console.log("MB estimados (todos): " + (allChars * KB_PER_CHAR / 1024).toFixed(1));
  console.log("MB estimados (faltantes): " + (chars * KB_PER_CHAR / 1024).toFixed(1));
  if (dry) return Promise.resolve();

  ["es", "en"].forEach(function (l) { fs.mkdirSync(abs("audio/" + l), { recursive: true }); });
  var next = 0, done = 0, failed = 0;
  function worker() {
    if (next >= missing.length) return Promise.resolve();
    var clip = missing[next++];
    return withRetries(clip, abs(Voice.clipUrl(clip.lang, clip.key)), 3).then(function () {
      done++;
      if (done % 50 === 0) console.log(done + "/" + missing.length);
    }, function (e) {
      failed++;
      console.error("FALLO " + clip.lang + "/" + clip.key + ": " + e.message);
    }).then(worker);
  }
  var workers = [];
  for (var i = 0; i < concurrency; i++) workers.push(worker());
  return Promise.all(workers).then(function () {
    var manifest = buildManifest(clips, sizeOf);
    fs.writeFileSync(abs("audio/manifest.json"), JSON.stringify(manifest));
    console.log("Generados: " + done + ", fallidos: " + failed + ", en manifest: " + Object.keys(manifest.clips).length);
    if (failed) process.exitCode = 1;
  });
}

module.exports = {
  VOICES: VOICES, RATE: RATE, planMissing: planMissing, synthesize: synthesize,
  buildManifest: buildManifest
};

if (require.main === module) {
  main(process.argv.slice(2)).catch(function (e) { console.error(e); process.exit(1); });
}
