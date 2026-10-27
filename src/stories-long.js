// Historias largas (series «Mili y Nubi» y «Dani Mala Pata»), en español e inglés.
// Se añaden a CONTENT.worlds; ver docs/superpowers/specs/2026-10-27-historias-largas-design.md
(function () {
  "use strict";

  // Tarea de opción múltiple: q y options son {es, en}; extra añade word/fact (vocab).
  function task(type, q, options, answer, extra) {
    return Object.assign({ type: type, q: q, options: options, answer: answer }, extra || {});
  }

  var mili = {
    id: "mili",
    emoji: "☁️",
    color: "#7cc4ff",
    long: true,
    series: true,
    name: { es: "Mili y Nubi", en: "Millie and Puff" },
    desc: { es: "Una niña y su nubecita traviesa.", en: "A girl and her playful little cloud." },
    unlockStars: 0,
    stories: []
  };
  var dani = {
    id: "dani",
    emoji: "📓",
    color: "#ff9f43",
    long: true,
    series: true,
    name: { es: "Dani Mala Pata", en: "Danny Bad Luck" },
    desc: { es: "El cuaderno de un niño con mala suerte y mucho humor.", en: "The notebook of a boy with bad luck and lots of laughs." },
    unlockStars: 0,
    stories: []
  };

  mili.stories.push({
    id: "mili-1",
    level: 1,
    wpm: 50,
    title: { es: "Nubi llega a casa", en: "Puff Comes Home" },
    intro: {
      es: "Mili encuentra una nubecita en su ventana.",
      en: "Millie finds a little cloud at her window."
    },
    sections: [
      {
        text: {
          es: "Mili abre la ventana de su cuarto. Algo blanco y suave está atascado en el marco. ¡Es una nubecita! Es chiquita, como una bola de algodón. Mili nunca vio una nube tan de cerca. «Hola», dice Mili bajito. La nubecita da un saltito y se esconde detrás de la cortina. Mili se agacha y mira. Dos ojitos redondos brillan en la tela. Mili estira la mano despacito. La nubecita huele a lluvia fresca. «Me llamo Mili. ¿Y tú?», pregunta. La nubecita no habla. Pero se pone de color rosa y hace un sonido suave: puf. «¡Te llamarás Nubi!», dice Mili con una sonrisa.",
          en: "Millie opens the window of her room. Something white and soft is stuck in the frame. It is a little cloud! It is tiny, like a ball of cotton. Millie has never seen a cloud so close. \"Hello,\" says Millie softly. The little cloud gives a hop and hides behind the curtain. Millie bends down and looks. Two round little eyes shine in the cloth. Millie stretches out her hand slowly. The little cloud smells like fresh rain. \"My name is Millie. What is yours?\" she asks. The little cloud does not talk. But it turns pink and makes a soft sound: puff. \"I will call you Puff!\" says Millie with a smile."
        },
        tasks: [
          task("quiz",
            { es: "¿Qué encuentra Mili en su ventana?", en: "What does Millie find at her window?" },
            { es: ["Una nubecita", "Un pajarito", "Una mariposa", "Un globo"], en: ["A little cloud", "A little bird", "A butterfly", "A balloon"] }, 0),
          task("vocab",
            { es: "¿Qué quiere decir «atascado»?", en: "What does \"stuck\" mean?" },
            { es: ["Que no se puede mover", "Que vuela muy alto", "Que está dormido", "Que está limpio"], en: ["Not able to move", "Flying very high", "Fast asleep", "Nice and clean"] }, 0,
            { word: { es: "atascado", en: "stuck" }, fact: { es: "Una puerta puede quedar atascada, y un zapato también.", en: "A door can get stuck, and so can a shoe." } })
        ]
      },
      {
        text: {
          es: "Nubi vuela por todo el cuarto. Pasa sobre la cama, sobre los libros y sobre el osito de Mili. De pronto se pone gris, gris, gris. ¡Plin, plin, plin! Cae una llovizna dentro del cuarto. Las gotas hacen círculos en el piso. Al osito se le mojan las orejas. «¡Ay, mis zapatillas!», dice Mili. Nubi se encoge y mira hacia abajo. Está nerviosa porque todo es nuevo para ella. Mili no se enoja. Quiere ayudar a su nueva amiga. Mili piensa un momento. Cuando ella está nerviosa, mamá le canta una canción. Entonces Mili se sienta en el suelo y canta bajito: «La, la, la, lalá».",
          en: "Puff flies all around the room. It goes over the bed, over the books and over Millie's teddy bear. Suddenly it turns gray, gray, gray. Plink, plink, plink! A light rain falls inside the room. The drops make circles on the floor. The teddy bear gets wet ears. \"Oh, my slippers!\" says Millie. Puff shrinks and looks down. It is nervous because everything is new. Millie is not upset. She wants to help her new friend. Millie thinks for a moment. When she is nervous, Mom sings her a song. So Millie sits on the floor and sings softly: \"La, la, la, lalá.\""
        },
        tasks: [
          task("quiz",
            { es: "¿Por qué llovizna Nubi dentro del cuarto?", en: "Why does Puff make rain in the room?" },
            { es: ["Porque está nerviosa", "Porque tiene sed", "Porque quiere jugar", "Porque hace calor"], en: ["Because it is nervous", "Because it is thirsty", "Because it wants to play", "Because it is hot"] }, 0),
          task("predict",
            { es: "¿Qué crees que pasará cuando Mili cante?", en: "What do you think will happen when Millie sings?" },
            { es: ["Nubi se calmará", "Nubi se irá volando", "Nubi lloverá más", "Nubi se dormirá"], en: ["Puff will calm down", "Puff will fly away", "Puff will rain more", "Puff will fall asleep"] }, 0)
        ]
      },
      {
        text: {
          es: "Nubi deja de llover poco a poco. Se acerca a Mili y se pone blanca otra vez. Luego se hace una bolita sobre sus rodillas. Por la ventana entra un rayito de sol. El sol toca las gotitas del aire. ¡Plas! Aparece un arcoíris pequeño en la pared. Rojo, naranja, amarillo, verde y azul. Mili aplaude. Nubi se vuelve rosa y dibuja un corazón en el aire. «Qué bueno que llegaste, Nubi», dice Mili. Se siente feliz y tranquila. Las dos se quedan mirando los colores. Afuera cantan los pájaros. Esa noche Nubi duerme en la repisa, junto al osito.",
          en: "Puff stops raining, little by little. It comes close to Millie and turns white again. Then it curls into a ball on her knees. A little ray of sun comes in through the window. The sun touches the drops in the air. Pop! A tiny rainbow appears on the wall. Red, orange, yellow, green and blue. Millie claps. Puff turns pink and draws a heart in the air. \"I am so glad you came, Puff,\" says Millie. She feels happy and calm. The two of them watch the colors. Outside, the birds are singing. That night Puff sleeps on the shelf, next to the teddy bear."
        },
        tasks: [
          task("retell",
            { es: "¿Cómo termina la historia?", en: "How does the story end?" },
            { es: ["Mili y Nubi hacen un arcoíris", "Nubi se va de la casa", "Mili guarda a Nubi en una caja", "Empieza a nevar"], en: ["Millie and Puff make a rainbow", "Puff leaves the house", "Millie puts Puff in a box", "It starts to snow"] }, 0),
          task("vocab",
            { es: "¿Qué es un arcoíris?", en: "What is a rainbow?" },
            { es: ["Una cinta de colores en el cielo", "Un tipo de nube gris", "Un animal pequeño", "Una canción"], en: ["A band of colors in the sky", "A kind of gray cloud", "A small animal", "A song"] }, 0,
            { word: { es: "arcoíris", en: "rainbow" }, fact: { es: "Un arcoíris aparece cuando el sol toca las gotas de agua.", en: "A rainbow shows up when sunlight touches drops of water." } })
        ]
      }
    ]
  });
  mili.stories.push({
    id: "mili-2",
    level: 1,
    wpm: 50,
    title: { es: "Nubi va al colegio", en: "Puff Goes to School" },
    intro: {
      es: "Nubi se esconde en la mochila de Mili.",
      en: "Puff hides in Millie's backpack."
    },
    sections: [
      {
        text: {
          es: "Es lunes por la mañana. Mili guarda sus cuadernos en la mochila. De pronto, la mochila se mueve. «¡Nubi!», susurra Mili. Una carita blanca se asoma por el cierre. Nubi quiere ir al colegio. «Está bien, pero no puedes hacer ruido», dice Mili. «Y no puedes llover. Es un secreto». Nubi se pone rosa y dice puf, muy bajito. Mili cierra la mochila despacito y camina rápido por el pasillo. Nubi se queda quieta como una piedra. En la puerta del salón, su amigo Tomás la saluda. «¿Por qué se mueve tu mochila?», pregunta. «Eh… ¡son mis lápices!», dice Mili.",
          en: "It is Monday morning. Millie puts her notebooks in her backpack. Suddenly the backpack moves. \"Puff!\" Millie whispers. A little white face peeks out of the zipper. Puff wants to go to school. \"All right, but you must be quiet,\" says Millie. \"And you cannot make rain. It is a secret.\" Puff turns pink and says puff, very softly. Millie closes the backpack slowly and walks fast down the hall. Puff stays still as a stone. At the classroom door, her friend Tommy says hello. \"Why is your backpack moving?\" he asks. \"Um... it is my pencils!\" says Millie."
        },
        tasks: [
          task("quiz",
            { es: "¿Dónde se esconde Nubi?", en: "Where does Puff hide?" },
            { es: ["En la mochila", "En el armario", "Debajo de la cama", "En un zapato"], en: ["In the backpack", "In the closet", "Under the bed", "In a shoe"] }, 0),
          task("vocab",
            { es: "¿Qué quiere decir «susurra»?", en: "What does \"whispers\" mean?" },
            { es: ["Habla muy bajito", "Grita muy fuerte", "Canta una canción", "Se ríe mucho"], en: ["Talks very softly", "Shouts very loud", "Sings a song", "Laughs a lot"] }, 0,
            { word: { es: "susurra", en: "whispers" }, fact: { es: "Susurrar sirve para contar un secreto.", en: "We whisper to share a secret." } })
        ]
      },
      {
        text: {
          es: "En la clase, Mili se sienta y abre la mochila un poquito. Nubi mira todo con ojos grandes. La profe Luz escribe en la pizarra. Nubi quiere ayudar. Sale de la mochila y se hace un lápiz largo y blanco. Después se hace un borrador. Después un globo redondo. Tomás se tapa la boca para no reírse. Mili se pone roja. Le hace señas a Nubi: «¡Quieta!». Pero Nubi no la ve. Nubi se divierte tanto que se hace una jirafa con el cuello largo. ¡Casi toca el techo! Ahora toda la clase mira hacia arriba.",
          en: "In class, Millie sits down and opens her backpack a little. Puff looks around with big eyes. Miss Lucy writes on the board. Puff wants to help. It climbs out of the backpack and becomes a long white pencil. Then it becomes an eraser. Then a round balloon. Tommy covers his mouth so he will not laugh. Millie turns red. She signals to Puff: \"Stay still!\" But Puff does not see her. Puff is having so much fun. It becomes a giraffe with a long neck. It almost touches the ceiling! Now the whole class is looking up."
        },
        tasks: [
          task("quiz",
            { es: "¿En qué cosas se convierte Nubi?", en: "What things does Puff turn into?" },
            { es: ["Un lápiz, un borrador y un globo", "Una pelota, un libro y una silla", "Un gato, un perro y un pájaro", "Una flor, un árbol y una casa"], en: ["A pencil, an eraser and a balloon", "A ball, a book and a chair", "A cat, a dog and a bird", "A flower, a tree and a house"] }, 0),
          task("predict",
            { es: "¿Qué crees que hará la profe Luz?", en: "What do you think Miss Lucy will do?" },
            { es: ["Mirará a Nubi con sorpresa", "Se irá corriendo", "Apagará las luces", "Pondrá una tarea enorme"], en: ["She will look at Puff in surprise", "She will run away", "She will turn off the lights", "She will give a huge homework"] }, 0)
        ]
      },
      {
        text: {
          es: "La profe Luz deja de escribir. Mira a Nubi. Mili baja la cabeza. «Perdón, profe. Es mi amiga Nubi», dice con voz chiquita. La profe sonríe. «Qué suerte. Hoy hablamos de las nubes en ciencias», dice. «¿Nos ayuda Nubi?» Mili respira aliviada. Nubi se pone rosa y sube al techo. Se pone gris, pero solo un poquito. Cae una lluvia fina sobre la planta de la ventana. La planta se estira como si dijera gracias. Toda la clase aplaude. Nubi hace un corazón en el aire. Después Mili y Tomás le dan las gracias. En la mochila de Mili siempre habrá un lugar para Nubi.",
          en: "Miss Lucy stops writing. She looks at Puff. Millie lowers her head. \"Sorry, Miss. This is my friend Puff,\" she says in a tiny voice. The teacher smiles. \"What luck. Today we talk about clouds in science,\" she says. \"Can Puff help us?\" Millie breathes, relieved. Puff turns pink and floats up to the ceiling. It turns gray, but only a little. A fine rain falls on the plant by the window. The plant stretches as if to say thank you. The whole class claps. Puff makes a heart in the air. Later, Millie and Tommy thank Puff. There will always be a place for Puff in Millie's backpack."
        },
        tasks: [
          task("retell",
            { es: "¿Cómo termina la historia?", en: "How does the story end?" },
            { es: ["La profe deja que Nubi ayude en ciencias", "La profe se enoja con Mili", "Nubi se escapa por la ventana", "Todos se van a casa"], en: ["The teacher lets Puff help in science", "The teacher gets upset with Millie", "Puff escapes through the window", "Everyone goes home"] }, 0),
          task("vocab",
            { es: "¿Qué quiere decir «aliviada»?", en: "What does \"relieved\" mean?" },
            { es: ["Tranquila porque ya pasó la preocupación", "Muy cansada", "Con mucho hambre", "Enojada"], en: ["Calm because the worry is over", "Very tired", "Very hungry", "Angry"] }, 0,
            { word: { es: "aliviada", en: "relieved" }, fact: { es: "Cuando se va una preocupación, se siente alivio.", en: "When a worry goes away, we feel relief." } })
        ]
      }
    ]
  });
  mili.stories.push({
    id: "mili-3",
    level: 1,
    wpm: 50,
    title: { es: "El regalo de Tomás", en: "Tommy's Present" },
    intro: {
      es: "Nubi quiere hacerle un regalo muy especial a Tomás.",
      en: "Puff wants to give Tommy a very special present."
    },
    sections: [
      {
        text: {
          es: "Hoy es el cumpleaños de Tomás. Hace mucho calor. Mili lleva un paquete con un lazo rojo. Nubi viaja en su mochila, bien calladita. En el patio de Tomás hay globos, música y un pastel grande. Los niños juegan con una manguera. Tomás lleva una corona de papel y se ve muy contento. Mili mira el paquete y sonríe. Pero Nubi está seria. Mira a todos los niños. Cada uno trajo algo para Tomás. Ella no tiene un regalo. Se pone un poco gris y suspira: puf. Mili le da un abrazo suave. «No te preocupes, Nubi», dice Mili. «Seguro se te ocurre algo bonito».",
          en: "Today is Tommy's birthday. It is very hot. Millie carries a package with a red bow. Puff rides in her backpack, very quiet. In Tommy's yard there are balloons, music and a big cake. The kids play with a hose. Tommy wears a paper crown and looks very happy. Millie looks at the package and smiles. But Puff looks serious. It watches all the kids. Each one brought something for Tommy. It does not have a present. It turns a little gray and sighs: puff. Millie gives it a soft hug. \"Do not worry, Puff,\" says Millie. \"You will think of something nice.\""
        },
        tasks: [
          task("quiz",
            { es: "¿Por qué está seria Nubi?", en: "Why does Puff look serious?" },
            { es: ["Porque no tiene un regalo", "Porque tiene sueño", "Porque no le gusta la música", "Porque quiere irse a casa"], en: ["Because it has no present", "Because it is sleepy", "Because it does not like the music", "Because it wants to go home"] }, 0),
          task("vocab",
            { es: "¿Qué quiere decir «manguera»?", en: "What does \"hose\" mean?" },
            { es: ["Un tubo largo para echar agua", "Un tipo de globo", "Una bolsa de dulces", "Un juego de mesa"], en: ["A long tube that sprays water", "A kind of balloon", "A bag of candy", "A board game"] }, 0,
            { word: { es: "manguera", en: "hose" }, fact: { es: "Con una manguera se riegan las plantas y se juega en verano.", en: "A hose waters the plants and is fun in summer." } })
        ]
      },
      {
        text: {
          es: "Llega la hora del pastel. Todos cantan el cumpleaños feliz. Nubi vuela sobre la mesa y mira el pastel. ¡Ya sabe qué hacer! Se pone muy blanca y muy fría. Sopla con suavidad: fuuu. Sobre el pastel empiezan a caer copitos de nieve. Son rojos, azules, amarillos y verdes. Brillan como confeti. Mili abre mucho los ojos. Nubi sonríe con sus ojitos. Nadie dice nada. Los niños miran con la boca abierta. Tomás se queda quieto un momento. Luego sonríe de oreja a oreja. «Es nieve de colores», susurra. «¡En pleno verano!»",
          en: "It is time for the cake. Everyone sings happy birthday. Puff flies over the table and looks at the cake. Now it knows what to do! It turns very white and very cold. It blows gently: whoo. Little snowflakes begin to fall on the cake. They are red, blue, yellow and green. They shine like confetti. Millie opens her eyes wide. Puff smiles with its little eyes. Nobody says a word. The kids watch with open mouths. Tommy stands still for a moment. Then he smiles from ear to ear. \"It is colorful snow,\" he whispers. \"In the middle of summer!\""
        },
        tasks: [
          task("quiz",
            { es: "¿Qué cae sobre el pastel?", en: "What falls on the cake?" },
            { es: ["Copitos de nieve de colores", "Gotas de lluvia", "Hojas secas", "Migas de pan"], en: ["Colorful snowflakes", "Raindrops", "Dry leaves", "Bread crumbs"] }, 0),
          task("predict",
            { es: "¿Qué crees que hará Tomás con la nieve?", en: "What do you think Tommy will do with the snow?" },
            { es: ["Pedirá un deseo", "Se pondrá a llorar", "Llamará a su mamá", "Guardará la nieve en el bolsillo"], en: ["He will make a wish", "He will start to cry", "He will call his mom", "He will keep the snow in his pocket"] }, 0)
        ]
      },
      {
        text: {
          es: "Tomás cierra los ojos y pide un deseo. Después sopla las velas. ¡Plaf! La nieve se vuelve helado de fresa, de limón y de uva. Los niños aplauden y gritan de alegría. Cada uno recibe un pedazo de pastel con helado de colores. Hace calor, pero nadie tiene calor. La abuela Rosa también prueba el helado. «Qué sabor tan raro y tan rico», dice. Tomás abraza a Nubi y le da las gracias. «Es el mejor regalo del mundo», dice. Nubi se pone rosa y hace un corazón. Mili ríe. Su paquete con lazo rojo era un libro. Pero esta tarde el regalo más bonito fue Nubi. Mili y Nubi vuelven a casa felices, con las mejillas frías.",
          en: "Tommy closes his eyes and makes a wish. Then he blows out the candles. Poof! The snow turns into strawberry, lemon and grape ice cream. The kids clap and cheer with joy. Each one gets a piece of cake with colorful ice cream. It is hot, but nobody feels hot. Grandma Rosa tries the ice cream too. \"What a strange and tasty flavor,\" she says. Tommy hugs Puff and thanks it. \"It is the best present in the world,\" he says. Puff turns pink and makes a heart. Millie laughs. Her package with the red bow was a book. But this afternoon the nicest present was Puff. Millie and Puff walk home happy, with cold cheeks."
        },
        tasks: [
          task("retell",
            { es: "¿Cómo termina la historia?", en: "How does the story end?" },
            { es: ["La nieve se vuelve helado y todos lo disfrutan", "El pastel se derrite y se pierde", "Nubi se va sola a su casa", "Tomás se enoja con Mili"], en: ["The snow turns into ice cream and everyone enjoys it", "The cake melts and is lost", "Puff goes home alone", "Tommy gets upset with Millie"] }, 0),
          task("vocab",
            { es: "¿Qué quiere decir «deseo»?", en: "What does \"wish\" mean?" },
            { es: ["Algo que quieres que pase", "Un tipo de pastel", "Un juego de cartas", "Un baile"], en: ["Something you hope will happen", "A kind of cake", "A card game", "A dance"] }, 0,
            { word: { es: "deseo", en: "wish" }, fact: { es: "Al soplar las velas de cumpleaños se pide un deseo.", en: "People make a wish when they blow out birthday candles." } })
        ]
      }
    ]
  });
  // @mili-stories

  // @dani-stories

  CONTENT.worlds.push(mili, dani);
})();
