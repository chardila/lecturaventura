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
  // @mili-stories

  // @dani-stories

  CONTENT.worlds.push(mili, dani);
})();
