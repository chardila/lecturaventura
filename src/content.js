/* ============================================================
   LecturAventura – Contenido e internacionalización
   ------------------------------------------------------------
   Todo el contenido vive aquí, separado de la lógica (app.js).

   UI[lang]  = textos de la interfaz.
   CONTENT   = mundos -> historias -> secciones -> ejercicios.
   Multilingüe: { es:..., en:... }. Un mundo solo aparece en un
   idioma si sus historias tienen texto en ese idioma
   (hoy ambos idiomas tienen los 5 mundos).

   Versión fácil: cada sección puede tener "easy" (más corta);
   la app la muestra si hay dificultades.

   TIPOS DE EJERCICIO (opción múltiple de 4-6 opciones):
     quiz, predict, vocab, missing, syllable, wordimage,
     sentence, spellfix, retell, detector.
   Ejercicio: { type, q, options[], answer, hint?, fact?, word? }
   (answer: -1 en "predict" = cualquier respuesta vale)

   El contenido original en alemán está archivado en
   legacy/content.de.js (fuera de la app).
   ============================================================ */

const SUPPORTED_LANGS = [
  { code: "es", flag: "\uD83C\uDDE8\uD83C\uDDF4", name: "Español" },
  { code: "en", flag: "\uD83C\uDDEC\uD83C\uDDE7", name: "English" },
];

const UI = {
  es: {
    appName: "LecturAventura",
    tagline: "¡Lee, entiende y gana!",
    chooseLang: "¿Qué idioma prefieres?",
    start: "¡Vamos!",
    hello: "Hola",
    level: "Nivel",
    map: "Mapa de aventuras",
    chooseWorld: "Elige tu mundo",
    locked: "Aún bloqueado",
    unlockAt: "Se abre con {n} ⭐",
    stories: "Historias",
    whoPlays: "¿Quién juega?",
    parentZone: "Zona de padres",
    noProfiles: "Todavía no hay jugadores. Un adulto debe crear el primero en la zona de padres.",
    switchPlayer: "Cambiar jugador",
    storageNote: "Los datos se guardan solo en este dispositivo. Si se borran los datos del navegador, se pierden.",
    lockTitle: "Solo para adultos",
    lockAsk: "Resuelve para entrar:",
    lockEnter: "Entrar",
    lockWrong: "Esa no es. Prueba con esta:",
    newProfile: "Nuevo jugador",
    editProfile: "Editar",
    exitParents: "Salir",
    fieldName: "Nombre",
    fieldAvatar: "Avatar",
    profileSave: "Guardar",
    profileCancel: "Cancelar",
    nameRequired: "Escribe un nombre (hasta 20 letras)",
    limitReached: "Ya hay 8 jugadores",
    timersLabel: "Cronómetro y comodines",
    viewReport: "Informe",
    resetProgress: "Borrar progreso",
    deleteProfile: "Eliminar jugador",
    resetAll: "Borrar todo",
    confirmDelete: "¿Eliminar a {name} y todo su progreso?",
    confirmResetProgress: "¿Borrar el progreso de {name}? Se conservan sus ajustes.",
    confirmResetAll: "¿Borrar todos los jugadores y todo el progreso? No se puede deshacer.",
    practiceTitle: "Práctica en voz alta",
    practiceIntro: "Lee en voz alta, frase por frase. ¡Yo te escucho!",
    practiceRead: "🎤 Leer",
    practiceHear: "🔊 Oír la frase",
    practiceListening: "Te escucho…",
    practicePraise: ["¡Muy bien leído!", "¡Qué bien suena!", "¡Excelente lectura!"],
    practiceReread: "Casi. Mira otra vez las palabras marcadas y léelas despacio.",
    practiceModel: "Escucha y repite:",
    practiceNoHear: "No te escuché. Inténtalo otra vez.",
    practiceUnsupported: "Este dispositivo todavía no puede escucharte. Puedes oír cada frase y leerla en voz alta con un adulto.",
    practiceDenied: "Necesito permiso para usar el micrófono. Pídele a un adulto que lo active.",
    practiceAdultNext: "Ya la leímos →",
    practicePause: "¡Buen trabajo! Llevas 10 minutos.",
    practicePauseSave: "Guardar y seguir después",
    practicePauseGo: "Seguir un rato más",
    practiceResume: "Seguir donde iba",
    practiceReviewTitle: "Palabras para repasar",
    practiceReviewIntro: "Léelas despacio, por partes y luego completas.",
    practiceReviewDone: "¡Listo! Repasaste tus palabras.",
    practiceReviewBtn: "Repasar palabras",
    practiceLocked: "Lee bien una historia para abrir la siguiente",
    parentPractice: "Práctica en voz alta",
    parentWpm: "Palabras por minuto",
    parentHelped: "Palabras con ayuda",
    parentLastSessions: "Últimas prácticas",
    chooseStory: "Elige una historia",
    minutes: "min",
    readTime: "Tiempo de lectura",
    pickMode: "¿Cómo quieres jugar?",
    helper: "Modo ayudante",
    helperDesc: "Más tiempo, más ayudas y lectura en voz alta permitida.",
    challenge: "Modo reto",
    challengeDesc: "¡Menos tiempo y más estrellas de bonificación!",
    begin: "Empezar historia",
    next: "Siguiente",
    check: "Comprobar",
    timeJoker: "Comodín de tiempo",
    jokerLeft: "{n} disponibles",
    jokerUsed: "¡+30 segundos! ⏱️",
    noJoker: "Ya no quedan comodines de tiempo. ¡Tú puedes!",
    readAloud: "Escuchar",
    easierText: "Texto más fácil",
    normalText: "Texto normal",
    easyOn: "🪶 Versión más fácil",
    timeUp: "¡Casi se acaba el tiempo! Termina de leer y sigue.",
    correct: [
      "¡Muy bien hecho! 🌟",
      "¡Exacto! 🚀",
      "¡Qué bien leído! 🎉",
      "¡Genial! ⭐"
    ],
    wrong: "¡Casi! Mira otra vez con calma.",
    showAnswer: "La respuesta correcta está marcada.",
    sessionDone: "¡Aventura completada!",
    earned: "Esto te lo ganaste",
    coins: "Monedas",
    stars: "Estrellas",
    streak: "Días seguidos",
    backMap: "Volver al mapa",
    againSoon: "¡Vuelve mañana para mantener tu racha!",
    settings: "Ajustes",
    theme: "Pantalla",
    light: "Claro",
    dark: "Oscuro",
    textSize: "Tamaño de letra",
    small: "Pequeña",
    normal: "Normal",
    large: "Grande",
    readFont: "Letra para leer",
    standard: "Estándar",
    easyRead: "Fácil de leer",
    sound: "Sonido",
    on: "Sí",
    off: "No",
    language: "Idioma",
    parent: "Zona de adultos",
    parentInfo: "Progreso y ajustes para quienes acompañan.",
    totalStars: "Estrellas en total",
    totalCoins: "Monedas en total",
    sessions: "Aventuras jugadas",
    accuracy: "Respuestas correctas",
    wordsRead: "Palabras leídas",
    resetProfile: "Borrar progreso",
    resetConfirm: "¿Seguro que quieres borrar todo el progreso?",
    collection: "Libro del tesoro",
    collectionEmpty: "¡Reúne insignias de aventura terminando historias!",
    missions: "Misión del día",
    weekGoal: "Meta de la semana",
    discover: "Descubre",
    discoverDesc: "Datos reales para exploradores curiosos",
    didYouKnow: "¿Sabías que…?",
    vocabTitle: "Tarjetas de palabras",
    gotIt: "¡Entendido!",
    close: "Cerrar",
    surprise: "¡Sorpresa!",
    bonusStar: "¡Encontraste una estrella extra! ⭐",
    newLevel: "¡Subiste de nivel!",
    worldUnlocked: "¡Se abrió un mundo nuevo!",
    predictIntro: "¿Qué crees que pasará después?",
    yourGuess: "Tu idea siempre vale. ¡Sigue leyendo para descubrirlo!",
    missionRead: "Termina de leer una parte",
    missionCorrect: "Responde 3 preguntas bien",
    missionFinish: "Termina una historia",
    progress: "Tu progreso",
    continue: "Seguir leyendo",
    detectorSweep: "¡Busca con el detector de metales! Toca los lugares.",
    sigCold: "🔇 Muy bajito… aquí no hay nada.",
    sigWarm: "🔉 Suena un poco más. ¡Tibio!",
    sigHot: "🔊 Suena más fuerte. ¡Caliente!",
    sigFound: "🔔 ¡PIII PIII! ¡Lo encontraste! 🎉",
    report: "Informe de aprendizaje",
    bySkill: "Fortalezas por área",
    comprehension: "Comprensión",
    spelling: "Ortografía",
    vocabulary: "Vocabulario",
    worldProgress: "Progreso por mundo",
    recent: "Últimas aventuras",
    readingTime: "Tiempo total de lectura",
    focusTip: "Recomendación",
    minShort: "min",
    noData: "Todavía no hay datos. ¡Jueguen primero una aventura!",
    focusReading: "Practiquen más las preguntas de comprensión. Contar la historia juntos ayuda.",
    focusSpelling: "Practiquen ortografía. Aplaudir las sílabas de cada palabra ayuda.",
    focusVocab: "Hablen de las palabras nuevas y usen las tarjetas de palabras.",
    focusGreat: "¡Muy buen rendimiento, equilibrado! Sigan así.",
    noVoice: "Este navegador no tiene voz para leer en voz alta. Prueba con otro navegador o instala una voz.",
    abc: "A B C"
  },
  en: {
    appName: "ReadingQuest",
    tagline: "Read, understand, win!",
    chooseLang: "Which language would you like?",
    start: "Let's go!",
    hello: "Hi",
    level: "Level",
    map: "Adventure map",
    chooseWorld: "Choose your world",
    locked: "Still locked",
    unlockAt: "Unlocks at {n} ⭐",
    stories: "Stories",
    whoPlays: "Who is playing?",
    parentZone: "Parents' area",
    noProfiles: "There are no players yet. A grown-up needs to create the first one in the parents' area.",
    switchPlayer: "Switch player",
    storageNote: "Data is stored only on this device. Clearing the browser data erases it.",
    lockTitle: "Grown-ups only",
    lockAsk: "Solve to enter:",
    lockEnter: "Enter",
    lockWrong: "Not quite. Try this one:",
    newProfile: "New player",
    editProfile: "Edit",
    exitParents: "Exit",
    fieldName: "Name",
    fieldAvatar: "Avatar",
    profileSave: "Save",
    profileCancel: "Cancel",
    nameRequired: "Enter a name (up to 20 letters)",
    limitReached: "There are already 8 players",
    timersLabel: "Timer and jokers",
    viewReport: "Report",
    resetProgress: "Reset progress",
    deleteProfile: "Delete player",
    resetAll: "Erase everything",
    confirmDelete: "Delete {name} and all their progress?",
    confirmResetProgress: "Reset {name}'s progress? Their settings stay.",
    confirmResetAll: "Erase all players and all progress? This cannot be undone.",
    chooseStory: "Choose a story",
    minutes: "min",
    readTime: "Reading time",
    pickMode: "How would you like to play?",
    helper: "Helper mode",
    helperDesc: "More time, more hints, read-aloud allowed.",
    challenge: "Challenge mode",
    challengeDesc: "Less time, more bonus stars!",
    begin: "Start story",
    next: "Next",
    check: "Check",
    timeJoker: "Time joker",
    jokerLeft: "{n} left",
    jokerUsed: "+30 seconds! ⏱️",
    noJoker: "No time jokers left – you can do it!",
    readAloud: "Read aloud",
    easierText: "Easier text",
    normalText: "Normal text",
    easyOn: "🪶 Easier version",
    timeUp: "Almost out of time! Finish reading and tap on.",
    correct: [
      "Great job! 🌟",
      "Exactly right! 🚀",
      "Nicely read! 🎉",
      "Strong! ⭐"
    ],
    wrong: "Almost! Take another close look.",
    showAnswer: "The correct answer is highlighted.",
    sessionDone: "Adventure complete!",
    earned: "You earned this",
    coins: "Coins",
    stars: "Stars",
    streak: "Day streak",
    backMap: "Back to map",
    againSoon: "Come back tomorrow for your streak!",
    settings: "Settings",
    theme: "Display",
    light: "Light",
    dark: "Dark",
    textSize: "Text size",
    small: "Small",
    normal: "Normal",
    large: "Large",
    readFont: "Reading font",
    standard: "Standard",
    easyRead: "Easy-read",
    sound: "Sound",
    on: "On",
    off: "Off",
    language: "Language",
    parent: "Parent area",
    parentInfo: "Progress & settings for grown-ups.",
    totalStars: "Total stars",
    totalCoins: "Total coins",
    sessions: "Adventures played",
    accuracy: "Correct answers",
    wordsRead: "Words read",
    resetProfile: "Reset progress",
    resetConfirm: "Really delete all progress?",
    collection: "Treasure book",
    collectionEmpty: "Collect adventure badges by finishing stories!",
    missions: "Daily mission",
    weekGoal: "Weekly goal",
    discover: "Discover",
    discoverDesc: "Real knowledge for clever explorers",
    didYouKnow: "Did you know?",
    vocabTitle: "Vocabulary cards",
    gotIt: "Got it!",
    close: "Close",
    surprise: "Surprise!",
    bonusStar: "Found a bonus star! ⭐",
    newLevel: "New level reached!",
    worldUnlocked: "New world unlocked!",
    predictIntro: "What do you think happens next?",
    yourGuess: "Your guess always counts – read on to find out!",
    missionRead: "Finish reading one section",
    missionCorrect: "Answer 3 questions correctly",
    missionFinish: "Finish one story",
    progress: "Your progress",
    continue: "Keep reading",
    detectorSweep: "Search with the metal detector! Tap the spots.",
    sigCold: "🔇 Very quiet … nothing here.",
    sigWarm: "🔉 Beeping softly – warmer!",
    sigHot: "🔊 Beeping louder – hot!",
    sigFound: "🔔 BEEP BEEP! Found it! 🎉",
    report: "Learning report",
    bySkill: "Strengths by area",
    comprehension: "Comprehension",
    spelling: "Spelling",
    vocabulary: "Vocabulary",
    worldProgress: "World progress",
    recent: "Recent adventures",
    readingTime: "Total reading time",
    focusTip: "Recommendation",
    minShort: "min",
    noData: "No data yet – play an adventure first!",
    focusReading: "Practise more comprehension – retelling together helps.",
    focusSpelling: "Practise spelling – clapping words into syllables helps.",
    focusVocab: "Talk about new words – use the vocabulary cards.",
    focusGreat: "Great, balanced performance – keep it up!",
    abc: "A B C",
    noVoice: "This browser has no voice for reading aloud. Try another browser or install a voice."
  }
};

const BADGES = {
  island: {
    emoji: "🏴‍☠️",
    es: "Mapa del tesoro",
    en: "Treasure map"
  },
  jungle: {
    emoji: "🐒",
    es: "Medalla de la selva",
    en: "Jungle medal"
  },
  space: {
    emoji: "🚀",
    es: "Piloto estelar",
    en: "Star pilot"
  },
  ocean: {
    emoji: "🐋",
    es: "Amiga de la ballena",
    en: "Whale friend"
  },
  desert: {
    emoji: "🐪",
    es: "Estrella del desierto",
    en: "Desert star"
  }
};

const CONTENT = {
  worlds: [
    {
      id: "island",
      emoji: "🏝️",
      color: "#3aa0ff",
      name: {
        es: "Isla del Tesoro",
        en: "Treasure Island"
      },
      desc: {
        es: "Piratas, mapas y secretos escondidos.",
        en: "Pirates, maps and hidden secrets."
      },
      unlockStars: 0,
      stories: [
        {
          id: "island-1",
          level: 1,
          title: {
            es: "El mensaje en la botella",
            en: "The Message in a Bottle"
          },
          intro: {
            es: "Mira y su ballena de peluche Wali encuentran una botella vieja.",
            en: "Mira and her plush whale Wali find an old bottle."
          },
          sections: [
            {
              text: {
                es: "Mira camina por la playa. Bajo el brazo lleva a Wali, su ballena de peluche. De pronto, algo brilla en la arena. Es una botella vieja. Dentro de la botella hay un papel. Mira lo saca con mucho cuidado.",
                en: "Mira walks along the beach. Under her arm she carries Wali, her soft plush whale. Suddenly something glitters in the sand. It is an old bottle. Inside there is a note. Mira carefully pulls it out."
              },
              easy: {
                es: "Mira camina por la playa. Lleva a Wali, su ballena de peluche. En la arena brilla una botella. Dentro hay un papel.",
                en: "Mira walks on the beach. She carries her plush whale Wali. A bottle glitters in the sand. Inside is a note."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Qué encuentra Mira en la arena?",
                    en: "What does Mira find in the sand?"
                  },
                  options: {
                    es: [
                      "Una botella vieja",
                      "Un pez",
                      "Una concha",
                      "Una pelota"
                    ],
                    en: [
                      "An old bottle",
                      "A fish",
                      "A shell",
                      "A ball"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "vocab",
                  word: {
                    es: "mensaje en una botella",
                    en: "message in a bottle"
                  },
                  q: {
                    es: "¿Qué es un mensaje en una botella?",
                    en: "What is a message in a bottle?"
                  },
                  options: {
                    es: [
                      "Una nota dentro de una botella",
                      "Una bebida",
                      "Una carta del cartero",
                      "Un juguete"
                    ],
                    en: [
                      "A note inside a bottle",
                      "A drink",
                      "A letter from the mailman",
                      "A toy"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡Hace mucho tiempo, los marineros mandaban mensajes en botellas por el mar!",
                    en: "Long ago sailors really sent messages in bottles across the sea!"
                  }
                }
              ]
            },
            {
              text: {
                es: "En el papel hay un mapa dibujado. Una flecha roja señala una roca grande. Al lado dice: «Camina veinte pasos hacia el este». Mira sonríe y abraza fuerte a Wali. ¡Empieza una búsqueda del tesoro!",
                en: "On the note a map is drawn. A red arrow points to a big rock. Next to it it says: 'Walk twenty steps east.' Mira smiles and hugs Wali tight. This is the start of a treasure hunt."
              },
              easy: {
                es: "En el papel hay un mapa. Una flecha señala una roca. Mira debe dar veinte pasos. ¡Es una búsqueda del tesoro!",
                en: "The note has a map. An arrow points to a rock. Mira must walk twenty steps. It is a treasure hunt!"
              },
              tasks: [
                {
                  type: "predict",
                  q: {
                    es: "¿Qué crees que encuentra Mira junto a la roca?",
                    en: "What do you think Mira finds at the rock?"
                  },
                  options: {
                    es: [
                      "Quizás un cofre",
                      "Seguro un tesoro",
                      "Otra pista",
                      "Un loro dormido"
                    ],
                    en: [
                      "Maybe a chest",
                      "Surely a treasure",
                      "Another clue",
                      "A sleeping parrot"
                    ]
                  },
                  answer: -1
                },
                {
                  type: "missing",
                  q: {
                    es: "¿Qué letra falta? M_PA",
                    en: "Which letter is missing? M_P"
                  },
                  options: {
                    es: [
                      "A",
                      "E",
                      "O",
                      "U"
                    ],
                    en: [
                      "A",
                      "E",
                      "O",
                      "U"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "Dilo despacio: maaapa.",
                    en: "Say the word slowly: maaap."
                  }
                }
              ]
            },
            {
              text: {
                es: "Mira cuenta sus pasos: uno, dos, tres… ¡veinte! Frente a ella hay una cueva pequeña. Allá al fondo, algo brilla. Es un cofre de madera lleno de monedas de oro. ¡Mira encontró el tesoro! Wali habría chillado de alegría.",
                en: "Mira counts her steps: one, two, three … twenty! In front of her is a small cave. Deep inside something sparkles. It is a wooden chest with golden coins. Mira has found the treasure! Wali would have squeaked with joy."
              },
              easy: {
                es: "Mira cuenta veinte pasos. Hay una cueva. Dentro brilla un cofre con oro. ¡Mira encontró el tesoro!",
                en: "Mira counts twenty steps. There is a cave. Inside a chest with gold sparkles. Mira found the treasure!"
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Dónde está escondido el tesoro?",
                    en: "Where is the treasure hidden?"
                  },
                  options: {
                    es: [
                      "En una cueva",
                      "En el agua",
                      "En un árbol",
                      "En el bote"
                    ],
                    en: [
                      "In a cave",
                      "In the water",
                      "On a tree",
                      "In the boat"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "sentence",
                  q: {
                    es: "Pon la oración en el orden correcto.",
                    en: "Put the sentence in the right order."
                  },
                  options: {
                    es: [
                      "Mira encontró el tesoro.",
                      "Tesoro Mira encontró el.",
                      "El Mira tesoro encontró.",
                      "Encontró tesoro el Mira."
                    ],
                    en: [
                      "Mira has found the treasure.",
                      "Treasure Mira found the has.",
                      "The Mira treasure has found.",
                      "Found treasure has Mira the."
                    ]
                  },
                  answer: 0
                }
              ]
            }
          ]
        },
        {
          id: "island-2",
          level: 2,
          title: {
            es: "El secreto del Capitán Botón",
            en: "Captain Button's Secret"
          },
          intro: {
            es: "Un viejo capitán necesita la ayuda de Mira.",
            en: "An old captain needs Mira's help."
          },
          sections: [
            {
              text: {
                es: "En el puerto, el Capitán Botón está sentado sobre un baúl. Su barba es gris como la niebla. —Mi barco ha desaparecido —suspira—. Necesito a alguien valiente que sepa leer bien. Mira asiente enseguida.",
                en: "At the harbour Captain Button sits on a crate. His beard is grey like fog. 'My ship has vanished,' he sighs. 'I need someone brave who can read well.' Mira nods at once."
              },
              easy: {
                es: "El Capitán Botón está triste. Su barco no está. Necesita ayuda. Mira quiere ayudarlo.",
                en: "Captain Button is sad. His ship is gone. He needs help. Mira wants to help him."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Por qué está triste el capitán?",
                    en: "Why is the captain sad?"
                  },
                  options: {
                    es: [
                      "Su barco ya no está",
                      "Tiene hambre",
                      "Está lloviendo",
                      "Está cansado"
                    ],
                    en: [
                      "His ship is gone",
                      "He is hungry",
                      "It is raining",
                      "He is tired"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "wordimage",
                  q: {
                    es: "¿Qué dibujo corresponde a «barco»?",
                    en: "Which picture matches 'ship'?"
                  },
                  options: {
                    es: [
                      "⛵",
                      "🚗",
                      "🏠",
                      "🌳"
                    ],
                    en: [
                      "⛵",
                      "🚗",
                      "🏠",
                      "🌳"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "El capitán le da a Mira una carta vieja. Muchas palabras están borrosas. —Lee despacio —dice—. La carta cuenta que el barco está detrás de la Bahía de la Niebla. Allí el agua está muy tranquila.",
                en: "The captain gives Mira an old letter. Many words are smudged. 'Read slowly,' he says. The letter says the ship lies behind Foggy Bay. There the water is very calm."
              },
              easy: {
                es: "El capitán le da una carta a Mira. Mira lee despacio. El barco está en la Bahía de la Niebla.",
                en: "The captain gives Mira a letter. Mira reads slowly. The ship is in Foggy Bay."
              },
              tasks: [
                {
                  type: "syllable",
                  q: {
                    es: "Junta las sílabas de forma correcta.",
                    en: "Put the syllables together correctly."
                  },
                  options: {
                    es: [
                      "Ba-hí-a",
                      "Hí-ba-a",
                      "A-ba-hí",
                      "Ba-a-hí"
                    ],
                    en: [
                      "Fog-gy-bay",
                      "Bay-fog-gy",
                      "Gy-fog-bay",
                      "Fog-bay-gy"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "spellfix",
                  q: {
                    es: "¿Qué palabra está mal escrita?",
                    en: "Which word is spelled wrong?"
                  },
                  options: {
                    es: [
                      "Vorrosa",
                      "Tranquila",
                      "Carta",
                      "Bahía"
                    ],
                    en: [
                      "Shipp",
                      "Water",
                      "Letter",
                      "Bay"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "«Borrosa» se escribe con b.",
                    en: "Ship has just one p."
                  }
                }
              ]
            },
            {
              text: {
                es: "Mira rema hacia la Bahía de la Niebla. Poco a poco la niebla se abre. ¡Allí está el barco! Está atorado en una roca. Mira tira de la cuerda y el barco queda libre. El Capitán Botón grita de alegría.",
                en: "Mira rows to Foggy Bay. Slowly the fog parts. There is the ship! It is stuck on a rock. Mira pulls the rope and the ship comes free. Captain Button cheers with joy."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Cómo libera Mira el barco?",
                    en: "How does Mira free the ship?"
                  },
                  options: {
                    es: [
                      "Tira de la cuerda",
                      "Grita muy fuerte",
                      "Espera",
                      "Se lanza al agua"
                    ],
                    en: [
                      "She pulls the rope",
                      "She shouts loudly",
                      "She waits",
                      "She jumps in the water"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "retell",
                  q: {
                    es: "¿Cómo termina la historia?",
                    en: "How does the story end?"
                  },
                  options: {
                    es: [
                      "El capitán está feliz",
                      "Mira se va a dormir",
                      "El barco se hunde",
                      "Empieza a nevar"
                    ],
                    en: [
                      "The captain is happy",
                      "Mira goes to sleep",
                      "The ship sinks",
                      "It starts to snow"
                    ]
                  },
                  answer: 0
                }
              ]
            }
          ]
        },
        {
          id: "island-3",
          level: 2,
          title: {
            es: "Antón y el detector de metales",
            en: "Anton and the Metal Detector"
          },
          intro: {
            es: "Pitín, el detector de Antón, suena sobre algo escondido.",
            en: "Anton's detector 'Pieper' beeps over something hidden."
          },
          sections: [
            {
              text: {
                es: "El nuevo detector de metales de Antón se llama Pitín. Hace «piii» cuando hay metal en la arena. —¡Ven, Mira! —grita Antón. Juntos corren por la playa. Wali, la ballena de peluche, rebota en la mochila de Mira. De pronto, Pitín suena muy emocionado.",
                en: "Anton's new metal detector is called Pieper. It beeps when metal lies in the sand. 'Come, Mira!' calls Anton. Together they run across the beach. Wali the plush whale bounces in Mira's backpack. Suddenly Pieper beeps excitedly."
              },
              easy: {
                es: "Antón tiene un detector de metales. Se llama Pitín. Pitín suena cuando hay metal. Mira y Wali van con ellos.",
                en: "Anton has a metal detector. It is called Pieper. Pieper beeps at metal. Mira and Wali come along."
              },
              tasks: [
                {
                  type: "vocab",
                  word: {
                    es: "detector de metales",
                    en: "metal detector"
                  },
                  q: {
                    es: "¿Qué hace un detector de metales?",
                    en: "What does a metal detector do?"
                  },
                  options: {
                    es: [
                      "Suena cuando hay metal bajo el suelo",
                      "Pone música",
                      "Cocina comida",
                      "Maneja un carro"
                    ],
                    en: [
                      "It beeps at metal in the ground",
                      "It plays music",
                      "It cooks food",
                      "It drives a car"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡Los detectores de metales de verdad encuentran monedas, clavos y hasta espadas antiguas!",
                    en: "Real metal detectors find coins, nails and even old swords!"
                  }
                },
                {
                  type: "missing",
                  q: {
                    es: "¿Qué letra falta? ME_AL",
                    en: "Which letter is missing? ME_AL"
                  },
                  options: {
                    es: [
                      "T",
                      "D",
                      "K",
                      "P"
                    ],
                    en: [
                      "T",
                      "D",
                      "K",
                      "P"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "—¡Aquí suena más fuerte! —dice Antón. Pero, ¿dónde está exactamente el tesoro? Pitín suena a veces bajito y a veces fuerte. Busca el lugar correcto: cuanto más fuerte suena, más cerca estás.",
                en: "'It beeps loudest here!' says Anton. But where exactly is the treasure? Pieper beeps soft, then loud. Find the right spot: the louder it beeps, the closer you are."
              },
              tasks: [
                {
                  type: "detector",
                  q: {
                    es: "¿Dónde suena más fuerte Pitín? ¡Toca y busca!",
                    en: "Where does Pieper beep loudest? Tap and search!"
                  },
                  options: {
                    es: [
                      "🌴 Palmera",
                      "🪨 Piedra",
                      "🏰 Castillo de arena",
                      "⚓ Ancla",
                      "🐚 Concha"
                    ],
                    en: [
                      "🌴 Palm",
                      "🪨 Rock",
                      "🕽 Sandcastle",
                      "⚓ Anchor",
                      "🐚 Shell"
                    ]
                  },
                  answer: 3,
                  fact: {
                    es: "¡Debajo del ancla vieja había un cofre de bronce!",
                    en: "Under the old anchor lay a brass treasure box!"
                  }
                }
              ]
            },
            {
              text: {
                es: "En el cofre hay monedas antiguas y una brújula pequeña. Antón sonríe. —¡La brújula es para ti, Mira! Mira se pone muy contenta. Con una brújula siempre puedes encontrar el camino a casa.",
                en: "In the box are old coins and a small compass. Anton beams. 'The compass is a gift for you, Mira!' Mira is overjoyed. With a compass you can always find the way home."
              },
              easy: {
                es: "En el cofre hay monedas y una brújula. Antón le regala la brújula a Mira. Mira está feliz.",
                en: "In the box are coins and a compass. Anton gives Mira the compass. Mira is happy."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Para qué sirve una brújula?",
                    en: "What is a compass for?"
                  },
                  options: {
                    es: [
                      "Para encontrar el camino",
                      "Para cocinar",
                      "Para dormir",
                      "Para pintar"
                    ],
                    en: [
                      "To find the way",
                      "To cook",
                      "To sleep",
                      "To draw"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "La aguja de una brújula siempre señala el norte.",
                    en: "A compass needle always points north."
                  }
                },
                {
                  type: "retell",
                  q: {
                    es: "¿Qué encontraron Antón y Mira?",
                    en: "What did Anton and Mira find?"
                  },
                  options: {
                    es: [
                      "Un cofre con monedas y una brújula",
                      "Un carro",
                      "Un dragón",
                      "Un helado"
                    ],
                    en: [
                      "A box with coins and a compass",
                      "A car",
                      "A kite",
                      "An ice cream"
                    ]
                  },
                  answer: 0
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "jungle",
      emoji: "🌴",
      color: "#36b37e",
      name: {
        es: "Sendero de la Selva",
        en: "Jungle Trail"
      },
      desc: {
        es: "Animales, plantas y datos curiosos de la naturaleza.",
        en: "Animals, plants and exciting nature facts."
      },
      unlockStars: 6,
      stories: [
        {
          id: "jungle-1",
          level: 2,
          title: {
            es: "El mono travieso",
            en: "The Cheeky Monkey"
          },
          intro: {
            es: "En la selva desaparece una banana. ¿Quién fue?",
            en: "In the jungle a banana disappears – who did it?"
          },
          sections: [
            {
              text: {
                es: "En lo profundo de la selva vive Coco, el mono. Le encantan las bananas más que nada. Esta mañana desapareció su última banana. Coco busca por todas partes. ¿Quién fue el ladrón?",
                en: "Deep in the jungle lives Coco the monkey. He loves bananas more than anything. This morning his last banana has disappeared. Coco searches everywhere. Who was the thief?"
              },
              easy: {
                es: "El mono Coco ama las bananas. Su banana no está. Coco la busca por todas partes.",
                en: "Coco the monkey loves bananas. His banana is gone. Coco looks everywhere."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Qué desapareció?",
                    en: "What has disappeared?"
                  },
                  options: {
                    es: [
                      "La banana de Coco",
                      "El sombrero de Coco",
                      "Un árbol",
                      "El río"
                    ],
                    en: [
                      "Coco's banana",
                      "Coco's hat",
                      "A tree",
                      "The river"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "wordimage",
                  q: {
                    es: "¿Qué dibujo muestra un mono?",
                    en: "Which picture shows a monkey?"
                  },
                  options: {
                    es: [
                      "🐒",
                      "🐘",
                      "🦜",
                      "🐍"
                    ],
                    en: [
                      "🐒",
                      "🐘",
                      "🦜",
                      "🐍"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "Coco sigue un rastro de cáscaras. Lo lleva hasta un loro. Pero el loro mueve la cabeza. —¡Yo no fui! —grita—. Mira hacia arriba. En lo alto del árbol hay un perezoso pequeño que mastica contento.",
                en: "Coco follows a trail of peels. It leads to a parrot. But the parrot shakes its head. 'It wasn't me!' it cries. 'Look up.' High in the tree sits a little sloth, chewing happily."
              },
              easy: {
                es: "Coco sigue las cáscaras. El loro no fue. Arriba, en el árbol, un perezoso está masticando.",
                en: "Coco follows the peels. The parrot did not do it. Up in the tree a sloth is chewing."
              },
              tasks: [
                {
                  type: "predict",
                  q: {
                    es: "¿Quién se habrá comido la banana?",
                    en: "Who probably ate the banana?"
                  },
                  options: {
                    es: [
                      "El perezoso",
                      "El loro",
                      "El mismo Coco",
                      "Una serpiente"
                    ],
                    en: [
                      "The sloth",
                      "The parrot",
                      "Coco himself",
                      "A snake"
                    ]
                  },
                  answer: -1
                },
                {
                  type: "missing",
                  q: {
                    es: "¿Qué letra falta? BANA_A",
                    en: "Which letter is missing? BANA_A"
                  },
                  options: {
                    es: [
                      "N",
                      "M",
                      "L",
                      "R"
                    ],
                    en: [
                      "N",
                      "M",
                      "L",
                      "R"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "El perezoso sonríe con vergüenza. —Perdón, tenía muchísima hambre. Coco se echa a reír. Juntos recogen bananas nuevas. Ahora hay suficiente para todos. Compartir es divertido.",
                en: "The sloth smiles shyly. 'I'm sorry, I was so hungry.' Coco has to laugh. Together they pick new bananas. Now everyone has enough. Sharing is fun like this."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Qué aprenden los animales al final?",
                    en: "What do the animals learn in the end?"
                  },
                  options: {
                    es: [
                      "Compartir es divertido",
                      "Las bananas son peligrosas",
                      "Hay que pelear",
                      "Dormir es importante"
                    ],
                    en: [
                      "Sharing is fun",
                      "Bananas are dangerous",
                      "You should argue",
                      "Sleeping is important"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "spellfix",
                  q: {
                    es: "¿Qué palabra está mal escrita?",
                    en: "Which word is spelled wrong?"
                  },
                  options: {
                    es: [
                      "Selba",
                      "Mono",
                      "Árbol",
                      "Rastro"
                    ],
                    en: [
                      "Jungel",
                      "Monkey",
                      "Tree",
                      "Trail"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "«Selva» se escribe con v.",
                    en: "Jungle ends with -gle."
                  }
                }
              ]
            }
          ]
        },
        {
          id: "jungle-2",
          level: 2,
          title: {
            es: "El jardín de mariposas de Marie",
            en: "Marie's Butterfly Garden"
          },
          intro: {
            es: "Marie descubre cómo las orugas se convierten en mariposas.",
            en: "Marie discovers how caterpillars become butterflies."
          },
          sections: [
            {
              text: {
                es: "A Marie le encanta sentarse en el jardín, al borde de la selva. En una hoja descubre una pequeña oruga verde. La oruga come y come. —Qué hambre tienes —se ríe Marie—. Pronto la oruga se convertirá en algo maravilloso.",
                en: "Marie loves sitting in the garden at the jungle's edge. On a leaf she spots a small green caterpillar. The caterpillar eats and eats. 'You really are hungry,' Marie laughs. Soon the caterpillar will become something wonderful."
              },
              easy: {
                es: "Marie está en el jardín. En una hoja hay una oruga verde. La oruga come mucho.",
                en: "Marie sits in the garden. On a leaf is a green caterpillar. The caterpillar eats a lot."
              },
              tasks: [
                {
                  type: "vocab",
                  word: {
                    es: "oruga",
                    en: "caterpillar"
                  },
                  q: {
                    es: "¿Qué es una oruga?",
                    en: "What is a caterpillar?"
                  },
                  options: {
                    es: [
                      "Un animal joven que se convierte en mariposa",
                      "Un pájaro",
                      "Una piedra",
                      "Una flor"
                    ],
                    en: [
                      "A young animal that becomes a butterfly",
                      "A bird",
                      "A stone",
                      "A flower"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡Una oruga puede comer en un día más de lo que pesa!",
                    en: "A caterpillar can eat more than its own weight in a single day!"
                  }
                },
                {
                  type: "wordimage",
                  q: {
                    es: "¿Qué dibujo muestra una mariposa?",
                    en: "Which picture shows a butterfly?"
                  },
                  options: {
                    es: [
                      "🦋",
                      "🐛",
                      "🐝",
                      "🐞"
                    ],
                    en: [
                      "🦋",
                      "🐛",
                      "🐝",
                      "🐞"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "La oruga se envuelve en una cubierta firme. A eso se le llama crisálida. Marie espera con paciencia muchos días. Entonces sucede: la cubierta se abre y sale una mariposa de colores. Poco a poco seca sus alas.",
                en: "The caterpillar wraps itself in a firm shell. This is called a chrysalis. Marie waits patiently for many days. Then it happens: the shell opens and a colourful butterfly crawls out. Slowly it dries its wings."
              },
              easy: {
                es: "La oruga se vuelve crisálida. Marie espera muchos días. Luego sale una mariposa de colores.",
                en: "The caterpillar becomes a chrysalis. Marie waits many days. Then a colourful butterfly comes out."
              },
              tasks: [
                {
                  type: "syllable",
                  q: {
                    es: "Junta las sílabas.",
                    en: "Put the syllables together."
                  },
                  options: {
                    es: [
                      "Ma-ri-po-sa",
                      "Po-sa-ma-ri",
                      "Sa-ri-ma-po",
                      "Ma-po-ri-sa"
                    ],
                    en: [
                      "But-ter-fly",
                      "Fly-but-ter",
                      "Ter-fly-but",
                      "But-fly-ter"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "retell",
                  q: {
                    es: "¿Cómo crece una mariposa? ¿Qué viene primero?",
                    en: "How does a butterfly grow? What comes first?"
                  },
                  options: {
                    es: [
                      "Primero oruga, luego crisálida, luego mariposa",
                      "Primero mariposa, luego oruga",
                      "Primero crisálida, luego oruga",
                      "Solo mariposa"
                    ],
                    en: [
                      "First caterpillar, then chrysalis, then butterfly",
                      "First butterfly, then caterpillar",
                      "First chrysalis, then caterpillar",
                      "Only butterfly"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "El cambio de oruga a mariposa se llama metamorfosis.",
                    en: "The change from caterpillar to butterfly is called metamorphosis."
                  }
                }
              ]
            }
          ]
        },
        {
          id: "jungle-3",
          level: 3,
          title: {
            es: "Luki y el perezoso lento",
            en: "Luki and the Slow Sloth"
          },
          intro: {
            es: "Luki aprende que ser lento a veces es ser astuto.",
            en: "Luki learns why being slow can be clever."
          },
          sections: [
            {
              text: {
                es: "Luki camina por la selva con unos binoculares. Quiere ver el animal más lento del mundo: el perezoso. Por fin descubre uno que cuelga boca abajo de una rama. Se mueve tan despacio que casi no se nota.",
                en: "Luki hikes through the jungle with binoculars. He wants to see the slowest animal in the world: the sloth. At last he spots one hanging upside down from a branch. It moves so slowly you can barely tell."
              },
              easy: {
                es: "Luki busca un perezoso. Tiene binoculares. Allí cuelga uno de una rama. Es muy lento.",
                en: "Luki looks for a sloth. He has binoculars. There one hangs on a branch. It is very slow."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Qué animal busca Luki?",
                    en: "Which animal is Luki looking for?"
                  },
                  options: {
                    es: [
                      "El perezoso",
                      "Un león",
                      "Un tiburón",
                      "Un águila"
                    ],
                    en: [
                      "The sloth",
                      "A lion",
                      "A shark",
                      "An eagle"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡Los perezosos duermen hasta 15 horas al día!",
                    en: "Sloths sleep up to 15 hours a day!"
                  }
                },
                {
                  type: "vocab",
                  word: {
                    es: "binoculares",
                    en: "binoculars"
                  },
                  q: {
                    es: "¿Para qué sirven los binoculares?",
                    en: "What are binoculars for?"
                  },
                  options: {
                    es: [
                      "Para ver de cerca cosas lejanas",
                      "Para oír",
                      "Para correr",
                      "Para comer"
                    ],
                    en: [
                      "To see faraway things up close",
                      "To hear",
                      "To run",
                      "To eat"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "—¿Por qué eres tan lento? —pregunta Luki en voz baja. El perezoso bosteza. Como casi no se mueve, sus enemigos casi no lo ven entre las hojas. Así el perezoso está a salvo. A veces ser lento es ser astuto.",
                en: "'Why are you so slow?' Luki asks quietly. The sloth yawns. Because it hardly moves, enemies can barely spot it in the leaves. So the sloth stays safe. Sometimes slow is simply clever."
              },
              easy: {
                es: "El perezoso es lento. Así los enemigos casi no lo ven. Aquí lento es astuto.",
                en: "The sloth is slow. So enemies hardly see it. Slow is clever here."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Por qué le sirve al perezoso ser lento?",
                    en: "Why is being slow good for the sloth?"
                  },
                  options: {
                    es: [
                      "Los enemigos casi no lo ven",
                      "Puede correr más rápido",
                      "Se vuelve famoso",
                      "Puede volar"
                    ],
                    en: [
                      "Enemies barely spot it",
                      "It can run faster",
                      "It becomes famous",
                      "It can fly"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "spellfix",
                  q: {
                    es: "¿Qué palabra está mal escrita?",
                    en: "Which word is spelled wrong?"
                  },
                  options: {
                    es: [
                      "Peresoso",
                      "Selva",
                      "Lento",
                      "Seguro"
                    ],
                    en: [
                      "Slooth",
                      "Jungle",
                      "Slow",
                      "Safe"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "Perezoso se escribe con z: pe-re-zo-so.",
                    en: "Sloth has one o: s-l-o-t-h."
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "space",
      emoji: "🚀",
      color: "#8b6cf0",
      name: {
        es: "El Espacio",
        en: "Outer Space"
      },
      desc: {
        es: "Viaja a planetas, estrellas y cometas.",
        en: "Travel to planets, stars and comets."
      },
      unlockStars: 14,
      stories: [
        {
          id: "space-1",
          level: 2,
          title: {
            es: "Lina vuela a la Luna",
            en: "Lina Flies to the Moon"
          },
          intro: {
            es: "Una pequeña astronauta despega hacia el espacio.",
            en: "A little astronaut launches into space."
          },
          sections: [
            {
              text: {
                es: "Lina está sentada en su cohete. Empieza la cuenta regresiva: tres, dos, uno, ¡despegue! Con un fuerte rugido el cohete se eleva. Pronto Lina ve la Tierra como una bola azul allá abajo.",
                en: "Lina sits in her rocket. The countdown begins: three, two, one, lift-off! With a loud roar the rocket rises. Soon Lina sees the Earth as a blue ball below her."
              },
              easy: {
                es: "Lina está en el cohete. Tres, dos, uno, ¡despegue! El cohete sube. La Tierra es azul.",
                en: "Lina sits in the rocket. Three, two, one, go! The rocket flies up. The Earth is blue."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Cómo se ve la Tierra desde el espacio?",
                    en: "What does Earth look like from space?"
                  },
                  options: {
                    es: [
                      "Como una bola azul",
                      "Como un cubo",
                      "Como una estrella",
                      "Como un triángulo"
                    ],
                    en: [
                      "Like a blue ball",
                      "Like a cube",
                      "Like a star",
                      "Like a triangle"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "La Tierra se ve azul porque tiene mucha agua.",
                    en: "Earth looks blue because it has so much water."
                  }
                },
                {
                  type: "syllable",
                  q: {
                    es: "Junta las sílabas.",
                    en: "Put the syllables together."
                  },
                  options: {
                    es: [
                      "Co-he-te",
                      "Te-co-he",
                      "He-co-te",
                      "Co-te-he"
                    ],
                    en: [
                      "Rock-et",
                      "Et-rock",
                      "Ro-cket",
                      "Ck-roet"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "En el espacio todo es muy liviano. El lápiz de Lina flota en el aire. ¡Hasta la propia Lina flota! A eso se le llama ingravidez. Lina se ríe y da una voltereta sentada.",
                en: "In space everything is very light. Lina's pen floats through the air. Even Lina herself floats! This is called weightlessness. Lina laughs and does a somersault while sitting."
              },
              easy: {
                es: "En el espacio todo es liviano. El lápiz flota. Lina también flota. ¡Qué divertido!",
                en: "In space everything is light. The pen floats. Lina floats too. What fun!"
              },
              tasks: [
                {
                  type: "vocab",
                  word: {
                    es: "ingravidez",
                    en: "weightlessness"
                  },
                  q: {
                    es: "¿Qué significa ingravidez?",
                    en: "What does weightlessness mean?"
                  },
                  options: {
                    es: [
                      "Todo flota",
                      "Todo pesa mucho",
                      "Está oscuro",
                      "Hace calor"
                    ],
                    en: [
                      "Everything floats",
                      "Everything is heavy",
                      "It is dark",
                      "It is warm"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "missing",
                  q: {
                    es: "¿Qué letra falta? L_NA",
                    en: "Which letter is missing? M_ON"
                  },
                  options: {
                    es: [
                      "U",
                      "A",
                      "I",
                      "O"
                    ],
                    en: [
                      "O",
                      "A",
                      "I",
                      "U"
                    ]
                  },
                  answer: 0
                }
              ]
            }
          ]
        },
        {
          id: "space-2",
          level: 2,
          title: {
            es: "Vicente y la estrella fugaz",
            en: "Vincent and the Shooting Star"
          },
          intro: {
            es: "Vicente pide un deseo y aprende qué es en realidad una estrella fugaz.",
            en: "Vincent makes a wish – and learns what a shooting star really is."
          },
          sections: [
            {
              text: {
                es: "De noche, Vicente está acostado con Lina sobre una manta, mirando el cielo. De pronto, una raya brillante cruza las estrellas. —¡Una estrella fugaz! —grita Vicente—. ¡Rápido, pide un deseo! Los dos cierran los ojos.",
                en: "At night Vincent lies on a blanket with Lina, looking at the sky. Suddenly a bright streak shoots across the stars. 'A shooting star!' Vincent cries. 'Quick, make a wish!' They both close their eyes."
              },
              easy: {
                es: "Vicente y Lina miran el cielo de noche. Aparece una raya brillante. —¡Una estrella fugaz! —dice Vicente.",
                en: "Vincent and Lina watch the night sky. A bright streak appears. 'A shooting star!' says Vincent."
              },
              tasks: [
                {
                  type: "predict",
                  q: {
                    es: "¿Qué crees que es en realidad una estrella fugaz?",
                    en: "What do you think a shooting star really is?"
                  },
                  options: {
                    es: [
                      "Una piedrita brillante del espacio",
                      "Una estrella de verdad que cae",
                      "Un avión",
                      "Una lámpara"
                    ],
                    en: [
                      "A glowing little rock from space",
                      "A real star falling",
                      "An airplane",
                      "A lamp"
                    ]
                  },
                  answer: -1
                },
                {
                  type: "wordimage",
                  q: {
                    es: "¿Qué dibujo corresponde a «estrella»?",
                    en: "Which picture matches 'star'?"
                  },
                  options: {
                    es: [
                      "⭐",
                      "🌙",
                      "☀️",
                      "☁️"
                    ],
                    en: [
                      "⭐",
                      "🌙",
                      "☀️",
                      "☁️"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "Lina explica: —Una estrella fugaz no es una estrella. Es una piedrita diminuta que entra veloz al aire de la Tierra y se pone muy brillante. Vicente se queda asombrado. Saber algo es casi tan bonito como un deseo.",
                en: "Lina explains: 'A shooting star is not a star at all. It is a tiny rock racing into the Earth's air, glowing brightly.' Vincent marvels. Knowing is almost as nice as a wish."
              },
              easy: {
                es: "Lina dice: una estrella fugaz es una piedrita. Brilla en el aire. Vicente se asombra.",
                en: "Lina says: a shooting star is a tiny rock. It glows in the air. Vincent marvels."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Qué es en realidad una estrella fugaz?",
                    en: "What is a shooting star really?"
                  },
                  options: {
                    es: [
                      "Una piedrita brillante del espacio",
                      "Un planeta grande",
                      "Un pájaro",
                      "Una nube"
                    ],
                    en: [
                      "A glowing rock from space",
                      "A big planet",
                      "A bird",
                      "A cloud"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡Esas piedritas a veces son del tamaño de un grano de arena!",
                    en: "Such little rocks are often only the size of a grain of sand!"
                  }
                },
                {
                  type: "spellfix",
                  q: {
                    es: "¿Qué palabra está mal escrita?",
                    en: "Which word is spelled wrong?"
                  },
                  options: {
                    es: [
                      "Estreya",
                      "Cielo",
                      "Noche",
                      "Deseo"
                    ],
                    en: [
                      "Shuting star",
                      "Sky",
                      "Night",
                      "Wish"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "«Estrella» se escribe con ll.",
                    en: "Shooting has two o's."
                  }
                }
              ]
            }
          ]
        },
        {
          id: "space-3",
          level: 3,
          title: {
            es: "El planeta rojo",
            en: "The Red Planet"
          },
          intro: {
            es: "Lina y Vicente hablan por radio con un robot en Marte.",
            en: "Lina and Vincent radio a robot on Mars."
          },
          sections: [
            {
              text: {
                es: "En la pantalla brilla un planeta rojo como el óxido: Marte. Allí un pequeño robot avanza sobre el suelo polvoriento. Lina le manda un saludo por radio. El robot devuelve una foto: rocas rojas hasta donde alcanza la vista.",
                en: "On the screen a rust-red planet glows: Mars. A small robot drives over the dusty ground there. Lina radios it a hello. The robot sends back a photo: red rocks as far as you can see."
              },
              easy: {
                es: "Un robot anda por Marte. Marte es rojo. Lina saluda por radio. El robot manda una foto.",
                en: "A robot drives on Mars. Mars is red. Lina radios hello. The robot sends a photo."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿De qué color es Marte?",
                    en: "What colour is Mars?"
                  },
                  options: {
                    es: [
                      "Rojo",
                      "Verde",
                      "Azul",
                      "Amarillo"
                    ],
                    en: [
                      "Red",
                      "Green",
                      "Blue",
                      "Yellow"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "A Marte lo llaman «el planeta rojo» porque su suelo tiene arena oxidada.",
                    en: "Mars is called the 'red planet' because its soil has rusty sand."
                  }
                },
                {
                  type: "vocab",
                  word: {
                    es: "robot",
                    en: "robot"
                  },
                  q: {
                    es: "¿Qué es un robot?",
                    en: "What is a robot?"
                  },
                  options: {
                    es: [
                      "Una máquina que hace tareas",
                      "Un animal",
                      "Una estrella",
                      "Un árbol"
                    ],
                    en: [
                      "A machine that does tasks",
                      "An animal",
                      "A star",
                      "A tree"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "—¿Hay agua allí? —pregunta Vicente. Lina asiente: —Hace mucho tiempo fluía agua en Marte. Hoy está congelada bajo el suelo. Quizás algún día las personas viajen allá. Lina y Vicente ya sueñan con eso.",
                en: "'Is there water there?' Vincent asks. Lina nods: 'Long ago water flowed on Mars. Today it is frozen under the ground.' Maybe people will travel there one day. Lina and Vincent are already dreaming of it."
              },
              easy: {
                es: "Vicente pregunta por el agua. Lina dice: hace mucho había agua en Marte. Ahora está congelada.",
                en: "Vincent asks about water. Lina says: long ago Mars had water. Now it is frozen."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Dónde está hoy el agua de Marte?",
                    en: "Where is the water on Mars today?"
                  },
                  options: {
                    es: [
                      "Congelada bajo el suelo",
                      "En grandes mares",
                      "En nubes",
                      "Nunca hubo agua"
                    ],
                    en: [
                      "Frozen under the ground",
                      "In big oceans",
                      "In clouds",
                      "There never was water"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "retell",
                  q: {
                    es: "¿Con qué sueñan Lina y Vicente al final?",
                    en: "What do Lina and Vincent dream of at the end?"
                  },
                  options: {
                    es: [
                      "Con viajar a Marte",
                      "Con irse a dormir",
                      "Con comer helado",
                      "Con correr a casa"
                    ],
                    en: [
                      "Travelling to Mars themselves",
                      "Going to sleep",
                      "Eating ice cream",
                      "Running home"
                    ]
                  },
                  answer: 0
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "ocean",
      emoji: "🐋",
      color: "#1fb6c9",
      name: {
        es: "Submarino de las Profundidades",
        en: "Deep-Sea Submarine"
      },
      desc: {
        es: "Sumérgete con peces, corales y ballenas.",
        en: "Dive down to fish, corals and whales."
      },
      unlockStars: 22,
      stories: [
        {
          id: "ocean-1",
          level: 3,
          title: {
            es: "El arrecife luminoso",
            en: "The Glowing Reef"
          },
          intro: {
            es: "Un submarino descubre un secreto en lo profundo.",
            en: "A submarine discovers a secret in the deep."
          },
          sections: [
            {
              text: {
                es: "El pequeño submarino se hunde cada vez más. Afuera se pone oscuro. De repente brillan lucecitas por todas partes. Son medusas que resplandecen en la oscuridad. La capitana Noa mira asombrada por la ventana redonda.",
                en: "The little submarine dives deeper and deeper. Outside it grows dark. Suddenly tiny lights glow everywhere. They are jellyfish that shine in the dark. Captain Noa marvels through the round window."
              },
              easy: {
                es: "El submarino baja mucho. Se hace oscuro. Por todas partes brillan medusas. Noa se asombra.",
                en: "The submarine dives deep. It gets dark. Jellyfish glow everywhere. Noa marvels."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Qué brilla en el agua oscura?",
                    en: "What glows in the dark water?"
                  },
                  options: {
                    es: [
                      "Medusas",
                      "Piedras",
                      "Botes",
                      "Estrellas"
                    ],
                    en: [
                      "Jellyfish",
                      "Stones",
                      "Boats",
                      "Stars"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡Algunos animales del mar de verdad pueden hacer su propia luz!",
                    en: "Some sea animals really can make their own light!"
                  }
                },
                {
                  type: "sentence",
                  q: {
                    es: "¿Qué oración está bien ordenada?",
                    en: "Which sentence is in the right order?"
                  },
                  options: {
                    es: [
                      "El submarino baja muy hondo.",
                      "Hondo baja submarino el muy.",
                      "Baja el hondo submarino muy.",
                      "Submarino el baja muy hondo."
                    ],
                    en: [
                      "The submarine dives deep.",
                      "Deep dives submarine the.",
                      "Dives the deep submarine.",
                      "Submarine the dives deep."
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "Noa descubre un arrecife de coral de muchos colores. Peces vistosos nadan entre los corales. Una tortuga pasa deslizándose con calma. Noa toma una foto. Quiere mostrarle a todos lo hermoso que es el fondo del mar.",
                en: "Noa discovers a coral reef in many colours. Colourful fish swim through it. A turtle glides calmly past. Noa takes a photo. She wants to show everyone how beautiful the deep sea is."
              },
              easy: {
                es: "Noa ve un arrecife de colores. Nadan peces. Pasa una tortuga. Noa toma una foto.",
                en: "Noa sees a colourful reef. Fish swim. A turtle glides past. Noa takes a photo."
              },
              tasks: [
                {
                  type: "wordimage",
                  q: {
                    es: "¿Qué dibujo muestra una tortuga?",
                    en: "Which picture shows a turtle?"
                  },
                  options: {
                    es: [
                      "🐢",
                      "🐟",
                      "🦑",
                      "🦀"
                    ],
                    en: [
                      "🐢",
                      "🐟",
                      "🦑",
                      "🦀"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "spellfix",
                  q: {
                    es: "¿Qué palabra está mal escrita?",
                    en: "Which word is spelled wrong?"
                  },
                  options: {
                    es: [
                      "Arresife",
                      "Pez",
                      "Agua",
                      "Color"
                    ],
                    en: [
                      "Corel",
                      "Fish",
                      "Water",
                      "Colour"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "«Arrecife» se escribe con c: arre-ci-fe.",
                    en: "Coral: c-o-r-a-l."
                  }
                }
              ]
            }
          ]
        },
        {
          id: "ocean-2",
          level: 2,
          title: {
            es: "Dana y el pulpo listo",
            en: "Dana and the Clever Octopus"
          },
          intro: {
            es: "Dana lleva a Wali, la ballena de peluche, al submarino.",
            en: "Dana brings plush whale Wali into the submarine."
          },
          sections: [
            {
              text: {
                es: "Dana está sentada junto a Noa en el submarino. En su regazo está Wali, la ballena de peluche. De pronto algo golpea suavemente la ventana. Un pulpo estira sus ocho brazos y cambia de color, de rojo a azul. Dana no puede creer lo que ve.",
                en: "Dana sits next to Noa in the submarine. On her lap sits Wali, the plush whale. Then something taps softly on the window. An octopus stretches out its eight arms and changes colour from red to blue. Dana can hardly believe her eyes."
              },
              easy: {
                es: "Dana está en el submarino. Wali, la ballena de peluche, va con ella. En la ventana hay un pulpo. Cambia de color.",
                en: "Dana sits in the submarine. Wali the plush whale is there. An octopus is at the window. It changes colour."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Cuántos brazos tiene un pulpo?",
                    en: "How many arms does an octopus have?"
                  },
                  options: {
                    es: [
                      "Ocho",
                      "Dos",
                      "Cuatro",
                      "Diez"
                    ],
                    en: [
                      "Eight",
                      "Two",
                      "Four",
                      "Ten"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡Un pulpo puede cambiar de color para esconderse!",
                    en: "An octopus can change colour to hide!"
                  }
                },
                {
                  type: "vocab",
                  word: {
                    es: "pulpo",
                    en: "octopus"
                  },
                  q: {
                    es: "¿Qué sabe hacer muy bien un pulpo?",
                    en: "What is an octopus especially good at?"
                  },
                  options: {
                    es: [
                      "Cambiar de color",
                      "Correr rápido",
                      "Volar alto",
                      "Cantar fuerte"
                    ],
                    en: [
                      "Changing colour",
                      "Running fast",
                      "Flying high",
                      "Singing loudly"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "El pulpo juega a las escondidas con Dana. A veces es rojo como un coral y a veces gris como una piedra. Dana se ríe y acerca a Wali a la ventana. Luego el pulpo se despide con un brazo y desaparece en una grieta de la roca.",
                en: "The octopus plays hide-and-seek with Dana. Sometimes it is red like coral, sometimes grey like a stone. Dana laughs and holds Wali to the window. Then the octopus waves with one arm and vanishes into a crack in the rock."
              },
              easy: {
                es: "El pulpo juega a las escondidas. A veces es rojo, a veces gris. Dana se ríe. Luego se va.",
                en: "The octopus plays hide-and-seek. Sometimes red, sometimes grey. Dana laughs. Then it is gone."
              },
              tasks: [
                {
                  type: "syllable",
                  q: {
                    es: "Junta las sílabas.",
                    en: "Put the syllables together."
                  },
                  options: {
                    es: [
                      "Es-con-di-das",
                      "Di-das-es-con",
                      "Con-es-di-das",
                      "Es-di-con-das"
                    ],
                    en: [
                      "Oc-to-pus",
                      "Pus-oc-to",
                      "To-pus-oc",
                      "Oc-pus-to"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "retell",
                  q: {
                    es: "¿A qué jugó el pulpo con Dana?",
                    en: "What did the octopus play with Dana?"
                  },
                  options: {
                    es: [
                      "A las escondidas",
                      "Al fútbol",
                      "A las cartas",
                      "A las carreras en tierra"
                    ],
                    en: [
                      "Hide-and-seek",
                      "Football",
                      "Cards",
                      "Tag on land"
                    ]
                  },
                  answer: 0
                }
              ]
            }
          ]
        },
        {
          id: "ocean-3",
          level: 3,
          title: {
            es: "Hanna y la ballena de verdad",
            en: "Hannah and the Real Whale"
          },
          intro: {
            es: "Una ballena gigante canta, y Wali tiene compañía.",
            en: "A giant whale sings – and Wali gets company."
          },
          sections: [
            {
              text: {
                es: "Una canción grave llena el agua. Hanna pega la nariz a la ventana. Allí viene: una enorme ballena azul, más grande que el submarino. Hanna levanta a Wali. —¡Mira, un hermano grande para ti! La ballena sigue cantando, grave y suave.",
                en: "A deep song fills the water. Hannah presses her nose to the window. There he comes: a huge blue whale, bigger than the submarine. Hannah holds Wali up. 'Look, a big brother for you!' The whale keeps singing, deep and gentle."
              },
              easy: {
                es: "Hanna oye una canción. Llega una ballena grande. Es más grande que el submarino. Hanna le muestra a Wali.",
                en: "Hannah hears a song. A big whale comes. He is bigger than the submarine. Hannah shows him Wali."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Cómo hace la ballena su canción?",
                    en: "How does the whale make the song?"
                  },
                  options: {
                    es: [
                      "Canta con sonidos",
                      "Aplaude",
                      "Silba con la boca",
                      "Toca tambor"
                    ],
                    en: [
                      "He sings with sounds",
                      "He claps",
                      "He whistles",
                      "He drums"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡La ballena azul es el animal más grande que ha existido, más grande que cualquier dinosaurio!",
                    en: "The blue whale is the largest animal ever – bigger than any dinosaur!"
                  }
                },
                {
                  type: "wordimage",
                  q: {
                    es: "¿Qué dibujo muestra una ballena?",
                    en: "Which picture shows a whale?"
                  },
                  options: {
                    es: [
                      "🐋",
                      "🐟",
                      "🦈",
                      "🐚"
                    ],
                    en: [
                      "🐋",
                      "🐟",
                      "🦈",
                      "🐚"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "La ballena se acerca mucho y mira hacia adentro con un ojo grande y amistoso. Luego sube a la superficie, toma aire y lanza un chorro de agua al cielo. Hanna aplaude. —¡Gracias por tu canción! —dice en voz baja.",
                en: "The whale dives in close and looks inside with one big, friendly eye. Then he takes a breath at the surface and blows a fountain of water into the air. Hannah claps. 'Thank you for your song!' she calls softly."
              },
              easy: {
                es: "La ballena se acerca. Mira a Hanna. Arriba lanza agua. Hanna aplaude.",
                en: "The whale comes close. He looks at Hannah. He blows water up high. Hannah claps."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Por qué la ballena tiene que subir a la superficie?",
                    en: "Why must the whale go to the surface?"
                  },
                  options: {
                    es: [
                      "Para respirar aire",
                      "Para dormir",
                      "Para comer",
                      "Para jugar"
                    ],
                    en: [
                      "To breathe air",
                      "To sleep",
                      "To eat",
                      "To play"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "¡Las ballenas no son peces, respiran aire como nosotros!",
                    en: "Whales are not fish – they breathe air like we do!"
                  }
                },
                {
                  type: "spellfix",
                  q: {
                    es: "¿Qué palabra está mal escrita?",
                    en: "Which word is spelled wrong?"
                  },
                  options: {
                    es: [
                      "Vallena",
                      "Canción",
                      "Agua",
                      "Ojo"
                    ],
                    en: [
                      "Wale",
                      "Song",
                      "Water",
                      "Eye"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "«Ballena» se escribe con b y con ll.",
                    en: "The animal is whale, not wale."
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "desert",
      emoji: "🏜️",
      color: "#e2a23b",
      name: {
        es: "Camino del Desierto",
        en: "Desert Path"
      },
      desc: {
        es: "Calor, arena y animales muy astutos.",
        en: "Heat, sand and clever desert animals."
      },
      unlockStars: 30,
      stories: [
        {
          id: "desert-1",
          level: 3,
          title: {
            es: "El camello y el oasis",
            en: "The Camel and the Oasis"
          },
          intro: {
            es: "Un camello busca agua en el desierto caliente.",
            en: "A camel searches for water in the hot desert."
          },
          sections: [
            {
              text: {
                es: "El camello Karim camina por el desierto caliente. El sol quema. Hay arena hasta el horizonte. Karim tiene sed, pero se mantiene tranquilo. Los camellos pueden pasar mucho tiempo sin agua.",
                en: "Karim the camel walks through the hot desert. The sun is burning. Sand stretches to the horizon. Karim is thirsty, but he stays calm. Camels can go a long time without water."
              },
              easy: {
                es: "El camello Karim camina por el desierto. Hace calor. Karim tiene sed. Pero está tranquilo.",
                en: "Karim the camel walks through the desert. It is hot. Karim is thirsty. But he stays calm."
              },
              tasks: [
                {
                  type: "vocab",
                  word: {
                    es: "oasis",
                    en: "oasis"
                  },
                  q: {
                    es: "¿Qué es un oasis?",
                    en: "What is an oasis?"
                  },
                  options: {
                    es: [
                      "Un lugar verde con agua en el desierto",
                      "Una montaña grande",
                      "Un país frío",
                      "Un animal"
                    ],
                    en: [
                      "A green place with water in the desert",
                      "A big mountain",
                      "A cold land",
                      "An animal"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "En un oasis crecen palmeras porque allí sale agua de la tierra.",
                    en: "Palm trees grow in an oasis because water comes up from the ground."
                  }
                },
                {
                  type: "quiz",
                  q: {
                    es: "¿Por qué Karim está tranquilo?",
                    en: "Why does Karim stay calm?"
                  },
                  options: {
                    es: [
                      "Los camellos aguantan mucho sin agua",
                      "Tiene miedo",
                      "Está cansado",
                      "Hace frío"
                    ],
                    en: [
                      "Camels last long without water",
                      "He is afraid",
                      "He is tired",
                      "It is cold"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "Por la tarde, Karim ve algo verde. ¡Son palmeras! Entre ellas brilla un pequeño lago. Karim encontró el oasis. Bebe a grandes tragos y descansa a la sombra de los árboles.",
                en: "In the evening Karim sees something green. They are palm trees! Between them a small lake glitters. Karim has found the oasis. He drinks in big gulps and rests in the shade of the trees."
              },
              easy: {
                es: "Por la tarde Karim ve palmeras. Allí hay agua. Karim bebe mucho. Descansa a la sombra.",
                en: "In the evening Karim sees palm trees. There is water. Karim drinks a lot. He rests in the shade."
              },
              tasks: [
                {
                  type: "syllable",
                  q: {
                    es: "Junta las sílabas.",
                    en: "Put the syllables together."
                  },
                  options: {
                    es: [
                      "Ca-me-llo",
                      "Me-llo-ca",
                      "Llo-ca-me",
                      "Ca-llo-me"
                    ],
                    en: [
                      "Ca-mel",
                      "Mel-ca",
                      "Cam-le",
                      "Ca-lem"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "retell",
                  q: {
                    es: "¿Qué pasa al final?",
                    en: "What happens at the end?"
                  },
                  options: {
                    es: [
                      "Karim encuentra agua en el oasis",
                      "Karim se pierde",
                      "Nieva",
                      "Karim sale volando"
                    ],
                    en: [
                      "Karim finds water at the oasis",
                      "Karim gets lost",
                      "It snows",
                      "Karim flies away"
                    ]
                  },
                  answer: 0
                }
              ]
            }
          ]
        },
        {
          id: "desert-2",
          level: 2,
          title: {
            es: "Gusti y el tesoro del desierto",
            en: "Gusti and the Desert Treasure"
          },
          intro: {
            es: "Gusti busca en la arena con el detector de metales.",
            en: "Gusti searches the sand with the metal detector."
          },
          sections: [
            {
              text: {
                es: "Gusti le pidió prestado a Antón su detector de metales, Pitín. En el desierto suena distinto que en la playa. —Aquí seguro hay algo antiguo —dice Gusti. Karim, el camello, lo sigue curioso. La arena está tibia y suave.",
                en: "Gusti has borrowed Anton's metal detector Pieper. In the desert it beeps differently than on the beach. 'Something old must be here,' says Gusti. Karim the camel trots curiously behind. The sand is warm and soft."
              },
              easy: {
                es: "Gusti tiene el detector de metales Pitín. Busca en la arena. Karim, el camello, va con él.",
                en: "Gusti has the metal detector Pieper. He searches in the sand. Karim the camel comes along."
              },
              tasks: [
                {
                  type: "missing",
                  q: {
                    es: "¿Qué letra falta? DES_ERTO",
                    en: "Which letter is missing? DES_RT"
                  },
                  options: {
                    es: [
                      "I",
                      "A",
                      "O",
                      "U"
                    ],
                    en: [
                      "E",
                      "A",
                      "O",
                      "I"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "Dilo despacio: de-sier-to.",
                    en: "Des-e-rt."
                  }
                },
                {
                  type: "quiz",
                  q: {
                    es: "¿De quién es el detector de metales que tiene Gusti?",
                    en: "Whose metal detector does Gusti have?"
                  },
                  options: {
                    es: [
                      "De Antón",
                      "De Lotti",
                      "De Dana",
                      "De Hanna"
                    ],
                    en: [
                      "Anton's",
                      "Lotti's",
                      "Dana's",
                      "Hannah's"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "Pitín suena a veces bajito y a veces más fuerte. Busca el lugar donde suena más fuerte: allí está el tesoro enterrado en la arena.",
                en: "Pieper beeps soft, then louder. Find the spot where it beeps loudest – that is where the treasure is buried in the sand."
              },
              tasks: [
                {
                  type: "detector",
                  q: {
                    es: "¿Dónde suena más fuerte Pitín? ¡Toca y busca!",
                    en: "Where does Pieper beep loudest? Tap and search!"
                  },
                  options: {
                    es: [
                      "🌵 Cactus",
                      "🐊 Lagarto",
                      "⛰️ Duna",
                      "🫙 Vasija de barro",
                      "🪨 Roca",
                      "🌴 Palmera"
                    ],
                    en: [
                      "🌵 Cactus",
                      "🐊 Lizard",
                      "⛰️ Dune",
                      "🫙 Clay jar",
                      "🪨 Rock",
                      "🌴 Palm"
                    ]
                  },
                  answer: 3,
                  fact: {
                    es: "En la vasija de barro había monedas antiquísimas, ¡de más de mil años!",
                    en: "The clay jar held ancient coins – over a thousand years old!"
                  }
                }
              ]
            },
            {
              text: {
                es: "En la vasija brillan monedas antiquísimas. —¡Guau, deben ser muy viejas! —susurra Gusti. Con cuidado las vuelve a dejar y se acuerda del lugar. Hallazgos así deben ir a un museo para que todos puedan admirarlos.",
                en: "Ancient coins glitter in the clay jar. 'Wow, these must be very old!' Gusti whispers. Carefully he puts them back and remembers the spot. Finds like these belong in a museum, so everyone can admire them."
              },
              easy: {
                es: "En la vasija hay monedas viejas. Gusti se asombra. Hallazgos así van a un museo.",
                en: "In the jar are old coins. Gusti marvels. Such finds belong in a museum."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Adónde van los hallazgos muy antiguos?",
                    en: "Where do very old finds belong?"
                  },
                  options: {
                    es: [
                      "A un museo",
                      "A la basura",
                      "Al agua",
                      "Al bolsillo para siempre"
                    ],
                    en: [
                      "In a museum",
                      "In the bin",
                      "In the water",
                      "In your pocket forever"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "Las personas que desentierran cosas antiguas se llaman arqueólogos.",
                    en: "People who dig up old things are called archaeologists."
                  }
                },
                {
                  type: "retell",
                  q: {
                    es: "¿Qué hizo Gusti con las monedas?",
                    en: "What did Gusti do with the coins?"
                  },
                  options: {
                    es: [
                      "Las dejó con cuidado y recordó el lugar",
                      "Se las llevó todas",
                      "Las tiró al agua",
                      "Las regaló"
                    ],
                    en: [
                      "Put them back and remembered the spot",
                      "Took them all",
                      "Threw them in water",
                      "Gave them away"
                    ]
                  },
                  answer: 0
                }
              ]
            }
          ]
        },
        {
          id: "desert-3",
          level: 3,
          title: {
            es: "El zorrito del desierto de Lotti",
            en: "Lotti's Little Desert Fox"
          },
          intro: {
            es: "Lotti conoce a un fénec de orejas enormes.",
            en: "Lotti meets a fennec fox with huge ears."
          },
          sections: [
            {
              text: {
                es: "Al atardecer, Lotti descubre un animal diminuto con orejas enormes. Es un fénec, un zorro del desierto. Sus orejas son casi tan grandes como su cabeza. Lotti se queda muy quieta para no asustarlo.",
                en: "At dusk Lotti spots a tiny animal with huge ears. It is a fennec, a desert fox. Its ears are almost as big as its head. Lotti stays very still so as not to scare it."
              },
              easy: {
                es: "Lotti ve un animal pequeño. Tiene orejas enormes. Es un zorro del desierto. Lotti está muy quieta.",
                en: "Lotti sees a small animal. It has huge ears. It is a desert fox. Lotti stays very still."
              },
              tasks: [
                {
                  type: "vocab",
                  word: {
                    es: "fénec",
                    en: "fennec"
                  },
                  q: {
                    es: "¿Qué es un fénec?",
                    en: "What is a fennec?"
                  },
                  options: {
                    es: [
                      "Un zorro pequeño del desierto",
                      "Un oso grande",
                      "Un pájaro",
                      "Un pez"
                    ],
                    en: [
                      "A small desert fox",
                      "A big bear",
                      "A bird",
                      "A fish"
                    ]
                  },
                  answer: 0,
                  fact: {
                    es: "Las orejas grandes ayudan al fénec a refrescarse.",
                    en: "The big ears help the fennec cool down."
                  }
                },
                {
                  type: "wordimage",
                  q: {
                    es: "¿Qué dibujo muestra un zorro?",
                    en: "Which picture shows a fox?"
                  },
                  options: {
                    es: [
                      "🦊",
                      "🐪",
                      "🦅",
                      "🐍"
                    ],
                    en: [
                      "🦊",
                      "🐪",
                      "🦅",
                      "🐍"
                    ]
                  },
                  answer: 0
                }
              ]
            },
            {
              text: {
                es: "¿Por qué el fénec caza solo de noche? De día el desierto es demasiado caliente. En la noche fresca busca escarabajos y semillas. Con sus orejas grandes oye incluso animales bajo la arena. Lotti se despide con la mano, sin hacer ruido.",
                en: "Why does the fennec hunt only at night? In the daytime the desert is too hot. In the cool night it looks for beetles and seeds. With its big ears it can even hear animals under the sand. Lotti waves it a quiet goodbye."
              },
              easy: {
                es: "El fénec caza de noche. De día hace mucho calor. Con las orejas oye animales en la arena. Lotti se despide.",
                en: "The fennec hunts at night. By day it is too hot. With its ears it hears animals in the sand. Lotti waves."
              },
              tasks: [
                {
                  type: "quiz",
                  q: {
                    es: "¿Por qué caza el fénec de noche?",
                    en: "Why does the fennec hunt at night?"
                  },
                  options: {
                    es: [
                      "De día hace demasiado calor",
                      "De noche hay más luz",
                      "No puede dormir",
                      "Le gusta la luna"
                    ],
                    en: [
                      "By day it is too hot",
                      "At night it is brighter",
                      "He cannot sleep",
                      "He likes the moon"
                    ]
                  },
                  answer: 0
                },
                {
                  type: "spellfix",
                  q: {
                    es: "¿Qué palabra está mal escrita?",
                    en: "Which word is spelled wrong?"
                  },
                  options: {
                    es: [
                      "Escaravajo",
                      "Orejas",
                      "Noche",
                      "Arena"
                    ],
                    en: [
                      "Dessert fox",
                      "Ears",
                      "Night",
                      "Sand"
                    ]
                  },
                  answer: 0,
                  hint: {
                    es: "«Escarabajo» se escribe con b y con j.",
                    en: "A sandy place is 'desert' (one s); 'dessert' is the sweet!"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  discover: [
    {
      emoji: "🐋",
      es: "La ballena azul es el animal más grande del mundo: su corazón es tan grande como un carro.",
      en: "The blue whale is the largest animal on Earth – its heart is as big as a car."
    },
    {
      emoji: "🐙",
      es: "Un pulpo tiene tres corazones y sangre azul.",
      en: "An octopus has three hearts and blue blood."
    },
    {
      emoji: "🌍",
      es: "La Tierra da una vuelta sobre sí misma cada día.",
      en: "The Earth spins around once every day."
    },
    {
      emoji: "🐝",
      es: "Las abejas bailan para mostrarles a las demás el camino hacia las flores.",
      en: "Bees dance to show others the way to flowers."
    },
    {
      emoji: "🦒",
      es: "Una jirafa tiene los mismos huesos en el cuello que tú: siete.",
      en: "A giraffe has as many neck bones as you: seven."
    },
    {
      emoji: "🌙",
      es: "En la Luna no hay aire ni viento.",
      en: "There is no air and no wind on the Moon."
    },
    {
      emoji: "🐧",
      es: "Los pingüinos no pueden volar, pero nadan buenísimo.",
      en: "Penguins cannot fly, but they swim brilliantly."
    },
    {
      emoji: "🌳",
      es: "Los árboles fabrican su propio alimento con la luz del sol.",
      en: "Trees make their own food from sunlight."
    },
    {
      emoji: "🦋",
      es: "Las mariposas saborean con las patas.",
      en: "Butterflies taste with their feet."
    },
    {
      emoji: "🐪",
      es: "Los camellos guardan grasa en la joroba, no agua.",
      en: "Camels store fat in their hump, not water."
    },
    {
      emoji: "🦊",
      es: "El zorro del desierto, el fénec, oye con sus orejas enormes a los insectos bajo la arena.",
      en: "The fennec fox hears insects under the sand with its big ears."
    },
    {
      emoji: "🚀",
      es: "Un cohete tiene que ir muy rápido para llegar al espacio.",
      en: "A rocket must be very fast to fly into space."
    },
    {
      emoji: "🦜",
      es: "Algunos loros pueden repetir palabras.",
      en: "Some parrots can copy words."
    },
    {
      emoji: "🔍",
      es: "Con detectores de metales se han encontrado cofres del tesoro enteros.",
      en: "Whole treasure chests have been found with metal detectors."
    }
  ]
};
