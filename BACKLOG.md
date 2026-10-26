# Backlog – App de lectura para mi hija (8 años, TDAH)

Base: https://github.com/AllesSuper/reading-treasure-quest (LeseAbenteuer; HTML/CSS/JS puro, offline, alemán + inglés).
Idiomas objetivo: español + inglés.

## Contexto (lo que dijo Carlos)
- Hija de 8 años con TDAH. Le gustan los libros, pero lee lento, casi palabra por palabra.
- Busca las imágenes para deducir la historia en vez de leer el texto.
- Por prisa, **adivina palabras**; el padre la frena ("no es lo que leíste") y ella debe volver atrás y leer con foco.
- Las correcciones la **frustran y la desaniman**; cuesta que lea en voz alta.
- Hoy: leen por turnos, un rato él/ella y un rato ella. **La psicóloga recomienda**: el adulto lee una frase y ella lee *la misma*, para imitar la cadencia.
- Uso deseado: primero **acompañada** (padre + hija), luego **sola**.
- Meta: mejorar la **velocidad/fluidez**, sin perder el gusto por leer.

## Análisis del repo base
Sirve: bilingüe con textos separados de la lógica (`src/content.js`), voz de lectura (SpeechSynthesis), modo letra fácil, textos en versión fácil, panel de padres, recompensas (monedas, estrellas, rachas).
No sirve / falta: todo es opción múltiple de **comprensión**; no hay fluidez ni lectura en voz alta; no hay reconocimiento de voz; contenido en alemán; tiene límite de tiempo por ejercicio ("jokers"), que puede presionar a una niña con TDAH; todo en un solo archivo grande.

## Fase 1 – Español + inglés (hecha, 2026-10-26)
- [x] Proyecto creado desde el repo (código original en alemán archivado en `legacy/`)
- [x] Interfaz traducida al español; idiomas es (es-CO) / en
- [x] Voz de lectura en `es-CO` (inglés `en-GB`)
- [x] Mundo "Isla del Tesoro" escrito en español (3 historias, ejercicios propios del idioma)
- [x] Probado en navegador: es y en cargan y se puede jugar
- [x] Los 5 mundos (15 historias) escritos en español, con ejercicios propios del idioma (b/v, ll, c/s, sílabas)
- Pendiente: revisar que exista una voz `es-CO` en el dispositivo de la niña (si no, el navegador usa otra variante del español)

## Backlog (por orden de prioridad provisional)
1. **Modo "escucha y repite"**: la app (o el padre) lee una frase con buen ritmo y la niña lee *la misma frase*.
2. **Escucha y corrección suave**: reconocimiento de voz; decirle con ternura si la leyó bien; evitar el tono de regaño.
3. **Frenar la adivinanza**: ejercicios que premien leer lo que dice el texto (no la palabra supuesta); pista suave al fallar en vez de "no".
4. **Quitar la presión de tiempo** para esta niña (desactivar contador y jokers).
5. **Menos dependencia de imágenes**: historias en las que la imagen no revele el texto.
6. **Modo acompañada → modo sola** (el padre guía al inicio; luego la app guía).
7. **Medir fluidez** (palabras por minuto, progreso) en el panel de padres.
8. **Resaltado palabra por palabra** (tipo karaoke) para seguir el ritmo del modelo.
9. Dividir el código en módulos (hoy es un solo archivo grande).

## Voz / audio (descubierto probando en Brave, Ubuntu)
- Los navegadores en Linux suelen **no exponer voces** del sistema (0 voces, `synthesis-failed`), aunque `speech-dispatcher` y `espeak-ng` estén instalados. El botón "Escuchar" quedaba mudo.
- Hecho: elige voz por idioma y muestra aviso si no hay voz.
- Pendiente: para el modo "escucha y repite" **no depender de la voz del navegador**. Opciones: audios pregrabados por el padre/madre (mejor cadencia, voz conocida) o generados con un TTS neuronal y empaquetados.

## Preguntas abiertas
- Variante del español para la voz.
- Cómo hacer que el reconocimiento de voz funcione bien con niños y offline (a investigar).
