# Perfiles y zona de padres para LecturAventura – Diseño

Fecha: 2026-10-26 · Base: LecturAventura (HTML/CSS/JS puro, español/inglés, publicada en GitHub Pages) y, como referencia de la idea, el diseño de perfiles de `chardila/mathgames` (`docs/superpowers/specs/2026-10-25-perfiles-y-modo-tablas-design.md`).

## 1. Intención y por qué

Hoy LecturAventura guarda **una sola partida** para todo el dispositivo: estrellas, monedas, historias terminadas, estadísticas, idioma, tamaño de letra, tema y la práctica en voz alta. Carlos tiene dos hijos con necesidades distintas:

- Su **hija** (8 años, TDAH) lee despacio y es para quien se construye el sitio. Practica en español, con la práctica en voz alta.
- Su **hijo** lee muy bien y debería poder usar la app en **inglés**.

Además Carlos quiere compartir el sitio con otros padres, y muchos tendrán varios hijos pequeños. Por eso la solución debe ser **general**, no hecha a la medida de dos niños.

Lo que se construye: **perfiles por jugador**, cada uno con su progreso y sus ajustes, y una **zona de padres** donde el adulto crea y configura perfiles. Es el mismo concepto que ya tiene mathgames; se lleva a LecturAventura.

## 2. Qué se construye

### 2.1 Pantalla «¿Quién juega?»

- Es la primera pantalla **siempre**, incluso si solo hay un perfil. *(decidido por Carlos)*
- Un avatar grande con nombre por cada perfil, y las estrellas del perfil como pista visual.
- Un acceso 🔒 «Zona de padres». Los niños no pueden crear perfiles desde esta pantalla.
- **Con cero perfiles** no hay nada que elegir: la pantalla lo explica y lleva a la zona de padres para crear el primer perfil.
- Al tocar un perfil se entra a su mapa de aventuras, con **su** idioma y **sus** ajustes.
- Desde dentro de la app hay un botón para **«Cambiar jugador»** que vuelve a esta pantalla. Reemplaza al engranaje de ajustes actual.

### 2.2 Qué guarda cada perfil

Todo lo que hoy es partida única pasa a ser **por perfil**:

- **Datos:** nombre, avatar.
- **Ajustes** *(todos los decide solo el padre; el niño no cambia nada solo, decidido por Carlos)*: idioma (español/inglés), tamaño de letra, tipo de letra, tema claro/oscuro, sonido.
- **Progreso:** estrellas, monedas, nivel, racha, insignias, historias terminadas, estadísticas, historial, misión del día, meta semanal y todo el estado de la práctica en voz alta (sesiones, palabras difíciles, historias fluidas, pausa guardada).

Un perfil nunca ve ni modifica el progreso de otro.

### 2.3 Idioma por perfil

- El idioma deja de ser global: lo fija el padre en cada perfil. Cambia la interfaz **y** las historias (como hoy cuando se cambia el idioma).
- La pantalla de elección de idioma del primer arranque desaparece; el idioma se elige al crear el perfil.
- La **práctica en voz alta** solo se muestra en perfiles en español (sigue siendo un modo solo español). *(Esto es consecuencia de la decisión anterior, no una regla nueva.)*

### 2.4 Zona de padres

- Se entra desde «¿Quién juega?» con el 🔒.
- **Candado:** una multiplicación (p. ej. dos cifras × una cifra) que cambia cada vez. Si se falla, se muestra otra; sin bloqueo temporal. *(Mi decisión, siguiendo mathgames. Es una barrera para niños pequeños, no seguridad real.)*
- Dentro se puede: **crear** un perfil, **editar** nombre, avatar y ajustes, **borrar** un perfil, **resetear el progreso** de un perfil (conserva datos y ajustes) y **resetear todo** (borra todos los perfiles y deja la app como recién instalada). Cada borrado/reseteo pide confirmación. *(Resetear/limpiar lo pidió Carlos.)*
- El **informe de adultos** actual se muestra aquí, **de un perfil a la vez** (el que se elija). Deja de abrirse desde la pantalla de los niños.
- El **engranaje de ajustes** y sus opciones desaparecen de las pantallas de los niños.

### 2.5 Primer arranque tras el cambio

- **Se empieza sin perfiles.** La partida guardada anterior no se convierte en perfil. *(decidido por Carlos)*
- La partida anterior (clave `lecturaventura.save.v1`) se **elimina** al arrancar la versión nueva por primera vez, para no dejar datos huérfanos. *(Mi decisión; no se puede deshacer, pero Carlos pidió empezar de cero.)*

## 3. Metas, no metas y anti-metas

**Metas**
- Dos niños (o más) comparten una tablet con progreso y ajustes totalmente separados.
- Un padre que no conoce el proyecto crea sus perfiles en pocos minutos sin ayuda.
- Carlos puede dar a su hijo inglés y a su hija español sin tocar nada más.

**No metas (por ahora)**
- **Historias nuevas y más largas**, sobre todo en inglés: es un proyecto aparte que sigue a este. Aquí solo se deja lista la estructura para que cada perfil use su idioma.
- Filtrar o ordenar historias por nivel de cada perfil.
- Cuentas, servidor, sincronización entre dispositivos, exportar/importar respaldos.
- Comparar perfiles entre sí en el informe.
- Seguridad real de la zona de padres (contraseña, bloqueo temporal).

**Anti-metas** (se considera fallo aunque técnicamente funcione)
- Que un niño entre sin querer a la zona de padres o cambie sus ajustes.
- Perder el progreso de un perfil por un toque equivocado (todo borrado pide confirmación).
- Que el progreso de un hijo aparezca en el perfil de otro.
- Que la app quede inutilizable con cero perfiles o tras un reseteo.
- Que la práctica en voz alta aparezca en un perfil en inglés.

## 4. Restricciones

- Sitio estático (HTML/CSS/JS puro), publicado en GitHub Pages, sin servidor ni cuentas. Todo en `localStorage` del dispositivo; nada sale del dispositivo.
- Se mantiene el estilo del código: sin frameworks, `src/` + `bash build.sh` genera `index.html`; textos en `UI.es` y `UI.en` de `src/content.js`.
- Debe funcionar en el iPad (Safari). Zonas táctiles de los avatares y botones del tamaño de las actuales (≥ 64 px).
- Si `localStorage` no está disponible o falla, la app no debe romperse (como hoy).
- Los datos de cada perfil mantienen compatibilidad hacia delante: campos nuevos con valores por defecto.

## 5. Decisiones tomadas por Carlos

- Se hace **primero los perfiles**; las historias nuevas y más largas van después.
- La pantalla «¿Quién juega?» se muestra siempre.
- **Todos** los ajustes los decide el padre.
- Se empieza **sin perfiles** (no se migra la partida actual) y debe haber forma de **resetear o limpiar** perfiles.
- El idioma es del perfil: el hijo en inglés, la hija en español.
- Pensado también para otros padres con varios hijos.

## 6. Mi criterio (para que Carlos lo revise)

1. Candado de la zona de padres con una multiplicación, como mathgames.
2. Eliminar la partida v1 al primer arranque de la versión nueva.
3. Idioma de las pantallas sin perfil activo («¿Quién juega?», zona de padres, candado): el del último perfil usado; si no hay, el del navegador (inglés si empieza por `en`, si no español).
4. Máximo **8 perfiles** por dispositivo; nombre obligatorio (hasta 20 caracteres); avatares de un conjunto fijo de emojis (unos 12).
5. El informe de adultos muestra un perfil a la vez.
6. No se guarda «último perfil activo» para saltar la pantalla: siempre se vuelve a elegir.

## 7. Qué queda para quien construya

- Estructura exacta de los datos en `localStorage` (clave nueva, versión, lista de perfiles) y cómo el código actual (que usa un único objeto `state`) pasa a leer el perfil activo con el menor cambio posible.
- Qué campos del estado actual son de perfil (todos los de §2.2) y cuáles quedan del dispositivo (p. ej. nada más que la lista de perfiles).
- Diseño visual final de «¿Quién juega?», del candado y del formulario de perfil (hay un boceto aceptado por Carlos: avatares grandes con nombre y estrellas, botón «Nuevo» solo en la zona de padres, formulario con datos, idioma, lectura, juego y progreso).
- Textos exactos en español e inglés.
- Pruebas: la capa de datos (crear, editar, borrar, resetear, aislar perfiles) se puede probar en Node como `practice.js`.

## 8. Riesgos abiertos

- Sin respaldo ni sincronización: borrar los datos del navegador o del sitio borra **todos** los perfiles. Conviene decirlo en el README y en la zona de padres.
- La multiplicación como candado la puede resolver un niño de ~10 años.
- Cualquier perfil o ajuste nuevo en el futuro debe decidir si es del perfil o del dispositivo.
