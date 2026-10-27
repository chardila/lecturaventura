// Lógica pura de qué historias se ven y cuáles están abiertas (sin DOM; se prueba en Node).
var Library = (function () {
  "use strict";

  function visibleWorlds(worlds, lang, mode) {
    return worlds.filter(function (w) {
      if (!w.stories.length || !w.stories[0].title || w.stories[0].title[lang] == null) return false;
      if (mode === "short") return !w.long;
      if (mode === "long") return !!w.long;
      return true;
    });
  }

  // En un mundo con `series`, cada historia se abre al terminar la anterior.
  function isStoryOpen(world, index, finished) {
    if (!world.series || index <= 0) return true;
    return !!(finished && finished[world.stories[index - 1].id]);
  }

  return { visibleWorlds: visibleWorlds, isStoryOpen: isStoryOpen };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Library;
