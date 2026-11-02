# Voces pregeneradas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar la voz robótica de `speechSynthesis` por MP3 neuronales pregenerados (Salomé es-CO, Libby en-GB), con respaldo a la voz actual, caché y descarga para uso sin internet.

**Architecture:** Un módulo puro `src/voice.js` (clave por hash, lista de clips, resolución contra manifiesto) lo comparten el generador de Node y la app. `tools/generar-voces.js` produce `audio/<lang>/<clave>.mp3` y `audio/manifest.json` con el CLI `edge-tts`. `speak()` reproduce el MP3 con un único elemento `Audio` y cae a `speechSynthesis` ante cualquier fallo.

**Tech Stack:** JS puro (ES5, estilo `var` del proyecto), `node --test`, Cache API del navegador, `edge-tts` (CLI de Python, instalado con pipx).

**Spec:** `docs/superpowers/specs/2026-11-02-voces-pregeneradas-design.md`

## Global Constraints

- Voces: español `es-CO-SalomeNeural`, inglés `en-GB-LibbyNeural`, `--rate=-10%`.
- Clave de audio: `hash(idioma + "|" + texto normalizado)`, cyrb53 síncrono en JS puro; mismo módulo en Node y navegador.
- Rutas: `audio/es/<clave>.mp3`, `audio/en/<clave>.mp3`, `audio/manifest.json` con forma `{ version: 1, clips: { "<clave>": { lang, bytes } } }`.
- Textos que se locutan: `text` y `easy` de cada sección (es y en); frases (`Practice.splitSentences` sobre `text`) y palabras (`Practice.cleanWord` de cada palabra de esas frases), solo es.
- Respaldo: si falta manifiesto, clave, red o `play()` falla, se usa `speechSynthesis` como hoy (`rate 0.9`, `es-CO` / `en-GB`).
- `index.html` sigue siendo un solo archivo (`bash build.sh`); los audios van aparte. No se toca `.github/workflows/pages.yml` (`path: .`).
- Código en español para textos de interfaz (claves `es` y `en` en `src/content.js`), estilo ES5 con `var`, sin dependencias nuevas de npm.
- Los commits terminan con la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Tras editar `src/`: `bash build.sh` y subir `index.html` regenerado en el mismo commit.

## Review Focus

- Un cuento editado sin regenerar audio → el test de cobertura falla (Task 3).
- Espacios/saltos de línea distintos en el mismo texto → misma clave (Task 1).
- Generación interrumpida o `edge-tts` que deja un MP3 vacío → al repetir se reanuda y no cuenta archivos de 0 bytes (Task 2).
- Manifiesto ausente (`file://`, sin red la primera vez) → `speak()` no lanza y usa la voz actual (Task 4).
- Dos `speak()` seguidos mientras el primero aún carga → solo suena el último (Task 4).
- iPad bloquea `play()` tras un `await` → el elemento `Audio` se desbloquea en el primer toque (Task 4).
- Cache API no disponible (modo privado) → sigue sonando por red, sin error (Task 4 y 5).
- "Descargar voces" cancelada o con corte de red a medias → lo ya guardado se conserva y se puede reanudar (Task 5).

---

### Task 1: Módulo puro `Voice`

**Files:**
- Create: `src/voice.js`
- Test: `tests/voice.test.js`

**Interfaces:**
- Consumes: `Practice.splitSentences(text) -> string[]`, `Practice.cleanWord(w) -> string` (`src/practice.js`); estructura `CONTENT.worlds[].stories[].sections[]` con `text`/`easy` = `{es,en}` (`tests/helpers/load-content.js` carga `CONTENT`).
- Produces:
  - `Voice.normalize(text: string) -> string` (NFC, espacios colapsados, `trim`).
  - `Voice.key(lang: "es"|"en", text: string) -> string` (14 caracteres hex, cyrb53 de `lang + "|" + normalize(text)`).
  - `Voice.clipsFor(content: object, practice: object) -> Array<{key, lang, text}>` sin claves repetidas, ordenado por `lang` y luego `key`.
  - `Voice.clipUrl(lang, key) -> string` (`"audio/" + lang + "/" + key + ".mp3"`).
  - `Voice.resolve(manifest: object|null, lang, text) -> string|null` (URL si `manifest.clips[key]` existe y su `lang` coincide).
  - Se exporta con `module.exports` como `Practice`.

- [ ] **Step 1: Escribir las pruebas que fallan** en `tests/voice.test.js`:
  - `key` es estable: `Voice.key("es","Hola mundo")` devuelve siempre el mismo string de 14 hex.
  - `key("es","Hola\n  mundo ")` === `key("es","Hola mundo")`.
  - `key("es","Hola") !== key("en","Hola")` y `key("es","Hola") !== key("es","Hola.")`.
  - `normalize` conserva `ñ` y tildes (NFC de `"mamá"` escrito con combinante).
  - `clipsFor(loadContent(), Practice)`: sin claves duplicadas; incluye, para una sección real, `text.es`, `easy.es` si existe y `text.en`; incluye cada frase de `splitSentences(text.es)` y cada `cleanWord` de esas frases en `es`; no incluye frases ni palabras en `en`.
  - `resolve({version:1,clips:{[k]:{lang:"es",bytes:1}}}, "es", texto)` devuelve `"audio/es/"+k+".mp3"`; con manifiesto `null`, clave ausente o `lang` distinto devuelve `null`.

- [ ] **Step 2: Ejecutar y ver que falla** — `node --test tests/voice.test.js` → FAIL (`Cannot find module '../src/voice.js'`).

- [ ] **Step 3: Implementar `src/voice.js`** con las firmas de arriba. Hash: cyrb53 (semilla 0) sobre `charCodeAt`, resultado `(4294967296 * (2097151 & h2) + (h1 >>> 0))` en hex con relleno a 14. `clipsFor` recorre mundos → historias → secciones; descarta textos vacíos.

- [ ] **Step 4: Ejecutar y ver que pasa** — `node --test tests/voice.test.js` → PASS.

- [ ] **Step 5: Commit**
```bash
git add src/voice.js tests/voice.test.js
git commit -m "Voces: módulo Voice con claves por hash y lista de clips"
```

---

### Task 2: Generador `tools/generar-voces.js`

**Files:**
- Create: `tools/generar-voces.js`
- Test: `tests/generar-voces.test.js`

**Interfaces:**
- Consumes: `Voice.clipsFor`, `Voice.clipUrl` (Task 1); `loadContent` de `tests/helpers/load-content.js`; `Practice`.
- Produces (exportados con `module.exports` y ejecutables como CLI con `require.main === module`):
  - `VOICES = { es: "es-CO-SalomeNeural", en: "en-GB-LibbyNeural" }`, `RATE = "-10%"`.
  - `planMissing(clips, exists: (path)=>bool) -> clips[]` (los que no tienen archivo no vacío).
  - `synthesize(clip, outPath: string) -> Promise<void>`: único punto que conoce `edge-tts`; escribe a `outPath + ".tmp"` y renombra al terminar; si el resultado pesa 0 bytes lanza error.
  - `buildManifest(clips, sizeOf: (path)=>number) -> {version:1, clips:{...}}`.
  - CLI: `node tools/generar-voces.js [--dry-run] [--concurrency N]` (por defecto 4). `--dry-run` imprime clips totales, faltantes, caracteres y MB estimados (0,45 KB por carácter) y no llama a `edge-tts`. Sin la opción: sintetiza los faltantes con 3 reintentos y espera creciente, y al final escribe `audio/manifest.json` solo con clips cuyo archivo existe.

- [ ] **Step 1: Pruebas que fallan** en `tests/generar-voces.test.js`:
  - `planMissing` devuelve solo los clips cuyo `exists` es falso.
  - `buildManifest` produce `{version:1, clips:{k:{lang,bytes}}}` y omite clips con `sizeOf` 0.
  - `VOICES.es === "es-CO-SalomeNeural"`, `VOICES.en === "en-GB-LibbyNeural"`, `RATE === "-10%"`.

- [ ] **Step 2: Ejecutar y ver que falla** — `node --test tests/generar-voces.test.js` → FAIL.

- [ ] **Step 3: Implementar** las funciones de arriba. `synthesize` ejecuta `edge-tts -v <voz> --rate=-10% -t <texto> --write-media <tmp>` con `child_process.execFile` (sin shell, el texto va como argumento) y busca `edge-tts` en `PATH` y en `~/.local/bin`. Crea `audio/es` y `audio/en` si faltan.

- [ ] **Step 4: Ejecutar y ver que pasa** — `node --test tests/generar-voces.test.js` → PASS.

- [ ] **Step 5: Medir** — `node tools/generar-voces.js --dry-run`. Anotar clips, caracteres y MB. **Punto de decisión:** si el estimado supera 80 MB, parar y consultar al usuario antes de la Task 3 (opciones: no locutar `easy`, no locutar palabras sueltas).

- [ ] **Step 6: Commit**
```bash
git add tools/generar-voces.js tests/generar-voces.test.js
git commit -m "Voces: generador de audios con edge-tts"
```

---

### Task 3: Generar los audios y prueba de cobertura

**Files:**
- Create: `audio/es/*.mp3`, `audio/en/*.mp3`, `audio/manifest.json` (generados)
- Test: `tests/voice-coverage.test.js`

**Interfaces:**
- Consumes: `Voice.clipsFor`, `Voice.key` (Task 1); `tools/generar-voces.js` (Task 2).
- Produces: `audio/manifest.json` completo; el test que falla si cualquier texto que `speak()` puede recibir no tiene clip.

- [ ] **Step 1: Escribir la prueba de cobertura que falla** — `tests/voice-coverage.test.js` lee `audio/manifest.json` (si no existe, falla con el mensaje `Ejecuta: node tools/generar-voces.js`) y comprueba que cada clip de `Voice.clipsFor(loadContent(), Practice)` tiene su clave en `manifest.clips` con el mismo `lang`; el mensaje de error lista hasta 10 textos faltantes.

- [ ] **Step 2: Ejecutar y ver que falla** — `node --test tests/voice-coverage.test.js` → FAIL (no hay manifiesto).

- [ ] **Step 3: Generar** — `node tools/generar-voces.js` (puede tardar bastante; si se interrumpe, volver a ejecutarlo: reanuda). Verificar al final que no hay `.tmp` sueltos: `ls audio/*/*.tmp` no debe listar nada.

- [ ] **Step 4: Ejecutar todas las pruebas** — `node --test tests/*.test.js` → todo PASS.

- [ ] **Step 5: Escuchar una muestra** — pedir al usuario que reproduzca 3 archivos al azar (una sección es, una frase es, una sección en) con `! mpv audio/es/<clave>.mp3` y confirme que suenan bien antes de commitear.

- [ ] **Step 6: Commit**
```bash
git add audio tests/voice-coverage.test.js
git commit -m "Voces: audios pregenerados y prueba de cobertura"
```

---

### Task 4: Reproducción en la app (`speak()`)

**Files:**
- Modify: `build.sh` (añadir `cat src/voice.js` antes de `cat src/app.js`)
- Modify: `src/app.js:1286-1298` (`speak`), `src/app.js:786`, `src/app.js:803`, `src/app.js:1402` (los `speechSynthesis.cancel()` pasan a `stopSpeech()`)
- Modify: `index.html` (regenerado)
- Test: manual con Chrome DevTools MCP o navegador (no hay DOM en las pruebas del proyecto)

**Interfaces:**
- Consumes: `Voice.resolve(manifest, lang, text) -> string|null` (Task 1); `audio/manifest.json` publicado.
- Produces en `src/app.js`:
  - `speakFallback(text)`: cuerpo actual de `speak()` (voz del navegador).
  - `stopSpeech()`: detiene el `Audio` y `speechSynthesis`, e invalida cualquier `speak()` pendiente.
  - `loadManifest() -> Promise<object|null>`: pide `audio/manifest.json` una vez por sesión (guarda la promesa); `null` si falla.
  - `fetchClip(url) -> Promise<string>`: devuelve una URL reproducible: del caché `voces-v1` si está; si no, `fetch`, guarda en `voces-v1` y devuelve `blob:`. Si `caches` no existe, `fetch` normal. Rechaza si la respuesta no es `ok`.
  - `speak(text)`: contrato igual al actual (un argumento, sin retorno).

- [ ] **Step 1: Desbloqueo del audio** — crear un solo `var voiceEl = new Audio()` y, en el primer `pointerdown` del documento, reproducir un WAV silencioso en `data:` con `voiceEl` y pausarlo (`{once:true}`), para que iPad/Silk permitan `play()` posteriores tras un `await`.

- [ ] **Step 2: Implementar `speak(text)`** — token incremental `speakId`; llama `stopSpeech()`; `loadManifest()` → `Voice.resolve(manifest, state.lang, text)` → si hay URL, `fetchClip(url)` → si `id !== speakId` descartar; asignar `voiceEl.src` y `play()`. Cualquier rechazo (manifiesto nulo, URL nula, `fetch` fallido, `play()` rechazado) → `speakFallback(text)` solo si `id === speakId`.

- [ ] **Step 3: Sustituir las tres llamadas a `speechSynthesis.cancel()`** (cierre de sesión, paso de pantalla, `quit`) por `stopSpeech()`.

- [ ] **Step 4: Construir y probar** — `bash build.sh && node --test tests/*.test.js` → PASS. Servir con `python3 -m http.server` y abrir en el navegador; comprobar: (a) "Escuchar" en una historia suena Salomé; (b) en inglés suena Libby; (c) pulsar dos frases rápido solo reproduce la última; (d) cerrar la sesión (✕) corta el audio; (e) renombrar `audio/manifest.json` temporalmente → suena la voz antigua y no hay error en consola; (f) abrir `index.html` por `file://` → voz antigua sin error.

- [ ] **Step 5: Commit**
```bash
git add build.sh src/app.js index.html
git commit -m "Voces: speak() reproduce los audios con respaldo a la voz del navegador"
```

---

### Task 5: "Descargar voces" y documentación

**Files:**
- Modify: `src/app.js` (`renderParentsHome`, ~línea 1026, y su `switch` de acciones)
- Modify: `src/content.js` (claves nuevas en `UI.es` y `UI.en`: `voicesTitle`, `voicesDownload`, `voicesSize`, `voicesProgress`, `voicesDone`, `voicesCancel`, `voicesNoCache`)
- Modify: `README.md`, `BACKLOG.md`, `index.html` (regenerado)
- Test: manual

**Interfaces:**
- Consumes: `loadManifest()`, `fetchClip(url)` (Task 4); `Voice.clipUrl` (Task 1).
- Produces:
  - `pendingClips(manifest, lang) -> Array<{key, bytes}>`: clips del idioma que aún no están en el caché `voces-v1` (consulta `caches.match` por URL).
  - `downloadVoices(lang, onProgress(done,total), signal: AbortSignal) -> Promise<{done, total}>`: baja de a 3, ignora los ya guardados, se detiene con `signal` conservando lo guardado; un error de red en un clip lo salta y lo cuenta como no descargado.
  - Acción `voices-download` y `voices-cancel` en la zona de padres.

- [ ] **Step 1: Textos** — añadir las siete claves en es y en `src/content.js` (p. ej. es: "Voces para usar sin internet", "Descargar voces", "Se descargarán unos {mb} MB. Mejor con wifi.").

- [ ] **Step 2: Interfaz** — en `renderParentsHome`, una tarjeta "Voces" con un botón por idioma presente en los perfiles; antes de descargar muestra el tamaño (`sum(bytes)` de `pendingClips`) y pide confirmar; durante la descarga muestra `done/total` y un botón Cancelar; al terminar, `voicesDone`. Si `caches` no existe, muestra `voicesNoCache` en lugar del botón.

- [ ] **Step 3: Implementar `pendingClips` y `downloadVoices`** como arriba.

- [ ] **Step 4: Construir y probar** — `bash build.sh && node --test tests/*.test.js` → PASS. Manual: (a) descargar es; en DevTools → Application → Cache Storage `voces-v1` aparecen los MP3; (b) cancelar a la mitad y volver a pulsar: solo baja lo que falta; (c) con la red desconectada (DevTools → Offline) reproducir una historia descargada: suena Salomé; una no descargada cae a la voz antigua; (d) en una ventana privada sin `caches` no aparece error.

- [ ] **Step 5: Documentar** — `README.md`: sección "Voces" (qué hay en `audio/`, cómo regenerar con `node tools/generar-voces.js` tras editar un cuento, instalar con `pipx install edge-tts`, que las voces requieren abrir desde GitHub Pages, el riesgo de términos de uso de `edge-tts`); `BACKLOG.md`: marcar la mejora de voz como hecha y anotar las ideas fuera de alcance del diseño.

- [ ] **Step 6: Commit y verificación final**
```bash
node --test tests/*.test.js
git add src README.md BACKLOG.md index.html
git commit -m "Voces: descarga para uso sin internet y documentación"
```
