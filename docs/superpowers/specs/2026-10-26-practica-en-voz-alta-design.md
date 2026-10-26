# Modo "Práctica en voz alta" para LecturAventura – Diseño

Fecha: 2026-10-26 · Base: LecturAventura (HTML/CSS/JS puro, ya en español/inglés, publicada en GitHub Pages).

## 1. Intención y por qué

La hija de Carlos tiene 8 años y TDAH. Le gustan los libros y lee, pero lee **lento, casi palabra por palabra**, y cuando se apura **adivina palabras** (ve una imagen o las primeras letras y completa). Hoy un adulto la frena ("no es lo que leíste") para que vuelva atrás y lea con foco; eso la **frustra y la desanima** a leer en voz alta. Lo que sí la motiva es **leer historias**.

La psicóloga recomendó leer en turnos, adulto primero y ella la misma frase después, para que imite la cadencia. Carlos quiere que la niña pueda **practicar sola, muchas veces**, con una app que la escuche y la corrija **con suavidad**, mientras él la acompaña solo al inicio (para explicarle la app y recoger qué mejorar).

El objetivo de fondo es **fluidez y velocidad de lectura** sin matar las ganas de leer.

## 2. Qué se construye

Un modo nuevo dentro de la app, **"Práctica en voz alta"**, donde la niña lee una historia en voz alta, **frase por frase**, y la app la escucha y le da retroalimentación suave.

La app ya tiene 15 historias (5 mundos, en español e inglés), con versión fácil de cada sección y preguntas de comprensión. Se **reutilizan**; el modo nuevo es una forma distinta de recorrerlas.

### 2.1 Flujo de una sesión (≈10 minutos)

1. La niña elige una historia (las bloqueadas se desbloquean con progreso; ver 2.5).
2. La app muestra **una frase a la vez**, en letra grande. Puede pulsar 🔊 para **oírla antes** de leerla.
3. Pulsa 🎤 y lee en voz alta. Las palabras se **iluminan mientras las dice**.
4. Resultado de la frase:
   - **Bien leída:** mensaje breve y positivo; pasa a la siguiente.
   - **Una o más palabras no coinciden (corrección tipo "C", decidida por Carlos):**
     - *Primer intento:* se marcan las palabras dudosas y se le invita a releer ("Casi. Mira otra vez esta palabra y léela despacio"). **No se dice cuál fue el error ni "no".**
     - *Si vuelve a fallar:* la app **dice la palabra** (voz) y la niña la **repite**; luego sigue.
5. Al terminar cada sección (≈3 frases) se mantienen las **preguntas de comprensión** que ya existen, como cierre.
6. **Sin cronómetro visible ni comodines de tiempo** en este modo. Sí hay una **barra de progreso** de la historia.
7. A los ~10 minutos, si va a mitad de una historia, la app le **ofrece pausar y guardar dónde iba** (sin que parezca un fallo).
8. Al terminar: estrellas/celebración (ya existentes) y **2 o 3 palabras difíciles de hoy** para repasar (ver 2.3).

### 2.2 Escucha y comparación

- Reconocimiento de voz del navegador (Web Speech API) en español **es-CO**, **solo en el iPad/Safari**, que en las pruebas reconoció español y funcionó **sin internet**.
- Se compara lo reconocido con la frase esperada **palabra por palabra**, ignorando mayúsculas, tildes y signos.
- **Anti-objetivo clave:** el reconocimiento con voz de niña de 8 años se equivocará. Ante la duda se **acepta** la palabra. Nunca se debe marcar mal a la niña por un error del reconocedor. Los umbrales deben ser **permisivos** y ajustables.

### 2.3 Palabras difíciles

- La app anota, por sesión, las palabras que necesitaron relectura o ayuda, especialmente **palabras largas y de sílabas complejas** (donde Carlos dice que se confunde).
- Al final propone un **repaso corto** con esas palabras (por ejemplo separadas en sílabas y luego completas) y las guarda para volver a aparecer.

### 2.4 Medir si funciona

Carlos evaluará la lectura también **fuera de la app, con textos cada vez más largos**. Dentro de la app se registra, por sesión: palabras leídas, tiempo de lectura en voz alta, **palabras por minuto**, palabras que necesitaron ayuda y número de relecturas. El **Informe de adultos** muestra la evolución en el tiempo.

### 2.5 Recompensa y progresión

Premios que Carlos pidió: **desbloquear más historias**, y de forma gradual **más largas**, a medida que ella lee con más fluidez (más estrellas ya existentes + criterios de fluidez). El detalle de la regla de desbloqueo es del constructor (ver sección 6).

## 3. Metas, no metas y anti-metas

**Metas**
- Que la niña practique sola, con gusto, ~10 minutos por sesión, muchas veces.
- Que vuelva atrás y lea lo que dice el texto en vez de adivinar.
- Medir progreso de fluidez de forma visible para los adultos.

**No metas (por ahora)**
- No funciona en la tablet **Fire** (Silk no tiene motor de reconocimiento; las pruebas lo confirmaron). Ver sección 5.
- Sin cuentas ni servidor; nada de grabar ni enviar la voz de la niña a ningún lado.
- No se crea contenido nuevo de historias en esta fase.
- El modo no se ofrece en inglés (reconocimiento y práctica solo en español).
- No sustituye el acompañamiento de la psicóloga ni de los padres.

**Anti-metas (se considera fallo aunque técnicamente funcione)**
- Que algo suene a regaño o a "no" (tono, texto, colores de error agresivos).
- Presión de tiempo visible (cronómetros, comodines) en este modo.
- Marcar mal una palabra bien leída por culpa del reconocedor.
- Que se atasque sin salida en una palabra.
- Que la niña termine adivinando por una imagen (el modo no debe apoyarse en ilustraciones que revelen el texto).

## 4. Restricciones

- Sitio estático (HTML/CSS/JS puro), publicado en GitHub Pages: https://chardila.github.io/lecturaventura/ . Sin servidor.
- Dispositivo objetivo de la niña en esta fase: **iPad (Safari)**. El iPad Pro M1 de Carlos es el equipo real de pruebas.
- Se mantiene el estilo del código existente (JS sin frameworks, `src/` + `bash build.sh` genera `index.html`).
- La voz modelo ("oír la frase" y "decir la palabra") usa **voces del sistema del iPad** en esta fase.
- Idioma del modo nuevo: **solo español (es-CO)** por ahora (decidido por Carlos). La app sigue funcionando en español e inglés; el modo "Práctica en voz alta" no aparece en inglés hasta una fase futura.

## 5. Decisiones ya tomadas (por Carlos)

- La unidad de práctica son **historias**, no frases sueltas (la motivan).
- Corrección **C**: primero invitar a releer; si falla otra vez, decir la palabra y que la repita.
- Sesiones de ~**10 minutos** (su límite de atención).
- Practicará en el **iPad** por ahora. La Fire queda para más adelante.
- Audio modelo a futuro: primero voz neuronal generada y empaquetada; luego grabaciones de Carlos.
- Premios: desbloquear más historias, más largas.
- Solo en español por ahora.
- La evaluación de éxito incluye medirla fuera de la app con textos más largos.

## 6. Qué queda para quien construya

- Cómo dividir cada sección en frases (reglas de puntuación, frases muy largas).
- Algoritmo de alineación entre lo reconocido y lo esperado: tolerancia a palabras omitidas/repetidas, números, nombres propios; umbrales (permisivos) y cómo ajustarlos.
- Si Safari entrega resultados parciales confiables en tiempo real para **iluminar palabras mientras lee**; si no, iluminar al final de la frase.
- Reconocimiento continuo vs. frase por frase; manejo del permiso del micrófono y errores (sin permiso, sin soporte, silencio).
- Qué hacer si el navegador **no soporta** reconocimiento: mostrar un aviso claro y ofrecer solo el modo "oír la frase".
- Regla concreta de desbloqueo de historias más largas; cómo ordenar las 15 historias por longitud/dificultad.
- Cómo guardar el progreso de una sesión pausada y las palabras difíciles (localStorage, como el resto).
- Textos exactos de retroalimentación positiva, en español, y cuidar que nunca sean negativos.
- Diseño visual final de la pantalla de práctica (hay un boceto aceptado en la conversación: frase grande, 🎤, palabras iluminadas, mensaje positivo, "Siguiente").

## 7. Mi criterio (decisiones que tomé yo, para que Carlos las revise)

1. Usar las historias existentes y partirlas por frases, en vez de crear contenido nuevo.
2. Mantener las preguntas de comprensión al cierre de cada sección.
3. Usar la voz del iPad como modelo en esta fase (en vez de esperar el audio generado o grabado).
4. Aceptar palabras ante la duda (prioriza no desanimar sobre ser exigente).
5. Registrar palabras por minuto y relecturas como indicadores de progreso.
6. Dejar la Fire fuera de esta fase.

## 8. Riesgos abiertos

- La precisión del reconocimiento con voces infantiles en es-CO es desconocida; hay que probarla con la niña real.
- La calidad de la voz del iPad como modelo de "cadencia" puede ser baja frente a una voz humana.
- Fire sin solución todavía (candidatos: app Android con Vosk, o usar iPad).
