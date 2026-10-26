# Práctica en voz alta – Plan de construcción

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir a LecturAventura el modo "Práctica en voz alta": la niña lee una historia en voz alta frase por frase, la app la escucha en el iPad (Safari) y la corrige con suavidad, y los adultos ven su progreso.

**Architecture:** La lógica pura (partir frases, comparar lo leído con lo esperado, métricas, desbloqueo) vive en `src/practice.js`, sin DOM y con pruebas en Node. `src/recognizer.js` envuelve el reconocimiento de voz del navegador. La interfaz se añade a `src/app.js` reutilizando el flujo de sesión existente (`startSession`, `renderTask`, `finishSession`) con un modo `"practice"` sin cronómetro.

**Tech Stack:** HTML/CSS/JS puro (sin frameworks, estilo ES5 con `var` como `app.js`), Web Speech API (`SpeechRecognition`/`webkitSpeechRecognition`), `node --test` (Node 22) para la lógica pura, `bash build.sh` para generar `index.html`.

**Spec:** `docs/superpowers/specs/2026-10-26-practica-en-voz-alta-design.md`

## Global Constraints

- El modo solo existe con `state.lang === "es"`; reconocimiento con `lang = "es-CO"`. En inglés no se muestra la entrada.
- Dispositivo objetivo: iPad con Safari. Debe seguir funcionando la app entera en los demás navegadores; sin soporte de reconocimiento se muestra aviso y solo "Oír la frase".
- Sin cronómetro ni comodines visibles en este modo. Barra de progreso de la historia sí.
- Pausa ofrecida a los **10 minutos** (`600000` ms) de práctica.
- Nunca decir "no" ni "mal", ni mostrar cuál fue el error en el primer intento; colores de aviso suaves (naranja claro, no rojo).
- Ante la duda se **acepta** la palabra (permisivo): nunca penalizar por culpa del reconocedor.
- La voz de la niña no se graba ni se envía a ningún sitio; todo en `localStorage`.
- Sin dependencias nuevas, sin `package.json`. Tests: `node --test tests/`.
- `src/content.js` es ahora **fuente editada a mano** (el generador usado antes no está en el repo).
- Texto de la interfaz (español, claves nuevas de `UI.es`, valores exactos): ver Task 6.
- Tras editar `src/`, siempre `bash build.sh` y commitear `index.html`.

## Review Focus

1. Silencio o micrófono sin sonido (`heard === ""`): mensaje "No te escuché. Inténtalo otra vez." y **no** cuenta como intento fallido (Task 2, Task 7).
2. Niña que repite palabras o tartamudea ("el el gato gato…"): se acepta (Task 2).
3. Sin soporte o sin permiso de micrófono (Brave, Fire, permiso denegado): mensaje claro, la app no se rompe, puede avanzar con un adulto (Task 5, Task 7).
4. Diálogos con rayas, comillas «» y puntuación española (¡ ¿ —) en las frases de las historias reales (Task 1).
5. Homófonos y ortografía distinta que devuelve el reconocedor (casa/caza, vaca/baca, hola/ola): se aceptan por equivalencia fonética (Task 2).
6. Doble toque en 🎤 y salir (✕) con el reconocedor activo: no deja el micrófono abierto ni duplica resultados (Task 7).

---

## File Structure

- Create `src/practice.js` – lógica pura, objeto global `Practice`; exporta con `module.exports` si existe.
- Create `src/recognizer.js` – objeto global `Recognizer` (envoltorio del navegador).
- Create `tests/practice.test.js`, `tests/helpers/load-content.js`.
- Modify `build.sh` (incluir los dos archivos nuevos entre `content.js` y `app.js`), `src/app.js`, `src/content.js` (`UI.es`), `src/styles.css`, `BACKLOG.md`, `README.md`.

---

### Task 1: Frases y palabras normalizadas

**Files:**
- Create: `src/practice.js`, `tests/practice.test.js`, `tests/helpers/load-content.js`
- Modify: `build.sh`

**Interfaces:**
- Produces: `Practice.splitSentences(text: string): string[]`, `Practice.normalizeWords(text: string): string[]`, y `loadContent(): CONTENT` en `tests/helpers/load-content.js` (evalúa `src/content.js` con `new Function(src + "; return CONTENT")()`).

- [ ] **Step 1: Write the failing tests** en `tests/practice.test.js` (`node:test`, `node:assert/strict`, `const Practice = require("../src/practice.js")`):
  - `splitSentences("Mira camina por la playa. Bajo el brazo lleva a Wali, su ballena de peluche. ¡Es una botella!")` → `["Mira camina por la playa.", "Bajo el brazo lleva a Wali, su ballena de peluche.", "¡Es una botella!"]`
  - diálogo: `splitSentences("—Mi barco ha desaparecido —suspira—. Necesito a alguien valiente. —¡Yo no fui! —grita—. Mira hacia arriba.")` → `["—Mi barco ha desaparecido —suspira—.", "Necesito a alguien valiente.", "—¡Yo no fui! —grita—.", "Mira hacia arriba."]` (no se corta tras `!` si sigue `—` + minúscula).
  - comillas: `splitSentences("Al lado dice: «Camina veinte pasos hacia el este». Mira sonríe.")` → `["Al lado dice: «Camina veinte pasos hacia el este».", "Mira sonríe."]`
  - puntos suspensivos no cortan: `splitSentences("Mira cuenta: uno, dos, tres… ¡veinte! Frente a ella hay una cueva.")` → `["Mira cuenta: uno, dos, tres… ¡veinte!", "Frente a ella hay una cueva."]`
  - `splitSentences("   ")` → `[]`; `splitSentences("Hola mundo")` → `["Hola mundo"]`.
  - propiedad con contenido real: para cada sección de cada historia de `loadContent().worlds` con `text.es`, `splitSentences(text.es).join(" ") === text.es.replace(/\s+/g, " ").trim()` y ninguna frase vacía.
  - `normalizeWords("—¡Ven, Mira! —grita Antón.")` → `["ven","mira","grita","anton"]`; `normalizeWords("El año")` → `["el","año"]` (la ñ se conserva).
- [ ] **Step 2: Run** `node --test tests/` → FAIL (`Cannot find module`).
- [ ] **Step 3: Implement** en `src/practice.js` un objeto `var Practice = (function(){ … })()` con las dos funciones; al final `if (typeof module !== "undefined" && module.exports) module.exports = Practice;`. Cortar en `[.!?]+` + cierres opcionales (`»”)`) + espacio, salvo cuando lo siguiente es `—` + letra minúscula. `normalizeWords`: minúsculas, quitar tildes **sin** tocar `ñ`, quitar `¡!¿?.,;:—«»"'()…`, separar por espacios.
- [ ] **Step 4: Wire build**: en `build.sh`, después de `cat src/content.js` añadir `cat src/practice.js` (el `recognizer.js` se añade en Task 5). Run `node --test tests/` → PASS y `bash build.sh` sin error.
- [ ] **Step 5: Commit** `git add src/practice.js tests build.sh index.html && git commit -m "Práctica: partir frases y normalizar palabras"`

### Task 2: Comparar lo leído con lo esperado

**Files:** Modify `src/practice.js`, `tests/practice.test.js`

**Interfaces:**
- Consumes: `normalizeWords` (Task 1).
- Produces:
  - `Practice.phoneticKey(word: string): string`
  - `Practice.alignReading(expected: string, heard: string): { words: {text: string, ok: boolean}[], allOk: boolean, unheard: boolean }` — `words` sigue los tokens de `expected` separados por espacios, con `text` original (incluida puntuación).
  - `Practice.decideNext(attempt: number, result: AlignResult): "accept" | "reread" | "model" | "again"`

- [ ] **Step 1: Write the failing tests**
  - `phoneticKey` iguales: (`vaca`,`baca`), (`casa`,`caza`), (`hola`,`ola`), (`calle`,`caye`), (`queso`,`keso`), (`gente`,`jente`); distintos: (`gato`,`pato`), (`cama`,`casa`).
  - `alignReading("El gato duerme en la cama.", "el gato duerme en la cama")` → `allOk true`, 6 palabras, todas `ok`.
  - palabra omitida: esperado `"La oruga come y come."`, leído `"la oruga come"` → `allOk false`, `words[4]` = `{text:"come.", ok:false}`, `words[3].ok === true` (las palabras de ≤2 letras que faltan se perdonan).
  - adivinar: esperado `"El gato duerme en la cama."`, leído `"el gato duerme en la casa"` → `allOk false` y `words[5].ok === false` (cama≠casa; la tolerancia de 1 letra solo vale para palabras de ≥7 letras).
  - ruido del reconocedor: esperado `"Vio una estrella."`, leído `"vio una estrela"` → `allOk true`.
  - repeticiones y palabras extra: leído `"el el gato gato duerme en la la cama"` para la frase de la cama → `allOk true`.
  - desorden: leído `"cama la en duerme gato el"` → `allOk false`.
  - diálogo/puntuación: esperado `"—¡Ven, Mira! —grita Antón."`, leído `"ven mira grita anton"` → `allOk true`.
  - homófonos: esperado `"La casa es grande."`, leído `"la caza es grande"` → `allOk true`.
  - silencio: leído `""` o `"   "` → `unheard true`, `allOk false`, todas `ok:false`.
  - `decideNext`: `(1, allOk)`→`"accept"`; `(1, no ok)`→`"reread"`; `(2, no ok)`→`"model"`; `(3, ok)`→`"accept"`; cualquier intento con `unheard`→`"again"`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement.** `phoneticKey`: minúsculas, sin tildes (ñ intacta), y reglas: `v→b`, `z→s`, `c` ante e/i→`s`, otra `c`→`k`, `qu→k`, `k→k`, `h` muda (salvo en `ch`), `ll→y`, `gu`+e/i→`g`, `g` ante e/i y `j`→`x`. `alignReading`: alineamiento por programación dinámica (subsecuencia en orden) entre las claves de lo esperado y lo oído; dos palabras coinciden si tienen la misma `phoneticKey`, o distancia de edición ≤1 cuando la palabra esperada tiene ≥7 letras; las palabras oídas sin pareja se ignoran; una palabra esperada sin pareja es `ok:false` salvo que tenga ≤2 letras.
- [ ] **Step 4: Run** → PASS. **Step 5: Commit** `"Práctica: comparación tolerante de lectura"`

### Task 3: Métricas, palabras difíciles y desbloqueo

**Files:** Modify `src/practice.js`, `tests/practice.test.js`

**Interfaces:**
- Produces:
  - `Practice.PAUSE_AFTER_MS` (= `600000`), `Practice.shouldOfferPause(elapsedMs: number): boolean`
  - `Practice.wordsPerMinute(words: number, ms: number): number` (entero; `0` si `ms <= 0`)
  - `Practice.mergeDifficult(store: Object<string,number>, words: string[]): Object<string,number>` (devuelve una copia; clave = palabra en minúsculas sin puntuación, **con** tildes)
  - `Practice.topDifficult(store, n: number): string[]` (mayor conteo primero; a igualdad, palabra más larga primero)
  - `Practice.isFluent(helpedWords: number, totalWords: number): boolean` (`true` si `total > 0` y `helped/total <= 0.2`)
  - `Practice.orderStoriesByWords(stories: Story[], lang: string): string[]` (ids por palabras ascendentes, estable)
  - `Practice.unlockedStoryIds(orderedIds: string[], fluentDone: string[]): string[]` (las 3 primeras + una más por cada id **distinto** de `fluentDone` que esté en `orderedIds`)

- [ ] **Step 1: Write the failing tests**
  - `wordsPerMinute(30, 30000) === 60`; `wordsPerMinute(10, 0) === 0`.
  - `shouldOfferPause(599999) === false`; `shouldOfferPause(600000) === true`.
  - `mergeDifficult({}, ["bahía","bahía","oruga"])` → `{bahía:2, oruga:1}`; no muta el argumento.
  - `topDifficult({bahía:2, oruga:1, mariposa:1}, 2)` → `["bahía","mariposa"]`.
  - `isFluent(2,20)` true; `isFluent(4,20)` true; `isFluent(5,20)` false; `isFluent(0,0)` false.
  - `orderStoriesByWords` con tres historias de 40, 10 y 25 palabras (`sections[].text.es`) → ids ordenados 10, 25, 40.
  - `unlockedStoryIds(["a","b","c","d","e"], [])` → `["a","b","c"]`; con `["a"]` → `["a","b","c","d"]`; con `["a","a","x"]` → 4 ids (duplicados e ids desconocidos no cuentan).
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** las funciones en `practice.js`. **Step 4: Run** → PASS. **Step 5: Commit** `"Práctica: métricas, palabras difíciles y desbloqueo"`

### Task 4: Separar en sílabas

**Files:** Modify `src/practice.js`, `tests/practice.test.js`

**Interfaces:** Produces `Practice.syllabify(word: string): string[]` (minúsculas con tildes; nunca devuelve `[]` para una palabra no vacía).

- [ ] **Step 1: Write the failing test** (tabla): `bahía`→`["ba","hí","a"]`, `mariposa`→`["ma","ri","po","sa"]`, `escondidas`→`["es","con","di","das"]`, `estrella`→`["es","tre","lla"]`, `perezoso`→`["pe","re","zo","so"]`, `cohete`→`["co","he","te"]`, `cueva`→`["cue","va"]`, `brújula`→`["brú","ju","la"]`, `oruga`→`["o","ru","ga"]`, `a`→`["a"]`.
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** con reglas básicas del español: núcleo vocálico (diptongos de vocal débil+fuerte o débil+débil; hiato con vocal débil acentuada o dos fuertes), consonante simple pasa a la sílaba siguiente, grupos inseparables (`pr br tr dr cr gr fr pl bl cl gl fl ch ll rr`), de dos consonantes se reparte una y una. **Step 4: Run** → PASS. **Step 5: Commit** `"Práctica: separar en sílabas"`

### Task 5: Envoltorio del reconocimiento de voz

**Files:** Create `src/recognizer.js`; Modify `build.sh` (añadir `cat src/recognizer.js` tras `practice.js`), `tests/practice.test.js`

**Interfaces:**
- Produces objeto global `Recognizer` (con `module.exports` si existe):
  - `Recognizer.isSupported(): boolean`
  - `Recognizer.mapError(code: string): "not-allowed"|"no-speech"|"aborted"|"other"` — `not-allowed` y `service-not-allowed`→`"not-allowed"`; `no-speech`→`"no-speech"`; `aborted`→`"aborted"`; el resto→`"other"`.
  - `Recognizer.create(opts: {lang: string, onInterim(text), onFinal(text), onError(code), onEnd()}): {start(), stop()}` — `start()` ignorado si ya está activo (doble toque); `stop()` seguro si no está activo.
  - `Recognizer.setFactory(fn | null)`: con `fn`, `create` devuelve `fn(opts)` (gancho de pruebas); con `null` restaura el real.

- [ ] **Step 1: Write the failing test**: `mapError` con los cuatro casos anteriores y `"audio-capture"`→`"other"`; `setFactory` devuelve el objeto falso en `create`; `isSupported()` es `false` en Node (sin `window`).
- [ ] **Step 2: Run** → FAIL. **Step 3: Implement** usando `window.SpeechRecognition || window.webkitSpeechRecognition`, `interimResults = true`, `continuous = false`, `maxAlternatives = 1`; resultado final = texto de los resultados `isFinal` concatenados. **Step 4: Run** → PASS. **Step 5: Commit** `"Práctica: envoltorio del reconocimiento de voz"`

### Task 6: Estado, textos y entrada al modo

**Files:** Modify `src/content.js` (`UI.es`), `src/app.js`, `src/styles.css`

**Interfaces:**
- Consumes: `Practice.*` (Tasks 1–4), `Recognizer.*` (Task 5).
- Produces:
  - `state.practice = { sessions: [], difficult: {}, fluentDone: [], resume: null }` en `DEFAULT_STATE` (`resume`: `{storyId, si, sn}` o `null`); `sessions[]` con `{date, storyId, words, ms, wpm, helped, rereads}` (máx. 60).
  - Botón en el inicio `data-act="practice"` (solo `state.lang === "es"`), que muestra `renderPracticeList()` en `#screen-world`: todas las historias de `worlds()` en el orden de `Practice.orderStoriesByWords`, las bloqueadas (según `Practice.unlockedStoryIds(order, state.practice.fluentDone)`) con 🔒; cada tarjeta lleva `data-practice-story="<id>"`. Añadir `[data-practice-story]` al selector del listener de clics.
  - Claves nuevas de `UI.es` (valores exactos): `practiceTitle` "Práctica en voz alta"; `practiceIntro` "Lee en voz alta, frase por frase. ¡Yo te escucho!"; `practiceRead` "🎤 Leer"; `practiceHear` "🔊 Oír la frase"; `practiceListening` "Te escucho…"; `practicePraise` ["¡Muy bien leído!","¡Qué bien suena!","¡Excelente lectura!"]; `practiceReread` "Casi. Mira otra vez las palabras marcadas y léelas despacio."; `practiceModel` "Escucha y repite:"; `practiceNoHear` "No te escuché. Inténtalo otra vez."; `practiceUnsupported` "Este dispositivo todavía no puede escucharte. Puedes oír cada frase y leerla en voz alta con un adulto."; `practiceDenied` "Necesito permiso para usar el micrófono. Pídele a un adulto que lo active."; `practiceAdultNext` "Ya la leímos →"; `practicePause` "¡Buen trabajo! Llevas 10 minutos."; `practicePauseSave` "Guardar y seguir después"; `practicePauseGo` "Seguir un rato más"; `practiceResume` "Seguir donde iba"; `practiceReviewTitle` "Palabras para repasar"; `practiceReviewIntro` "Léelas despacio, por partes y luego completas."; `practiceReviewDone` "¡Listo! Repasaste tus palabras."; `practiceLocked` "Lee bien una historia para abrir la siguiente"; `parentPractice` "Práctica en voz alta"; `parentWpm` "Palabras por minuto"; `parentHelped` "Palabras con ayuda"; `parentLastSessions` "Últimas prácticas".

- [ ] **Step 1: Write the failing check** (navegador, DevTools `evaluate_script`; la UI no tiene pruebas Node): con `localStorage` `{"lang":"es","stars":0}` tras `bash build.sh` y recarga, `document.querySelector('[data-act="practice"]')` es `null` (aún no existe). Con `lang:"en"` seguirá siendo `null` al terminar.
- [ ] **Step 2: Implement** las claves de `UI.es`, `DEFAULT_STATE.practice`, un `ensurePractice()` (como `ensureStats`, llamado desde `init`), el botón y `renderPracticeList()`; al tocar una tarjeta desbloqueada → `startPractice(id)` (Task 7); bloqueada → `toast(t("practiceLocked"))`. Si `state.practice.resume` existe, mostrar encima una tarjeta `t("practiceResume")` que llama `startPractice(resume.storyId, resume)`. Estilos mínimos en `styles.css` reutilizando `.card`/`.btn`.
- [ ] **Step 3: Verify** tras `bash build.sh` y recarga con `lang:"es"`: el botón existe; al tocarlo hay 15 tarjetas, 3 sin 🔒 y 12 con 🔒; con `lang:"en"` el botón no existe. Revisar consola sin errores.
- [ ] **Step 4: Commit** `"Práctica: estado, textos y lista de historias"`

### Task 7: Pantalla de lectura frase por frase

**Files:** Modify `src/app.js`, `src/styles.css`

**Interfaces:**
- Consumes: Tasks 1–6.
- Produces en `app.js`: `startPractice(storyId: string, resume?: {si, sn})` (crea `session` con `mode:"practice"`, **sin** `startTimer()`), `renderPracticeSentence()`, `onPracticeResult(heardText: string)`. Campos nuevos de `session`: `sents: string[]` (de `Practice.splitSentences(loc(sec.text))`; **sin** usar la versión `easy` en este modo), `sn: number`, `attempt: number`, `helped: string[]`, `rereads: number`, `readMs: number`, `words: number`, `startedAt: number`. Contrato DOM: contenedor `#practice-sentence` con una `span.pw` por palabra (`.ok` o `.doubt` tras evaluar), mensaje en `#practice-msg`, botones `[data-act="practice-listen"]` (🎤), `[data-act="practice-hear"]` (🔊), `[data-act="practice-adult-next"]` (solo sin soporte). Con `Recognizer.setFactory` se puede simular lo oído; para las comprobaciones, ampliar el objeto de pruebas `window.LeseAbenteuer` (final de `app.js`) con `Recognizer: Recognizer`, `Practice: Practice` y `session: function () { return session; }`, `startPractice: startPractice`. En modo `practice`, `renderSection`/`renderTask`/`renderDetector` no muestran el bloque `#timer`; al terminar las frases de una sección, `renderTask()` muestra las preguntas existentes; `nextSection()` en modo `practice` vuelve a `renderPracticeSentence()` con la siguiente sección (y `sn = 0`).

- [ ] **Step 1: Write the failing check** (DevTools, con fábrica falsa `Recognizer.setFactory(function(o){ return {start:function(){ o.onFinal(window.__heard); o.onEnd(); }, stop:function(){}}; })` expuesta vía `window.LeseAbenteuer.Recognizer`): arrancar `startPractice("island-1")`, poner `window.__heard = ""` y pulsar 🎤 → `#practice-msg` dice `"No te escuché. Inténtalo otra vez."`, la frase **no** avanza y `session.attempt` sigue en `0`.
- [ ] **Step 2: Implement** el flujo: muestra la frase actual en letra grande y barra de progreso `(sentencias hechas / total)` sin temporizador; 🔊 llama `speak(frase)`; 🎤 crea el reconocedor con `lang:"es-CO"`, ilumina palabras con resultados parciales si están disponibles y al final llama `onPracticeResult`. `onPracticeResult`: `Practice.alignReading` → `Practice.decideNext(session.attempt + 1, r)`: `"accept"` → frase aleatoria de `practicePraise` y pasar a la siguiente (suma a `session.words` y `readMs`); `"again"` → mensaje `practiceNoHear`, no cuenta intento; `"reread"` → marcar `.doubt`, mensaje `practiceReread`, `session.attempt++`, `session.rereads++`; `"model"` → Task 8. Sin `Recognizer.isSupported()`: mostrar `practiceUnsupported`, ocultar 🎤 y mostrar `practiceAdultNext` que avanza. Error `"not-allowed"` → mensaje `practiceDenied` (y botón de adulto). Doble toque en 🎤 no crea dos reconocedores; `quit` y cambiar de pantalla llaman `stop()`.
- [ ] **Step 3: Verify** en el navegador con la fábrica falsa: (a) `__heard=""` → mensaje de no escuchó, sin avance; (b) `__heard` igual a la frase → mensaje de `practicePraise`, avanza a la siguiente; (c) tras las 3 frases de la primera sección aparece la primera pregunta de comprensión de la historia y **no** existe `#timer`; (d) con `Recognizer.isSupported` falso aparece el aviso y se puede avanzar con `practiceAdultNext`. Consola sin errores.
- [ ] **Step 4: Commit** `"Práctica: lectura frase por frase"`

### Task 8: Corrección C y palabras con ayuda

**Files:** Modify `src/app.js`

**Interfaces:**
- Consumes: `onPracticeResult` (Task 7), `Practice.mergeDifficult`.
- Produces: `renderPracticeModel(words: string[], i: number)`; al terminar el modelado: la palabra se agrega a `session.helped` (palabras de la frase marcadas `ok:false`, limpias y en minúsculas con tildes) y se avanza a la siguiente frase; `session.attempt = 0` al cambiar de frase.

- [ ] **Step 1: Write the failing check** (DevTools, fábrica falsa): frase `"El gato duerme en la cama."`; primer intento `__heard="el gato duerme en la casa"` → `#practice-msg` es `practiceReread`, `.pw.doubt` es solo la palabra `cama.`, y el texto **no** contiene "no" ni "mal"; segundo intento igual → aparece `practiceModel` + la palabra `cama`, y `speechSynthesis.speak` fue invocado con `"cama"` (espía); tras repetir (cualquier resultado o `practiceAdultNext`), avanza y `session.helped` contiene `"cama"`.
- [ ] **Step 2: Implement** `"model"`: por cada palabra dudosa muestra `practiceModel` + la palabra grande, la dice con `speak`, y espera a que la niña la repita con 🎤 (cualquier resultado, o tras un segundo intento fallido, continúa; nunca se queda atascada).
- [ ] **Step 3: Verify** el escenario anterior y que tras la frase siguiente `session.attempt === 0`.
- [ ] **Step 4: Commit** `"Práctica: corrección en dos pasos con modelado"`

### Task 9: Pausa a los 10 minutos y reanudar

**Files:** Modify `src/app.js`

**Interfaces:**
- Consumes: `Practice.shouldOfferPause`. Produces: `renderPracticePause()`; escribe `state.practice.resume = {storyId, si, sn}` al guardar.

- [ ] **Step 1: Write the failing check** (DevTools): con `session.startedAt = Date.now() - 600000` y tras aceptar una frase → aparece la pantalla con `practicePause`, `practicePauseSave` y `practicePauseGo`, solo una vez por sesión.
- [ ] **Step 2: Implement:** tras aceptar una frase (no a mitad de un intento), si `Practice.shouldOfferPause(Date.now() - session.startedAt)` y no se ofreció aún → `renderPracticePause()`. "Guardar" → guarda `resume`, `save()`, vuelve al inicio; "Seguir" → continúa sin volver a preguntar. Al completar una historia, `resume = null`. `startPractice(id, resume)` retoma en `si`/`sn`.
- [ ] **Step 3: Verify:** guardar y reabrir desde la tarjeta "Seguir donde iba" retoma la misma frase; consola limpia.
- [ ] **Step 4: Commit** `"Práctica: pausa a los 10 minutos y reanudar"`

### Task 10: Cierre de sesión, repaso y progreso

**Files:** Modify `src/app.js`

**Interfaces:**
- Consumes: Tasks 3, 4, 8. Produces: `renderPracticeReview(words: string[])`; ampliación de `finishSession` para `mode === "practice"`.

- [ ] **Step 1: Write the failing check** (DevTools): tras terminar una historia en modo práctica con 2 palabras con ayuda (de ≥2 de 20+ palabras), `state.practice.sessions[0]` tiene `{storyId, words, ms, wpm, helped:2, rereads}` con `wpm = Practice.wordsPerMinute(words, ms)`, `state.practice.difficult` contiene esas palabras, y `state.practice.fluentDone` contiene el id (porque `isFluent`).
- [ ] **Step 2: Implement:** `finishSession` (modo práctica) guarda la sesión (máx. 60), mezcla `helped` en `difficult`, agrega a `fluentDone` si `isFluent(helped.length, words)` y no estaba, y pone `resume = null`. Tras la pantalla de resultados, si hay palabras con ayuda, botón "Repasar" → `renderPracticeReview(Practice.topDifficult(state.practice.difficult, 3))`: para cada palabra muestra `Practice.syllabify(w).join(" · ")`, luego la palabra completa y 🎤 (acepta cualquier intento permisivo de `alignReading`; tras un fallo, la dice y sigue); al final `practiceReviewDone`.
- [ ] **Step 3: Verify** el chequeo del Step 1, y que el repaso muestra las sílabas de `bahía` como `ba · hí · a`.
- [ ] **Step 4: Commit** `"Práctica: cierre, repaso y progreso"`

### Task 11: Informe para adultos, documentación y publicación

**Files:** Modify `src/app.js` (`parentSheet`), `BACKLOG.md`, `README.md`

**Interfaces:** Consumes `state.practice`.

- [ ] **Step 1: Write the failing check** (DevTools): con `state.practice.sessions` de dos prácticas, `parentSheet()` contiene `parentPractice`, `parentWpm` y una fila por práctica (hasta 8) con fecha, palabras por minuto y palabras con ayuda.
- [ ] **Step 2: Implement** la sección en `parentSheet` (solo si hay prácticas; si no, `noData`). Actualizar `BACKLOG.md` (marcar hecho el modo "escucha y corrección suave" en su versión iPad; lo que sigue: Fire, audio modelo grabado/neuronal, inglés) y `README.md` (cómo usar el modo en el iPad).
- [ ] **Step 3: Verify completo:** `node --test tests/` PASS; `bash build.sh`; recorrido manual en el navegador con la fábrica falsa de una historia completa (lectura, un modelado, pausa, cierre, repaso, informe); consola sin errores.
- [ ] **Step 4: Commit y publicar:** `git add -A && git commit -m "Práctica en voz alta: informe para adultos y documentación"`; **no** hacer `git push` hasta que Carlos lo confirme.
- [ ] **Step 5: Prueba real (Carlos, iPad):** abrir la página publicada, activar el dictado en Ajustes, aceptar el micrófono, leer una historia con su hija y anotar: ¿marca palabras bien leídas como dudosas? ¿tarda en responder? ¿el modelado suena claro? Esas notas alimentan el ajuste de umbrales de `alignReading`.
