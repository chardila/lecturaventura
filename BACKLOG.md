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
1. ~~**Modo "escucha y repite"**~~ (parcial: botón 🔊 "Oír la frase" con la voz del iPad; falta audio modelo neuronal/grabado)
   - Original: **Modo "escucha y repite"**: la app (o el padre) lee una frase con buen ritmo y la niña lee *la misma frase*.
2. ~~**Escucha y corrección suave**~~ HECHO en versión iPad (modo Práctica en voz alta). Pendiente: Fire (APK con Vosk), inglés, ajustar umbrales tras la prueba real. Original: reconocimiento de voz; decirle con ternura si la leyó bien; evitar el tono de regaño.
3. **Frenar la adivinanza**: ejercicios que premien leer lo que dice el texto (no la palabra supuesta); pista suave al fallar en vez de "no".
4. ~~**Quitar la presión de tiempo** para esta niña~~ HECHO: ajuste «Cronómetro y comodines» por perfil en la zona de padres.
5. **Menos dependencia de imágenes**: historias en las que la imagen no revele el texto.
6. **Modo acompañada → modo sola** (el padre guía al inicio; luego la app guía).
7. **Medir fluidez** (palabras por minuto, progreso) en el panel de padres.
8. **Resaltado palabra por palabra** (tipo karaoke) para seguir el ritmo del modelo.
9. Dividir el código en módulos (hoy es un solo archivo grande).

## Voz / audio (descubierto probando en Brave, Ubuntu)
- Los navegadores en Linux suelen **no exponer voces** del sistema (0 voces, `synthesis-failed`), aunque `speech-dispatcher` y `espeak-ng` estén instalados. El botón "Escuchar" quedaba mudo.
- Hecho: elige voz por idioma y muestra aviso si no hay voz.
- Pendiente: para el modo "escucha y repite" **no depender de la voz del navegador**. Opciones: audios pregrabados por el padre/madre (mejor cadencia, voz conocida) o generados con un TTS neuronal y empaquetados.

## Resultado de la prueba de voz (spike, 2026-10-26)
- **Brave/Ubuntu (snap):** 0 voces del sistema; botón "Escuchar" mudo.
- **Tablet Fire (Silk), dispositivo principal de la niña:** el navegador dice soportar reconocimiento y 1 voz en español, pero al escuchar falla (no encuentra el motor de Google) y la lectura en voz alta no suena. **Por web no sirve** para escuchar ni leer en voz alta.
- **iPad Pro M1 (Safari), respaldo/pruebas del padre:** reconoce voz en español y funciona **sin internet**.
- Caminos para la Fire: (a) app Android (APK) con Vosk offline; (b) que la niña practique en el iPad; (c) Fire solo con audio pregrabado, sin que la app escuche.
- Decisión de audio modelo: primero voz neuronal generada y empaquetada, luego grabaciones del padre.

## Preguntas abiertas
- Variante del español para la voz.
- Cómo hacer que el reconocimiento de voz funcione bien con niños y offline (a investigar).


## Perfiles (hecho 2026-10-26)
- [x] Perfiles por jugador con progreso y ajustes separados, idioma por perfil, zona de padres con candado y reseteo.
- Siguiente: orden/filtro de historias por nivel de cada perfil; respaldo/exportar perfiles.

## Historias largas (hecho 2026-10-27)
- [x] 6 historias originales (Mili y Nubi, Dani Mala Pata) en es/en, con ajuste por perfil (todas/cortas/largas) y serie que se abre en orden.
- Pendiente: probar con los niños (largo real, tono, chistes en inglés) y ajustar; más historias si funcionan; práctica en inglés; audio modelo.
