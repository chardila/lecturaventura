# Historias largas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir seis historias largas originales (series *Mili y Nubi* y *Dani Mala Pata*, cada una en español e inglés), con un ajuste por perfil que el padre usa para decidir qué historias ve cada niño.

**Architecture:** Las historias viven en un archivo nuevo `src/stories-long.js` que añade dos «mundos» a `CONTENT.worlds` con las marcas `long: true` y `series: true`. La lógica pura de visibilidad y desbloqueo va en `src/library.js` (probable en Node). `src/profiles.js` gana el ajuste `stories` y `src/app.js` lo conecta al mapa, a la lista de historias y a la zona de padres.

**Tech Stack:** HTML/CSS/JS puro, `bash build.sh` → `index.html`, pruebas con `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-27-historias-largas-design.md`

## Global Constraints

- Sin frameworks ni servidor; todo en `localStorage` por perfil; `bash build.sh` y commitear `index.html` tras editar `src/`.
- Pruebas: `node --test tests/*.test.js` (Node 22 no acepta `tests/` solo).
- Textos de interfaz en `UI.es` y `UI.en` de `src/content.js`.
- Las historias son originales; el tono excluye miedo y tristeza fuerte: suspenso suave, finales positivos.
- Serie *Mili y Nubi* (hija, 8 años): unas 300–400 palabras por historia, frases cortas, inglés igual de sencillo.
- Serie *Dani Mala Pata* (hijo, 6 años): unas 800–1.200 palabras por historia, narrador Dani de 8 años, hermanita Lola de 4, amigo Beto, perro Croqueta; lenguaje corto y claro.
- Cada sección termina con una o dos preguntas; solo tipos de opción múltiple ya existentes (no `detector`).
- Perfiles existentes siguen funcionando: el campo nuevo `stories` tiene valor por defecto `"all"`.
- Commit con `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. **No hacer push sin que Carlos lo confirme.**

## Review Focus

- Perfil guardado antes de este cambio (sin campo `stories`): se carga con `"all"` y no pierde progreso.
- Perfil con `stories: "short"` o `"long"`: el mapa, la lista de práctica en voz alta y el informe no muestran lo que no corresponde, y no queda un mundo vacío.
- Historia 2 o 3 de una serie abierta por la fuerza (clic en tarjeta bloqueada o recarga): no se inicia si la anterior no está terminada.
- Perfil en inglés con historias largas: la práctica en voz alta sigue sin aparecer y ninguna cadena sale en español.
- Una historia larga sin `easy`: no aparece el botón «texto más fácil» y no se rompe la sección.

## Rulings del plan (decisiones mías sobre el diseño)

- Las historias de Mili tienen 3 secciones de ~100–140 palabras, no de 150–250 como indica el diseño: con 300–400 palabras en total, secciones de 150–250 dejarían solo 2, y una niña que lee casi palabra por palabra aguanta mejor trozos más cortos.
- Las pruebas de largo, frases cortas y tono del Task 3 se comitean en rojo y se ponen en verde con cada historia; es intencional (TDD por historia).
- La práctica en voz alta no exige el orden de la serie; solo el mapa lo exige (el diseño dice que la práctica funciona en cualquier historia en español).

## File Structure

- Create `src/library.js`: `Library.visibleWorlds`, `Library.isStoryOpen` (lógica pura, exporta con `module.exports`).
- Create `src/stories-long.js`: define `CONTENT.worlds.push(...)` con los mundos `mili` y `dani`.
- Create `tests/library.test.js`, `tests/long-stories.test.js`.
- Modify `src/profiles.js`, `tests/profiles.test.js`, `tests/helpers/load-content.js`, `src/app.js`, `src/content.js` (solo cadenas de interfaz), `build.sh`, `README.md`, `BACKLOG.md`.

---

### Task 1: Ajuste `stories` en el perfil

**Files:**
- Modify: `src/profiles.js` (`SETTING_KEYS`, `CHOICES`, `normalizeProfile`, `addProfile`)
- Test: `tests/profiles.test.js`

**Interfaces:**
- Produces: campo de perfil `stories` ∈ `"all" | "short" | "long"`, por defecto `"all"`; viaja en `Profiles.toState`/`applyState` como cualquier ajuste (`updateProfile(store, id, { stories: "long" })`).

- [ ] **Step 1: Write the failing tests** en `tests/profiles.test.js`:
  - `stories: perfil sin el campo toma "all"` — `parseStore` de un perfil sin `stories` da `profiles[0].stories === "all"`.
  - `stories: valor inválido vuelve a "all"` — `stories: "x"` → `"all"`.
  - `stories: updateProfile acepta short/long/all y rechaza otros` — `ok` para los tres, `{ok:false, error:"value"}` para `"x"`.
  - `stories: viaja en toState y applyState` — `toState(p).stories` y `applyState` lo devuelve al perfil, no a `game`.
  - `stories: addProfile crea el perfil con "all"`.
- [ ] **Step 2: Run** `node --test tests/profiles.test.js` — Expected: FAIL en las pruebas nuevas.
- [ ] **Step 3: Implement** en `src/profiles.js`: añadir `"stories"` a `SETTING_KEYS`; `CHOICES.stories = ["all","short","long"]`; `normalizeProfile` y `addProfile` usan `"all"` por defecto (misma forma que `readScale`). `checkSetting` ya valida por `CHOICES`.
- [ ] **Step 4: Run** `node --test tests/*.test.js` — Expected: todo PASS (37 anteriores + las nuevas).
- [ ] **Step 5: Commit** `git add src/profiles.js tests/profiles.test.js && git commit -m "Perfiles: ajuste de historias visibles (todas/cortas/largas)"`.

---

### Task 2: Lógica de visibilidad y desbloqueo en serie

**Files:**
- Create: `src/library.js`
- Test: `tests/library.test.js`
- Modify: `build.sh` (añadir `cat src/library.js` antes de `src/app.js`)

**Interfaces:**
- Produces:
  - `Library.visibleWorlds(worlds, lang, mode) -> world[]`: conserva los mundos con al menos una historia y con `stories[0].title[lang]` definido; con `mode "short"` quita los que tienen `long: true`; con `"long"` deja solo los `long: true`; con `"all"` o cualquier otro valor no filtra por tipo.
  - `Library.isStoryOpen(world, index, finished) -> boolean`: `true` si `!world.series` o `index === 0` o `finished[world.stories[index - 1].id]` es verdadero.

- [ ] **Step 1: Write the failing tests** en `tests/library.test.js` (mundos de juguete, sin cargar contenido real):
  - `visibleWorlds: all deja cortos y largos`
  - `visibleWorlds: short quita los long`
  - `visibleWorlds: long deja solo los long`
  - `visibleWorlds: sin historia en el idioma no aparece` (mundo cuya primera historia solo tiene `es`, con `lang "en"`)
  - `visibleWorlds: modo desconocido se trata como all`
  - `isStoryOpen: mundo sin series siempre abierto`
  - `isStoryOpen: en serie, la primera abierta y la segunda solo tras terminar la primera`
  - `isStoryOpen: la tercera necesita la segunda, no la primera`
- [ ] **Step 2: Run** `node --test tests/library.test.js` — Expected: FAIL (módulo no existe).
- [ ] **Step 3: Implement** `src/library.js` con la forma de `profiles.js` (IIFE `Library` + `module.exports` condicional) y añadirlo a `build.sh`.
- [ ] **Step 4: Run** `node --test tests/*.test.js` — Expected: todo PASS.
- [ ] **Step 5: Commit** `git add src/library.js tests/library.test.js build.sh && git commit -m "Historias largas: lógica de visibilidad y desbloqueo en serie"`.

---

### Task 3: Esqueleto de contenido y prueba de estructura

**Files:**
- Create: `src/stories-long.js`, `tests/long-stories.test.js`
- Modify: `tests/helpers/load-content.js`, `build.sh`

**Interfaces:**
- Consumes: `CONTENT.worlds` (existente).
- Produces: dos mundos añadidos con `CONTENT.worlds.push`:
  - `{ id: "mili", emoji: "☁️", color: "#7cc4ff", long: true, series: true, unlockStars: 0, name {es:"Mili y Nubi", en:"Millie and Puff"}, desc {es,en}, stories: [] }`
  - `{ id: "dani", emoji: "📓", color: "#ff9f43", long: true, series: true, unlockStars: 0, name {es:"Dani Mala Pata", en:"Danny Bad Luck"}, desc {es,en}, stories: [] }`
  - Cada historia: `{ id, level, wpm, title{es,en}, intro{es,en}, sections:[{ text{es,en}, tasks:[...] }] }`. Ids: `mili-1..3`, `dani-1..3`; `level` 1 para Mili y 2 para Dani; `wpm` 50 (Mili) y 100 (Dani) se usa para estimar el tiempo (ver Task 4). Sin `easy`.
  - `tests/helpers/load-content.js` carga `content.js` + `stories-long.js` juntos y devuelve `CONTENT`.
- Los nombres `Nubi`/`Puff` y `Dani`/`Danny` son decisión mía: en inglés usar *Millie*, *Puff*, *Danny*, *Lola*, *Beto*, *Croqueta* se mantiene como *Crouton* (nombre de perro con chiste adaptado) y *Tomás* → *Tommy*.

- [ ] **Step 1: Write the failing tests** en `tests/long-stories.test.js`, recorriendo los mundos con `long: true` de `load-content`:
  - `mundos largos: existen mili y dani con series y long`.
  - `cada serie tiene 3 historias con ids mili-1..3 / dani-1..3`.
  - `cada historia tiene título, intro y secciones en es y en`.
  - `cada sección tiene text es/en y 1 o 2 tareas`.
  - `cada tarea es de opción múltiple válida`: tipo en `quiz, predict, vocab, retell, missing, syllable, wordimage, sentence, spellfix`; `q` y `options` con `es` y `en`, mismas longitudes (4 a 6), `answer` entero dentro de rango; `vocab` con `word` en ambos idiomas cuya palabra aparece literalmente en el texto de esa sección.
  - `los ids de historia no se repiten en todo el contenido`.
  - `largo de Mili: total 300–450 palabras, cada sección 80–200 palabras, en ambos idiomas`.
  - `largo de Dani: total 800–1250 palabras, cada sección 120–280 palabras, en ambos idiomas`.
  - `frases cortas: Mili ninguna frase de más de 14 palabras; Dani ninguna de más de 20` (dividir por `. ! ? …` ignorando comillas).
  - `lista de comprobación de tono`: ningún texto de historia contiene `muert|sangre|matar|monstruo|fantasma|asesin|cadáver` (es) ni `death|dead|dies|blood|kill|monster|ghost|murder|corpse` (en).
  - `continuidad`: el texto de las historias 2 y 3 de cada serie menciona al protagonista (Mili / Dani) y a su compañero fijo (Nubi / Croqueta).
- [ ] **Step 2: Run** `node --test tests/long-stories.test.js` — Expected: FAIL (no hay contenido).
- [ ] **Step 3: Implement** `src/stories-long.js` solo con los dos mundos y `stories: []`; actualizar `load-content.js` y `build.sh` (el archivo se añade justo después de `content.js`). Las pruebas de largo y de historias seguirán en rojo hasta las tareas 6–11; en esta tarea solo debe pasar `mundos largos: existen mili y dani…`. Dejar las demás en rojo es lo esperado y se anota en el ledger.
- [ ] **Step 4: Run** `node --test tests/*.test.js` — Expected: las pruebas de estructura de mundos PASS; las de historias FAIL (tareas 6–11).
- [ ] **Step 5: Commit** `git add src/stories-long.js tests/long-stories.test.js tests/helpers/load-content.js build.sh && git commit -m "Historias largas: esqueleto de contenido y pruebas de estructura"`.

---

### Task 4: Mapa, lista de historias y práctica filtran por el ajuste

**Files:**
- Modify: `src/app.js` (`worlds()`, `renderHome`, `renderWorld`, `sectionSeconds`, manejador de clic, `baseState`, `newDraft`)

**Interfaces:**
- Consumes: `Library.visibleWorlds`, `Library.isStoryOpen`, `state.stories`.
- Produces: `worlds()` devuelve `Library.visibleWorlds(CONTENT.worlds, state.lang || "es", state.stories)`; tarjetas bloqueadas de historia con `data-locked-story="1"` y toast.

- [ ] **Step 1: Implement**
  - `worlds()` usa `Library.visibleWorlds`; `baseState` y `newDraft` incluyen `stories: "all"`.
  - `renderHome`: dividir el mapa en dos grupos de tarjetas. Primero los mundos no `long` (título actual del mapa); si hay mundos `long` visibles, debajo una sección con encabezado `t("longStories")` y sus tarjetas con el mismo formato.
  - `renderWorld`: para mundos `series`, cada historia usa `Library.isStoryOpen(world, i, state.finished)`; si está cerrada, tarjeta con clase `locked`, candado y `data-locked-story="1"` (sin `data-story`).
  - En el manejador de clic (`closest(...)`) añadir `[data-locked-story]` y mostrar `toast("🔒 " + t("seriesLocked"))`.
  - `startSession` y `startPractice`: si la historia pertenece a un mundo `series` y `!Library.isStoryOpen(...)`, no iniciar (defensa ante recarga o clic forzado) y mostrar el mismo toast. La práctica en voz alta **no** exige orden de serie en su propia lista (decisión del diseño: «funciona en cualquier historia en español»), así que `startPractice` no aplica esta regla; solo `startSession` la aplica.
  - `sectionSeconds(section, level, wpm)`: usa `wpm || WPM[level]`; `estimateStoryMinutes` y `startSession` pasan `story.wpm`.
  - Cadenas nuevas en `UI.es`/`UI.en`: `longStories` («Historias largas» / «Long stories»), `seriesLocked` («Termina la historia anterior para abrir esta» / «Finish the previous story to open this one»).
- [ ] **Step 2: Build y comprobar en el navegador** `bash build.sh` y abrir `file:///home/carlos-ardila/Documents/gitprojects/readinggames/index.html`: con un perfil nuevo (ajuste `all`) aparece la sección «Historias largas» con dos tarjetas (0/0 historias, 0 stories mientras no haya contenido: ver nota) y sin errores de consola. Expected: sin errores en consola.
  - Nota: mientras `stories: []` el filtro de `visibleWorlds` oculta los mundos sin historias, así que esta comprobación visual definitiva se repite en Task 12.
- [ ] **Step 3: Run** `node --test tests/*.test.js` — Expected: sin regresiones (salvo las pruebas de historias aún en rojo).
- [ ] **Step 4: Commit** `git add src/app.js index.html src/content.js && git commit -m "Historias largas: mapa, serie y tiempos conectados al ajuste"`.

---

### Task 5: Ajuste en la zona de padres

**Files:**
- Modify: `src/app.js` (`renderProfileForm`, `saveProfileDraft`, resumen de perfil si lo hay, `parentAction` si procesa `pset`), `src/content.js` (cadenas)

**Interfaces:**
- Consumes: `Profiles.updateProfile` con `stories`.
- Produces: fila «Historias» en el formulario de perfil, con tres opciones: Todas / Solo cortas / Solo largas.

- [ ] **Step 1: Implement**
  - Añadir en `renderProfileForm` una fila con `seg("stories", [{v:"all",l:t("storiesAll")},{v:"short",l:t("storiesShort")},{v:"long",l:t("storiesLong")}], d.stories)`.
  - `saveProfileDraft` incluye `stories: d.stories` en `settings`; cargar `d.stories` al abrir «editar» (mismo camino que `timers`).
  - Cadenas: `storiesLabel` («Historias que ve este jugador» / «Stories this player sees»), `storiesAll`, `storiesShort`, `storiesLong`.
- [ ] **Step 2: Verificar en navegador**: crear un perfil, elegir «Solo largas», guardar, volver a editarlo y comprobar que quedó marcado; entrar como ese jugador y ver solo «Historias largas» (cuando existan las historias, ver Task 12). Expected: sin errores en consola.
- [ ] **Step 3: Run** `node --test tests/*.test.js` — Expected: sin regresiones.
- [ ] **Step 4: Commit** `git add src index.html && git commit -m "Zona de padres: elegir qué historias ve cada jugador"`.

---

### Tasks 6–11: Escribir las historias (una tarea por historia)

Cada tarea escribe **la historia completa en español y en inglés** en `src/stories-long.js` (dentro de `stories` de su mundo), con sus secciones y tareas. El flujo de cada una es el mismo:

- [ ] **Step 1: Run** `node --test tests/long-stories.test.js` — Expected: FAIL en la prueba de largo / existencia de esa historia.
- [ ] **Step 2: Write** la historia siguiendo el resumen del diseño (§2.1) y las reglas de tono (§2.2) y largo (§2.3). Secciones: Mili 3 secciones de ~100–140 palabras; Dani 4–6 de ~150–250 palabras. 1–2 tareas por sección; mezclar tipos (`quiz`, `predict`, `vocab`, `retell` y alguno de ortografía/sílabas cuando encaje con una palabra de esa sección); los `vocab` marcan una palabra que aparece en el texto. El inglés se escribe de forma natural, no traducida palabra por palabra; adaptar los chistes (Croqueta → *Crouton* en inglés, nombre de perro con juego de palabras).
- [ ] **Step 3: Run** `node --test tests/*.test.js` — Expected: todas las pruebas de esa historia PASS (largo, frases cortas, tono, tareas válidas, continuidad).
- [ ] **Step 4: Releer** el texto completo de ambos idiomas contra la lista de tono del diseño (nada asusta, nada de tristeza fuerte, final positivo) y anotar en el ledger «Task N: tono revisado».
- [ ] **Step 5: Commit** `git add src/stories-long.js && git commit -m "Historias largas: <título>"` y `bash build.sh && git add index.html` en el mismo commit.

| Task | Historia | Mundo / id | Resumen (diseño §2.1) |
|---|---|---|---|
| 6 | *Nubi llega a casa* / *Puff Comes Home* | `mili` / `mili-1` | Mili encuentra una nubecita atascada en su ventana; llovizna dentro del cuarto de los nervios; cantándole bajito se calma y hacen un arcoíris en la pared. |
| 7 | *Nubi va al colegio* / *Puff Goes to School* | `mili` / `mili-2` | Nubi se cuela en la mochila; imita un lápiz, un borrador y un globo; la profesora la descubre y la deja ayudar en ciencias. |
| 8 | *El regalo de Tomás* / *Tommy's Present* | `mili` / `mili-3` | Cumpleaños con calor; Nubi hace nevar copos de colores sobre el pastel; Tomás pide un deseo y la fiesta se vuelve nevada de helado. |
| 9 | *El truco de magia* / *The Magic Trick* | `dani` / `dani-1` | Dani en el concurso de talentos; todo sale mal; Croqueta se roba el sombrero; ganan como dúo cómico. |
| 10 | *El hámster del salón* / *The Class Hamster* | `dani` / `dani-2` | Dani cuida al hámster de la clase y desaparece; búsqueda con Lola y Beto; lo encuentran en el lugar más inesperado. |
| 11 | *El campamento en el patio* / *Backyard Camping* | `dani` / `dani-3` | Carpa que se desinfla, lluvia a medias, el ruido es el perro del vecino; cenan dentro de casa con la mejor historia del año. |

---

### Task 12: Documentación y verificación final

**Files:**
- Modify: `README.md`, `BACKLOG.md`

- [ ] **Step 1: Documentar** en `README.md` la sección «Historias largas» (series, ajuste por perfil, cómo añadir una historia en `src/stories-long.js`) y en `BACKLOG.md` marcar hecho lo de historias largas y anotar pendientes (más historias, orden/filtro por nivel, audio modelo).
- [ ] **Step 2: Build y pruebas** `bash build.sh && node --test tests/*.test.js` — Expected: todas PASS (37 anteriores + nuevas), sin pruebas en rojo.
- [ ] **Step 3: Verificar en el navegador** (Chrome DevTools, `file://…/index.html`): crear tres perfiles de prueba (`all`, `short`, `long`), en español e inglés. Comprobar: sección «Historias largas» solo donde corresponde; la historia 2 y 3 aparecen bloqueadas hasta terminar la anterior (sin errores en consola); en inglés no aparece la práctica en voz alta; abrir una historia larga y recorrer una sección con tareas; la práctica en voz alta en español lista las historias largas para el perfil `all` y `long`; tiempo estimado de lectura por historia visible entre ~7 y ~12 minutos. Expected: sin errores en consola.
- [ ] **Step 4: Commit** `git add README.md BACKLOG.md index.html && git commit -m "Historias largas: documentación y verificación"`. **No hacer push** hasta que Carlos lo confirme.
