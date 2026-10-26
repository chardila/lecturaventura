# 📚 LecturAventura

App web (HTML/CSS/JS puro, funciona sin internet) para que niños de 7 a 9 años practiquen lectura, comprensión y ortografía con una aventura de búsqueda del tesoro. Idiomas: **español (es-CO)** e **inglés**.

Basada en [reading-treasure-quest](https://github.com/AllesSuper/reading-treasure-quest) (original en alemán, archivado en `legacy/`). El plan y las ideas pendientes están en `BACKLOG.md`.

## Usar
Abrir `index.html` en el navegador.

## Desarrollo
- `src/content.js`: textos de la interfaz e historias (es/en).
- `src/app.js`: lógica. `src/styles.css`, `src/shell.html`: diseño y estructura.
- Después de editar `src/`: `bash build.sh` regenera `index.html`.
- Un mundo aparece en un idioma solo si sus historias tienen texto en ese idioma. Hoy ambos idiomas tienen los 5 mundos (15 historias).
