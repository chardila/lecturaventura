# 📚 LecturAventura

App web (HTML/CSS/JS puro, funciona sin internet) para que niños de 7 a 9 años practiquen lectura, comprensión y ortografía con una aventura de búsqueda del tesoro. Idiomas: **español (es-CO)** e **inglés**.

Basada en [reading-treasure-quest](https://github.com/AllesSuper/reading-treasure-quest) (original en alemán, archivado en `legacy/`). El plan y las ideas pendientes están en `BACKLOG.md`.

## Usar
Abrir `index.html` en el navegador.

## Perfiles y zona de padres
Al abrir la app aparece **¿Quién juega?**, con un perfil por niño. Cada perfil guarda su propio progreso y sus ajustes (idioma, tamaño y tipo de letra, tema, sonido y **cronómetro y comodines**; sin ellos el niño no ve ninguna presión de tiempo); el niño no cambia ajustes por su cuenta.
- Los perfiles se crean en la **🔒 Zona de padres** (se entra resolviendo una multiplicación; es una barrera para niños pequeños, no seguridad real). Allí también se editan, se ve el informe de cada niño, se **borra el progreso** de un perfil (conserva sus ajustes), se **elimina** un perfil y se **borra todo**. Cada borrado pide confirmación.
- El idioma es del perfil: un niño puede jugar en inglés y otro en español. La práctica en voz alta solo aparece en perfiles en español.
- Máximo 8 perfiles. Los datos viven **solo en el dispositivo**: si se borran los datos del navegador, se pierden todos los perfiles.

## Historias largas
Seis historias originales de ~10 minutos, en español e inglés, en dos series que se abren de una en una: **Mili y Nubi** (cuentos cortos de magia y amistad, para quien lee despacio) y **Dani Mala Pata** (humor en primera persona, más largas). Aparecen en la sección **Historias largas** del mapa. En la zona de padres, cada perfil tiene el ajuste **Historias que ve este jugador**: todas, solo las cortas o solo las largas.
- Están en `src/stories-long.js`; para añadir una, se agrega otra historia al mundo (`mili.stories.push(...)` o `dani.stories.push(...)`) y `tests/long-stories.test.js` comprueba largo, frases cortas, tono y preguntas.
- Diseño: `docs/superpowers/specs/2026-10-27-historias-largas-design.md`; plan: `docs/superpowers/plans/2026-10-27-historias-largas.md`.

## Práctica en voz alta (solo español, iPad/Safari)
Botón **🗣️ Práctica en voz alta** en el mapa. La niña lee una historia frase por frase; la app la escucha y la corrige con suavidad (primero invita a releer; si falla otra vez, dice la palabra y ella la repite). Sin cronómetro; a los 10 minutos ofrece pausar y guardar.
- En el iPad: Ajustes → Teclado → activar **Dictado**, y aceptar el permiso del micrófono la primera vez. Funciona sin internet.
- Si el navegador no puede escuchar (p. ej. Fire/Silk, Brave en Linux), la app avisa y permite oír cada frase y leerla con un adulto.
- El informe de adultos (⚙️ → Informe) muestra palabras por minuto y palabras con ayuda de las últimas prácticas.
- Diseño: `docs/superpowers/specs/`; plan: `docs/superpowers/plans/`.

## Desarrollo
- Pruebas de la lógica pura: `node --test tests/*.test.js` (`src/practice.js`, `src/recognizer.js`, `src/profiles.js`, `src/library.js` y el contenido de las historias largas).
- `src/content.js`: textos de la interfaz e historias (es/en).
- `src/app.js`: lógica. `src/styles.css`, `src/shell.html`: diseño y estructura.
- Después de editar `src/`: `bash build.sh` regenera `index.html`.
- Un mundo aparece en un idioma solo si sus historias tienen texto en ese idioma. Hoy ambos idiomas tienen los 5 mundos (15 historias) más las 6 historias largas.
