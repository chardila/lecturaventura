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
  // @mili-stories

  // @dani-stories

  CONTENT.worlds.push(mili, dani);
})();
