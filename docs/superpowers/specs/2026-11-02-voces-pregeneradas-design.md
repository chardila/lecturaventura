# Voces pregeneradas — diseño

Fecha: 2026-11-02. Estado: borrador para revisar.

## Problema
`speak()` (`src/app.js`) usa la Web Speech API del dispositivo y suena robótica, sobre todo en Kindle Fire y Linux. El acento colombiano importa.

## Decisiones
- **Voces** (elegidas con muestras): español `es-CO-SalomeNeural`, inglés `en-GB-LibbyNeural`, velocidad `-10%`.
- **Motor:** `edge-tts` (sin cuenta), ejecutado una sola vez en el computador de desarrollo. La app solo reproduce MP3; nada de síntesis en la tablet.
- **Respaldo:** si un audio falta o no carga, se usa la voz actual (`speechSynthesis`). El comportamiento de hoy no se pierde.

## Qué se locuta
Todo texto que hoy pasa por `speak()`:
1. Texto de cada sección (`text` y `easy`, es/en) — `src/content.js` y `src/stories-long.js`.
2. Frases sueltas de la práctica en voz alta (`Practice.splitSentences` sobre el texto de cada sección, solo es).
3. Palabras sueltas (modelado de la práctica y repaso de palabras con ayuda): se derivan de las frases al normalizarlas.

Cálculo aproximado: 57 000 caracteres de secciones (es + en). Con frases y palabras, entre 35 y 50 MB de MP3 en total (por medir).

## Clave del audio
`clave = hash(idioma + "|" + texto normalizado)` con un hash síncrono en JS puro (cyrb53, 53 bits), en un módulo compartido `src/voice.js` que usan igual el generador (Node) y la app (navegador). Así, si se edita un texto, su audio deja de coincidir y se regenera solo ese. Se prueba en `tests/voice.test.js`.

## Archivos
- `audio/es/<clave>.mp3`, `audio/en/<clave>.mp3`
- `audio/manifest.json`: `{ version, clips: { "<clave>": { lang, bytes } } }`. La app lo lee para saber qué existe sin pedir cada archivo.
- `tools/generar-voces.mjs`: recorre el contenido, calcula claves, y llama al CLI `edge-tts` solo para las que faltan. Opción `--dry-run` que cuenta caracteres y MB estimados. El motor queda aislado en una función para cambiarlo por Azure si hiciera falta.
- Los audios se versionan en git y viajan al sitio con el flujo de Pages actual (`path: .`). `index.html` sigue siendo un solo archivo; los audios van aparte.

## Reproducción (`speak()`)
1. Calcular la clave del texto. Si está en el manifiesto, crear `Audio(audio/<lang>/<clave>.mp3)` y reproducir.
2. Cancelar cualquier audio anterior (como hoy con `speechSynthesis.cancel()`); `quit` también detiene el audio.
3. Si no hay manifiesto, no existe la clave o `play()` falla: respaldo a `speechSynthesis`.
4. Un solo elemento `Audio` reutilizado, creado dentro del primer toque del usuario (restricción de autoplay en iPad/Silk).

## Sin internet y descarga
- El service worker o la Cache API guarda cada MP3 al reproducirse (caché automática).
- **Zona de padres → "Descargar voces":** baja todos los audios del idioma del perfil con barra de progreso y los deja en caché para usar sin internet. Muestra el tamaño antes de empezar y permite cancelar.
- Si la app se abre como archivo local (`file://`), no hay caché ni audios: usa el respaldo. Se documenta que las voces requieren abrir desde GitHub Pages.

## Pruebas
- `tests/voice.test.js`: clave estable y sensible al idioma y al texto; normalización.
- Prueba de cobertura: cada texto que `speak()` puede recibir tiene clave en `audio/manifest.json` (falla si se edita un cuento sin regenerar). Es el control que evita audios desfasados.
- Manual: reproducir en iPad, Fire y Linux; modo avión tras "Descargar voces".

## Riesgo abierto: términos de uso
`edge-tts` usa el servicio de lectura en voz alta de Edge, que no es una API pública de Microsoft. No encontré un texto oficial que permita redistribuir ese audio; una respuesta en Microsoft Learn sugiere que el uso comercial sin suscripción de Azure puede infringir los términos, y un desarrollador reporta bloqueos del método desde diciembre de 2025 (sin verificar). Para una app familiar el riesgo es bajo, pero **no se debe vender ni promocionar la app con estos audios**. Salida si cambia: Azure AI Speech con las mismas voces (`es-CO-SalomeNeural`, `en-GB-LibbyNeural`), cuyo plan gratis alcanza de sobra para una generación única; solo cambia la función del motor en el generador.

## Fuera de alcance
Resaltar palabras mientras suena, voces distintas por personaje, ajuste de velocidad en la app.
