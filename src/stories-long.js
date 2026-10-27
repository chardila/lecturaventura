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

  dani.stories.push({
    id: "dani-1",
    level: 2,
    wpm: 100,
    title: { es: "El truco de magia", en: "The Magic Trick" },
    intro: {
      es: "Dani y su perro Croqueta se apuntan al concurso de talentos.",
      en: "Danny and his dog Crouton sign up for the talent show."
    },
    sections: [
      {
        text: {
          es: "Cuaderno de Dani. Lunes. Hoy me pasó algo grandioso. Bueno, casi grandioso. Mi profe dijo que el viernes habrá un concurso de talentos en el colegio. ¡Y yo me apunté! Voy a hacer un truco de magia. Se llama «El conejo que no está». Es muy fácil. Pongo un conejo de peluche en un sombrero. Digo las palabras mágicas. Y el conejo desaparece. Lo ensayé en mi cuarto con mi hermanita Lola. Ella tiene cuatro años y lo ve todo. «Dani, el conejo está en tu manga», me dijo. Qué mala suerte. Pero no importa. Tengo cuatro días para mejorar el truco. Y tengo a Croqueta de ayudante. Croqueta es mi perro. Es grande, marrón y muy peludo. Nunca me hace caso, pero me quiere muchísimo. Mamá firmó mi permiso. Papá me prestó su sombrero de copa, que es del tamaño de un balde. Está un poco abollado, pero tiene mucha clase.",
          en: "Danny's notebook. Monday. Something great happened to me today. Well, almost great. My teacher said there will be a talent show at school on Friday. And I signed up! I am going to do a magic trick. It is called \"The Rabbit That Is Not Here.\" It is very easy. I put a stuffed rabbit in a hat. I say the magic words. And the rabbit disappears. I practiced it in my room with my little sister Lola. She is four years old and she sees everything. \"Danny, the rabbit is in your sleeve,\" she told me. What bad luck. But it does not matter. I have four days to make the trick better. And I have Crouton as my helper. Crouton is my dog. He is big, brown and very fluffy. He never listens to me, but he loves me a lot. Mom signed my permission slip. Dad lent me his top hat, which is the size of a bucket. It is a little dented, but it has a lot of class."
        },
        tasks: [
          task("quiz",
            { es: "¿Qué truco quiere hacer Dani?", en: "What trick does Danny want to do?" },
            { es: ["Hacer desaparecer un conejo de peluche", "Sacar una moneda de la oreja", "Volar con una capa", "Adivinar un número"], en: ["Make a stuffed rabbit disappear", "Pull a coin from an ear", "Fly with a cape", "Guess a number"] }, 0),
          task("vocab",
            { es: "¿Qué quiere decir «ayudante»?", en: "What does \"helper\" mean?" },
            { es: ["Alguien que ayuda", "Alguien que duerme", "Alguien que grita", "Alguien que se esconde"], en: ["Someone who helps", "Someone who sleeps", "Someone who shouts", "Someone who hides"] }, 0,
            { word: { es: "ayudante", en: "helper" }, fact: { es: "Los magos casi siempre tienen un ayudante en el escenario.", en: "Magicians almost always have a helper on stage." } })
        ]
      },
      {
        text: {
          es: "Martes. Ensayo número uno. Le puse a Croqueta una capa hecha con una cortina. Se veía muy elegante, hasta que se la comió. Ensayo número dos. Croqueta no quiso sentarse. Le ofrecí una galleta, pero se la comió y se fue. Quería perseguir una mosca. La mosca ganó. Ensayo número tres. Mi amigo Beto vino a mirar. Beto es muy serio y casi nunca se ríe. Pero esta vez se rió tanto que se cayó de la silla. «Dani, tu truco es un desastre», dijo. «Pero es un desastre muy divertido». Yo no sabía si enojarme o reírme. Lola aplaudía desde la puerta. «¡Otra vez, otra vez!», gritaba. Esa noche escribí en mi cuaderno: lo que puede salir mal, a veces sale peor. Beto dice que haga el truco con los ojos cerrados, así yo tampoco veré el desastre.",
          en: "Tuesday. Practice number one. I put a cape on Crouton made from a curtain. He looked very fancy, until he ate it. Practice number two. Crouton did not want to sit. I offered him a cookie, but he ate it and left. He wanted to chase a fly. The fly won. Practice number three. My friend Beto came to watch. Beto is very serious and almost never laughs. But this time he laughed so hard that he fell off his chair. \"Danny, your trick is a disaster,\" he said. \"But it is a very funny disaster.\" I did not know whether to be mad or to laugh. Lola was clapping at the door. \"Again, again!\" she shouted. That night I wrote in my notebook: what can go wrong sometimes goes even wronger. Beto says I should do the trick with my eyes closed, so I will not see the disaster either."
        },
        tasks: [
          task("quiz",
            { es: "¿Qué le pasa a la capa de Croqueta?", en: "What happens to Crouton's cape?" },
            { es: ["Se la come", "Se la regala a Lola", "Se le pierde en el parque", "Se la lleva el viento"], en: ["He eats it", "He gives it to Lola", "He loses it in the park", "The wind takes it"] }, 0),
          task("predict",
            { es: "¿Qué crees que pasará el viernes en el concurso?", en: "What do you think will happen on Friday at the show?" },
            { es: ["Algo saldrá mal, pero será divertido", "Todo saldrá perfecto sin ningún error", "El concurso se cancelará", "Dani se quedará dormido"], en: ["Something will go wrong, but it will be funny", "Everything will be perfect with no mistakes", "The show will be canceled", "Danny will fall asleep"] }, 0)
        ]
      },
      {
        text: {
          es: "Jueves. Última práctica. Todo salió igual de mal que siempre. El conejo se cayó, Croqueta ladró y el sombrero terminó en el balde de la basura. Me senté en el suelo y suspiré. «No voy a ganar», le dije a Croqueta. Croqueta puso la cabeza sobre mis rodillas. Lola entró en pijama con su osito. «Dani, ¿por qué estás triste?», preguntó. «Porque mi truco siempre sale mal». Ella pensó un ratito, como piensan las niñas de cuatro años. «Los magos de la tele se equivocan un montón», dijo. «Pero siempre sonríen. Y entonces nadie se da cuenta». Me quedé mirándola. Entonces se me ocurrió algo. Si me equivocaba, iba a sonreír. Le di las gracias y le dije que era mi asistente de magia. Lola se puso tan contenta que hizo tres piruetas. Esa Lola sabe más de lo que parece.",
          en: "Thursday. Last practice. Everything went as wrong as always. The rabbit fell, Crouton barked and the hat ended up in the trash can. I sat on the floor and sighed. \"I am not going to win,\" I told Crouton. Crouton put his head on my knees. Lola came in wearing pajamas, holding her teddy bear. \"Danny, why are you sad?\" she asked. \"Because my trick always goes wrong.\" She thought for a little while, the way four-year-olds think. \"The magicians on TV make mistakes all the time,\" she said. \"But they always smile. And then nobody notices.\" I just stared at her. Then I had an idea. If I made a mistake, I would smile. I thanked her and told her she was my magic assistant. Lola was so happy that she did three twirls. That Lola knows more than she seems to."
        },
        tasks: [
          task("quiz",
            { es: "¿Qué consejo le da Lola a Dani?", en: "What advice does Lola give Danny?" },
            { es: ["Sonreír aunque algo salga mal", "Rendirse y no ir al concurso", "Practicar con los ojos cerrados", "Cambiar de truco"], en: ["Smile even if something goes wrong", "Give up and skip the show", "Practice with his eyes closed", "Change his trick"] }, 0)
        ]
      },
      {
        text: {
          es: "Viernes. El gran día. Mi estómago hacía piruetas. En el auditorio había muchos niños, maestros y papás. Un niño tocó la flauta. Una niña bailó con una pandereta. Otro se disfrazó de robot. Todos lo hicieron muy bien y el público aplaudió fuerte. Cada aplauso me ponía más nervioso. Yo miraba mis manos y estaban sudando. Croqueta estaba conmigo detrás de la cortina, moviendo la cola. Beto me dio una palmada en la espalda. «Tú puedes», dijo. «Aunque no sé cómo». Lola estaba sentada en la primera fila con mamá. Me saludó con las dos manos y me mandó un beso. Tomé aire, abracé a Croqueta y casi me olvido del conejo. Y entonces dijeron mi nombre por el micrófono: «¡Dani Torres y su ayudante Croqueta!»",
          en: "Friday. The big day. My stomach was doing flips. In the auditorium there were lots of kids, teachers and parents. One boy played the flute. One girl danced with a tambourine. Another boy dressed up as a robot. They all did very well and the audience clapped loudly. Every clap made me more nervous. I looked at my hands and they were sweaty. Crouton was with me behind the curtain, wagging his tail. Beto gave me a pat on the back. \"You can do it,\" he said. \"Though I do not know how.\" Lola was sitting in the front row with Mom. She waved at me with both hands and blew me a kiss. I took a breath, hugged Crouton and almost forgot the rabbit. And then they said my name on the microphone: \"Danny Torres and his helper Crouton!\""
        },
        tasks: [
          task("vocab",
            { es: "¿Qué quiere decir «auditorio»?", en: "What does \"auditorium\" mean?" },
            { es: ["Un salón grande con escenario", "Una cocina", "Un jardín", "Un autobús"], en: ["A big room with a stage", "A kitchen", "A garden", "A bus"] }, 0,
            { word: { es: "auditorio", en: "auditorium" }, fact: { es: "En un auditorio se hacen obras de teatro y conciertos.", en: "Plays and concerts happen in an auditorium." } }),
          task("quiz",
            { es: "¿Quién saluda a Dani con las dos manos?", en: "Who waves at Danny with both hands?" },
            { es: ["Lola", "Beto", "El director", "Croqueta"], en: ["Lola", "Beto", "The principal", "Crouton"] }, 0)
        ]
      },
      {
        text: {
          es: "Salí al escenario con las rodillas temblando como gelatina. Las luces eran muy fuertes. Me acordé de Lola y sonreí. Puse el sombrero sobre la mesa. Levanté mi varita. «¡Abracadabra, pata de cabra!», grité. Metí el conejo de peluche en el sombrero y di tres golpecitos con la varita. Todos me miraban sin parpadear. Pero, ¡plaf!, la mesa se tambaleó. El sombrero cayó al piso y empezó a rodar. Croqueta pensó que era un juego. ¡Salió corriendo detrás del sombrero! Yo corrí detrás de Croqueta. Croqueta corrió alrededor de la mesa. Lola gritó: «¡Dani, el conejo vuela!». Yo me tropecé con mi capa. El conejo salió volando por el aire. Dio una vuelta y cayó en la cabeza del director. Todo el auditorio se quedó en silencio. Y de repente… ¡explotó de risa!",
          en: "I walked onto the stage with my knees shaking like jelly. The lights were very bright. I remembered Lola and I smiled. I put the hat on the table. I raised my wand. \"Abracadabra, hocus-pocus!\" I shouted. I put the stuffed rabbit in the hat and tapped it three times with my wand. Everybody watched me without blinking. But, splat, the table wobbled. The hat fell to the floor and started to roll. Crouton thought it was a game. He ran after the hat! I ran after Crouton. Crouton ran around the table. Lola yelled: \"Danny, the rabbit is flying!\" I tripped on my cape. The rabbit flew through the air. It did a spin and landed on the principal's head. The whole auditorium went quiet. And suddenly... it burst out laughing!"
        },
        tasks: [
          task("quiz",
            { es: "¿Dónde cae el conejo de peluche?", en: "Where does the stuffed rabbit land?" },
            { es: ["En la cabeza del director", "En el regazo de Lola", "Dentro del sombrero", "Sobre la mesa"], en: ["On the principal's head", "In Lola's lap", "Inside the hat", "On the table"] }, 0),
          task("sentence",
            { es: "Pon la oración en el orden correcto.", en: "Put the sentence in the right order." },
            { es: ["Croqueta salió corriendo detrás del sombrero.", "Sombrero del detrás Croqueta corriendo salió.", "Corriendo salió sombrero Croqueta detrás del.", "Detrás salió Croqueta del corriendo sombrero."], en: ["Crouton ran after the hat.", "Hat the after ran Crouton.", "After Crouton hat the ran.", "Ran hat Crouton the after."] }, 0)
        ]
      },
      {
        text: {
          es: "Me quería esconder debajo de la alfombra. Sentí las orejas rojas como tomates. Pero Croqueta volvió con el sombrero en la boca. Se sentó frente a mí y levantó la pata. Parecía decir: «¡Hice mi parte!». Entonces hice una reverencia. Croqueta ladró e hizo una reverencia también, o algo parecido. El público se puso de pie y aplaudió. Mamá lloraba de risa. Papá filmaba todo con el celular, aunque lo tenía al revés. Hasta Beto se rió. El director me devolvió el conejo. «Es el mejor truco que he visto», dijo. «¡El conejo sí que desapareció… en mi cabeza!». Ganamos el primer premio: un diploma y una bolsa de galletas. Croqueta se comió las galletas y también el diploma, pero eso se lo cuento otro día. Cuaderno de Dani: mala suerte, diez. Diversión, cien.",
          en: "I wanted to hide under the rug. My ears felt red as tomatoes. But Crouton came back with the hat in his mouth. He sat in front of me and raised his paw. He seemed to say: \"I did my part!\" So I took a bow. Crouton barked and took a bow too, or something like it. The audience stood up and clapped. Mom was crying with laughter. Dad filmed everything with his phone, although it was upside down. Even Beto laughed. The principal gave me back the rabbit. \"This is the best trick I have ever seen,\" he said. \"The rabbit really did disappear... on my head!\" We won first prize: a certificate and a bag of cookies. Crouton ate the cookies and also the certificate, but I will tell you about that another day. Danny's notebook: bad luck, ten. Fun, one hundred."
        },
        tasks: [
          task("retell",
            { es: "¿Cómo termina la historia?", en: "How does the story end?" },
            { es: ["Dani y Croqueta ganan el primer premio", "El concurso se cancela", "Dani se va llorando", "Croqueta se pierde"], en: ["Danny and Crouton win first prize", "The show is canceled", "Danny leaves crying", "Crouton gets lost"] }, 0),
          task("vocab",
            { es: "¿Qué es una «reverencia»?", en: "What is a \"bow\"?" },
            { es: ["Inclinarse hacia delante para saludar", "Un salto muy alto", "Una canción corta", "Una mala cara"], en: ["Leaning forward to say thanks", "A very high jump", "A short song", "A frown"] }, 0,
            { word: { es: "reverencia", en: "bow" }, fact: { es: "Los artistas hacen una reverencia al final para dar las gracias.", en: "Performers take a bow at the end to say thank you." } })
        ]
      }
    ]
  });
  dani.stories.push({
    id: "dani-2",
    level: 2,
    wpm: 100,
    title: { es: "El hámster del salón", en: "The Class Hamster" },
    intro: {
      es: "Dani cuida a Bigotes el fin de semana, pero Bigotes desaparece.",
      en: "Danny looks after Whiskers for the weekend, but Whiskers disappears."
    },
    sections: [
      {
        text: {
          es: "Cuaderno de Dani. Viernes. Hoy me eligieron para algo importante. La profe Marta me dio a Bigotes, el hámster de la clase. Tengo que cuidarlo todo el fin de semana. Bigotes es pequeñito, dorado y con las mejillas siempre llenas. La profe me dio una lista de reglas. Uno: darle de comer dos veces al día. Dos: ponerle agua fresca. Tres: cerrar bien la puerta de la jaula. Yo dije que sí a todo. Llevé la jaula a casa con mucho cuidado, como si fuera una torta de cumpleaños. Papá dijo que los hámsteres son pequeños, pero muy listos. Puse agua y comida en mi escritorio y lo miré un buen rato. Bigotes se lavó la carita con sus patitas. Qué ternura. Lola se asomó a mirar. «¡Hola, Bigotes!», le dijo. Croqueta también miró. Movió la cola tan fuerte que tiró una planta.",
          en: "Danny's notebook. Friday. Today they picked me for something important. Miss Marta gave me Whiskers, the class hamster. I have to take care of him all weekend. Whiskers is tiny, golden and always has full cheeks. Miss Marta gave me a list of rules. One: feed him twice a day. Two: give him fresh water. Three: close the cage door tight. I said yes to everything. I carried the cage home very carefully, as if it were a birthday cake. Dad said hamsters are small, but very clever. I put water and food on my desk and watched him for a long time. Whiskers washed his face with his tiny paws. So cute. Lola came to look. \"Hello, Whiskers!\" she said. Crouton looked too. He wagged his tail so hard that he knocked over a plant."
        },
        tasks: [
          task("quiz",
            { es: "¿Quién es Bigotes?", en: "Who is Whiskers?" },
            { es: ["El hámster de la clase", "El gato del vecino", "Un pez de colores", "Un conejo"], en: ["The class hamster", "The neighbor's cat", "A goldfish", "A rabbit"] }, 0),
          task("vocab",
            { es: "¿Qué quiere decir «jaula»?", en: "What does \"cage\" mean?" },
            { es: ["Una casita con rejas para un animal", "Una caja de zapatos", "Un cuarto grande", "Una canasta de frutas"], en: ["A little house with bars for an animal", "A shoe box", "A big room", "A fruit basket"] }, 0,
            { word: { es: "jaula", en: "cage" }, fact: { es: "Los hámsteres duermen de día y juegan de noche.", en: "Hamsters sleep in the day and play at night." } })
        ]
      },
      {
        text: {
          es: "Sábado. Me desperté con el sol en la cara. Me acordé de Bigotes y salté de la cama. Fui a ver la jaula. Estaba abierta. Y adentro no había nadie. Solo había un poco de aserrín y una semilla de girasol. Mi corazón hizo ¡pum, pum, pum! Revisé debajo de la cama. Revisé dentro de las botas. Revisé dentro del refrigerador y hasta en el bolsillo de mi pijama. Revisé hasta dentro de la tostadora. Nada. Entonces me acordé de la regla número tres. La puerta debía estar bien cerrada. Y yo la había cerrado, pero a medias. ¡Qué mala pata! Corrí al cuarto de Lola y la desperté de un salto. «Lola, Bigotes se escapó», le dije. «Tenemos que encontrarlo antes de que mamá se levante». Lola se frotó los ojos. «¿Un hámster? Entonces necesitamos un plan», dijo muy seria, y se puso sus pantuflas de conejo.",
          en: "Saturday. I woke up with the sun on my face. I remembered Whiskers and jumped out of bed. I went to check the cage. It was open. And there was nobody inside. There was only some sawdust and one sunflower seed. My heart went thump, thump, thump! I checked under the bed. I checked inside the boots. I checked the fridge and even my pajama pocket. I even checked inside the toaster. Nothing. Then I remembered rule number three. The door had to be closed tight. And I had closed it, but only halfway. What bad luck! I ran to Lola's room and woke her up with a jump. \"Lola, Whiskers escaped,\" I told her. \"We have to find him before Mom gets up.\" Lola rubbed her eyes. \"A hamster? Then we need a plan,\" she said very seriously, and put on her bunny slippers."
        },
        tasks: [
          task("quiz",
            { es: "¿Por qué se escapó Bigotes?", en: "Why did Whiskers get out?" },
            { es: ["Porque la puerta no estaba bien cerrada", "Porque Lola abrió la jaula", "Porque Croqueta la rompió", "Porque la jaula era muy pequeña"], en: ["Because the door was not closed tight", "Because Lola opened the cage", "Because Crouton broke it", "Because the cage was too small"] }, 0),
          task("predict",
            { es: "¿Qué crees que harán Dani y Lola ahora?", en: "What do you think Danny and Lola will do now?" },
            { es: ["Buscar a Bigotes por toda la casa", "Dormir otra vez", "Salir a jugar al parque", "Comer panqueques"], en: ["Look for Whiskers all over the house", "Go back to sleep", "Go play at the park", "Eat pancakes"] }, 0)
        ]
      },
      {
        text: {
          es: "Llamé a Beto por teléfono. Llegó en diez minutos con una linterna y una lupa. Se puso la linterna en la frente, aunque era de día. Beto cree que todos los casos se resuelven con una lupa. Hicimos el plan número uno. Esparcimos semillas de girasol por el pasillo, para atraer a Bigotes. Pero Croqueta llegó primero y se las comió todas. Plan número dos. Echamos harina en el suelo para ver las huellas del hámster. Lola echó tanta harina que la cocina parecía una tormenta de nieve. Aparecieron muchas huellas. Todas eran de Croqueta. Él se sentó en medio de la harina, blanco de pies a cabeza, y sonrió con la lengua afuera. «Dani, tu perro es el peor detective del mundo», dijo Beto. Mamá apareció en la puerta de la cocina en bata. Miró la harina. Miró a Croqueta. Cerró los ojos y volvió a su cuarto. Creo que pensó que soñaba.",
          en: "I called Beto on the phone. He got here in ten minutes with a flashlight and a magnifying glass. He put the flashlight on his forehead, even though it was daytime. Beto thinks every case can be solved with a magnifying glass. We made plan number one. We scattered sunflower seeds in the hallway to attract Whiskers. But Crouton got there first and ate them all. Plan number two. We spread flour on the floor to see the hamster's tracks. Lola spread so much flour that the kitchen looked like a snowstorm. Lots of tracks appeared. They were all Crouton's. He sat in the middle of the flour, white from head to toe, and smiled with his tongue out. \"Danny, your dog is the worst detective in the world,\" said Beto. Mom appeared at the kitchen door in her robe. She looked at the flour. She looked at Crouton. She closed her eyes and went back to her room. I think she thought she was dreaming."
        },
        tasks: [
          task("quiz",
            { es: "¿Qué pasa con las semillas del plan número uno?", en: "What happens to the seeds in plan number one?" },
            { es: ["Croqueta se las come", "Bigotes se las lleva", "Lola las guarda", "El viento las sopla"], en: ["Crouton eats them", "Whiskers takes them", "Lola saves them", "The wind blows them away"] }, 0),
          task("vocab",
            { es: "¿Qué es una «lupa»?", en: "What is a \"magnifying glass\"?" },
            { es: ["Un vidrio que hace ver las cosas más grandes", "Una linterna pequeña", "Un tipo de lente de sol", "Un espejo roto"], en: ["A glass that makes things look bigger", "A small flashlight", "A kind of sunglasses", "A broken mirror"] }, 0,
            { word: { es: "lupa", en: "magnifying glass" }, fact: { es: "Los detectives de los cuentos siempre llevan una lupa.", en: "Detectives in stories always carry a magnifying glass." } })
        ]
      },
      {
        text: {
          es: "Estábamos los tres tirados en el suelo, llenos de harina, sin ideas. Mamá se había levantado, pero seguía dormida frente al café. De pronto Lola levantó el dedo. «Silencio», dijo. Nos quedamos quietos. Beto cruzó los dedos. Croqueta, por una vez, dejó de mover la cola. Se oía el reloj. Se oía la nevera. Se oía mi estómago. Y debajo de todo eso, un sonido muy chiquito: tic, tic, tic. «¡Viene del cuarto de papá!», susurró Beto. Caminamos de puntillas, uno detrás de otro, con Croqueta al final. Abrimos la puerta sin hacer ruido. El cuarto estaba en penumbra. Sobre la cómoda estaba el sombrero de copa de papá, el que me prestó para el truco de magia. Y el sonido venía de ahí dentro. Me temblaban las manos otra vez, pero esta vez de emoción.",
          en: "The three of us were lying on the floor, covered in flour, with no ideas. Mom had gotten up, but she was still half asleep in front of her coffee. Suddenly Lola raised a finger. \"Quiet,\" she said. We stayed still. Beto crossed his fingers. Crouton, for once, stopped wagging his tail. We could hear the clock. We could hear the fridge. We could hear my stomach. And under all that, a tiny sound: tick, tick, tick. \"It is coming from Dad's room!\" whispered Beto. We tiptoed, one behind the other, with Crouton at the end. We opened the door without a sound. The room was dim. On the dresser sat Dad's top hat, the one he lent me for the magic trick. And the sound was coming from inside it. My hands were shaking again, but this time with excitement."
        },
        tasks: [
          task("quiz",
            { es: "¿De dónde venía el sonido tic, tic, tic?", en: "Where was the tick, tick, tick sound coming from?" },
            { es: ["Del sombrero de copa de papá", "De la nevera", "De debajo de la cama", "De la tostadora"], en: ["From Dad's top hat", "From the fridge", "From under the bed", "From the toaster"] }, 0),
          task("predict",
            { es: "¿Qué crees que hay dentro del sombrero?", en: "What do you think is inside the hat?" },
            { es: ["Bigotes", "Un conejo de verdad", "Un calcetín viejo", "Nada"], en: ["Whiskers", "A real rabbit", "An old sock", "Nothing"] }, 0)
        ]
      },
      {
        text: {
          es: "Lola se subió a una silla con mucho cuidado. Yo sostenía la silla. Beto sostenía a Lola. Croqueta sostenía a Beto, o por lo menos lo intentaba. Lola se asomó al sombrero. «¡Está aquí!», dijo en voz muy baja. Dentro del sombrero, hecho una bolita dorada, dormía Bigotes. Tenía las mejillas llenas de semillas y una sonrisa chiquita. Parecía el hámster más feliz del mundo. Debió de subir por la cortina durante la noche y se quedó dormido en su nueva casa. Bajé a Lola de la silla. Levanté el sombrero con las dos manos, como si fuera una torta con velas. Bigotes bostezó. Todos aplaudimos sin hacer ruido. Beto sacó su lupa y miró a Bigotes de cerca. «Caso resuelto», dijo con voz de detective de película. Lola bailó un baile de victoria con sus pantuflas de conejo.",
          en: "Lola climbed onto a chair very carefully. I held the chair. Beto held Lola. Crouton held Beto, or at least he tried. Lola peeked into the hat. \"He is here!\" she said in a tiny voice. Inside the hat, curled into a golden ball, Whiskers was sleeping. His cheeks were full of seeds and he had a little smile. He looked like the happiest hamster in the world. He must have climbed up the curtain during the night and fallen asleep in his new home. I helped Lola down from the chair. I lifted the hat with both hands, as if it were a cake with candles. Whiskers yawned. We all clapped without making a sound. Beto took out his magnifying glass and looked at Whiskers up close. \"Case closed,\" he said in a movie-detective voice. Lola did a victory dance in her bunny slippers."
        },
        tasks: [
          task("retell",
            { es: "¿Dónde estaba Bigotes?", en: "Where was Whiskers?" },
            { es: ["Durmiendo dentro del sombrero de copa", "Escondido en la tostadora", "Debajo de la cama de Lola", "En el jardín"], en: ["Sleeping inside the top hat", "Hidden in the toaster", "Under Lola's bed", "In the yard"] }, 0),
          task("syllable",
            { es: "Junta las sílabas de forma correcta.", en: "Put the syllables together correctly." },
            { es: ["Há-ms-ter", "Hám-s-ter", "Hám-ster", "Ham-ster-á"], en: ["Ham-ster", "Hams-ter", "Ha-mster", "Hamst-er"] }, 2)
        ]
      },
      {
        text: {
          es: "Pusimos a Bigotes en su jaula. Esta vez cerré la puerta con dos candados de mentira, o sea, con dos ganchos de ropa. Después mamá nos hizo limpiar la harina de la cocina. Tardamos una hora. Lola hizo ángeles de harina en el piso y dijo que fue la mejor tarea del mundo. Croqueta se acercó despacito. Bigotes lo miró desde atrás de las rejas. Croqueta le dio un lengüetazo chiquito en la nariz. Bigotes estornudó. Todos nos reímos. El lunes le devolví a Bigotes a la profe Marta. Ella lo miró y dijo: «Qué bien se ve. Parece que descansó muchísimo». Yo asentí con la cabeza y no dije nada. Cuaderno de Dani: Cierra bien la puerta de la jaula. Tengo una hermanita que es detective oficial. Y mi perro hace buenos amigos, aunque sea un desastre.",
          en: "We put Whiskers back in his cage. This time I closed the door with two pretend locks, that is, two clothespins. Then Mom had us clean the flour off the kitchen. It took an hour. Lola made flour angels on the floor and said it was the best chore in the world. Crouton came closer slowly. Whiskers looked at him from behind the bars. Crouton gave him a tiny lick on the nose. Whiskers sneezed. We all laughed. On Monday I gave Whiskers back to Miss Marta. She looked at him and said: \"He looks great. It seems he rested a lot.\" I nodded and said nothing. Danny's notebook: Close the cage door tight. I have a little sister who is an official detective. And my dog makes good friends, even if he is a mess."
        },
        tasks: [
          task("retell",
            { es: "¿Qué aprende Dani al final?", en: "What does Danny learn at the end?" },
            { es: ["A cerrar bien la puerta de la jaula", "A no cuidar animales nunca más", "A esconder las semillas", "A dormir con el hámster"], en: ["To close the cage door tight", "To never take care of animals again", "To hide the seeds", "To sleep with the hamster"] }, 0),
          task("spellfix",
            { es: "¿Qué palabra está mal escrita?", en: "Which word is spelled wrong?" },
            { es: ["Jaula", "Estornudó", "Bigotes", "Detectibe"], en: ["Cage", "Sneezed", "Hamster", "Detectiv"] }, 3,
            { hint: { es: "«Detective» se escribe con v.", en: "\"Detective\" ends with ive." } })
        ]
      }
    ]
  });
  dani.stories.push({
    id: "dani-3",
    level: 2,
    wpm: 100,
    title: { es: "El campamento en el patio", en: "Backyard Camping" },
    intro: {
      es: "Dani promete a Beto la mejor noche de campamento.",
      en: "Danny promises Beto the best camping night ever."
    },
    sections: [
      {
        text: {
          es: "Cuaderno de Dani. Sábado. Hoy hice una promesa muy grande. Le dije a Beto: «Esta noche haremos el mejor campamento de la historia». Será en el patio de mi casa, porque el bosque queda lejos. Mamá dijo que sí con tres condiciones. Uno: nada de fuego. Dos: todos con pijama abrigada. Tres: si alguien se asusta, entramos a la casa. Papá me prestó su vieja carpa inflable. Es verde, enorme y huele a viaje. Hice una lista en mi cuaderno: carpa, linterna, bolsas de dormir, sándwiches y malvaviscos. Lola quiso venir. Dijo que ya era grande, porque tiene cuatro años y medio. Croqueta, por supuesto, iba a venir también. Beto llegó a las cuatro con una mochila gigante. Dijo que traía lo necesario: una brújula, una lupa y medias de repuesto. Nunca se sabe.",
          en: "Danny's notebook. Saturday. Today I made a very big promise. I told Beto: \"Tonight we will have the best camping trip in history.\" It will be in my backyard, because the forest is far away. Mom said yes with three rules. One: no fire. Two: everybody wears warm pajamas. Three: if anyone gets scared, we go inside the house. Dad lent me his old inflatable tent. It is green, huge and smells like travel. I made a list in my notebook: tent, flashlight, sleeping bags, sandwiches and marshmallows. Lola wanted to come. She said she was big now, because she is four and a half. Crouton, of course, was coming too. Beto arrived at four o'clock with a giant backpack. He said he brought what we needed: a compass, a magnifying glass and spare socks. You never know."
        },
        tasks: [
          task("quiz",
            { es: "¿Dónde será el campamento?", en: "Where will the camping trip be?" },
            { es: ["En el patio de la casa de Dani", "En un bosque lejano", "En la playa", "En el colegio"], en: ["In Danny's backyard", "In a faraway forest", "At the beach", "At school"] }, 0),
          task("vocab",
            { es: "¿Qué es una «carpa»?", en: "What is a \"tent\"?" },
            { es: ["Una casita de tela para dormir afuera", "Un tipo de pez", "Una mochila grande", "Una linterna"], en: ["A little cloth house for sleeping outside", "A kind of fish", "A big backpack", "A flashlight"] }, 0,
            { word: { es: "carpa", en: "tent" }, fact: { es: "Las carpas se arman con varillas y cuerdas, o con aire.", en: "Tents are put up with poles and ropes, or with air." } })
        ]
      },
      {
        text: {
          es: "A las cinco empezamos a armar la carpa. Beto leyó las instrucciones. Yo apreté el botón del inflador. La carpa empezó a crecer, lenta y lenta, como un gigante verde que despierta. Pero se infló torcida y quedó con la puerta mirando al cielo. Beto dijo que era una carpa moderna. Lola dijo que parecía un dinosaurio dormido. La enderezamos entre los tres, con mucha ayuda de Croqueta, que mordió una cuerda y se la llevó. Al final quedó casi derecha. Metimos adentro las bolsas de dormir, las linternas y los sándwiches. Cuando mamá miró desde la ventana de la cocina, nos hizo un pulgar arriba. Yo dije: «Qué buen campamento». Beto respondió: «Todavía no empezó». Croqueta se acostó en medio de la carpa y la dejó todavía más torcida. Lola le puso un nombre a la carpa: Dino.",
          en: "At five o'clock we began to set up the tent. Beto read the instructions. I pressed the button on the pump. The tent began to grow, slow and slower, like a green giant waking up. But it inflated crooked and its door ended up facing the sky. Beto said it was a modern tent. Lola said it looked like a sleeping dinosaur. We straightened it together, with lots of help from Crouton, who bit a rope and ran off with it. In the end it stood almost straight. We put the sleeping bags, flashlights and sandwiches inside. When Mom looked out of the kitchen window, she gave us a thumbs up. I said: \"What a great camping trip.\" Beto answered: \"It has not even started yet.\" Crouton lay down in the middle of the tent and made it even more crooked. Lola gave the tent a name: Dino."
        },
        tasks: [
          task("quiz",
            { es: "¿Cómo parecía la carpa, según Lola?", en: "What did the tent look like, according to Lola?" },
            { es: ["Un dinosaurio dormido", "Un barco grande", "Una montaña", "Un globo de colores"], en: ["A sleeping dinosaur", "A big boat", "A mountain", "A colorful balloon"] }, 0),
          task("predict",
            { es: "¿Qué crees que pasará cuando oscurezca?", en: "What do you think will happen when it gets dark?" },
            { es: ["Se oirán ruidos misteriosos", "Aparecerán dinosaurios de verdad", "Se acabará la noche enseguida", "Nadie podrá dormir por el calor"], en: ["They will hear mysterious sounds", "Real dinosaurs will show up", "The night will end right away", "Nobody will sleep because of the heat"] }, 0)
        ]
      },
      {
        text: {
          es: "Cuando oscureció, nos metimos en la carpa. Cenamos sándwiches con la luz de las linternas. Beto contó un chiste. Lola contó otro. Yo no entendí ninguno, pero nos reímos igual. Beto prometió no tener miedo. Lo prometió tres veces. Lola sacó galletas escondidas en su bolsillo. Afuera cantaban los grillos y la luna salió grande y amarilla. Todo estaba tranquilo, hasta que de pronto oímos: ssssss. Nos miramos. «¿Qué fue eso?», susurró Beto. Ssssss, repitió el sonido. Venía de arriba. Y después, desde afuera: ñam, ñam, ñam. Lola agarró su osito. Croqueta levantó las orejas. Yo sentí cosquillas en la barriga. «Tranquilos», dije con una voz que sonó más aguda de lo normal. «Voy a ver qué es». Tomé una cuchara de madera, que fue lo primero que encontré, y salí de la carpa.",
          en: "When it got dark, we went into the tent. We ate sandwiches by flashlight. Beto told a joke. Lola told another. I did not understand either one, but we laughed anyway. Beto promised not to be scared. He promised three times. Lola took out cookies hidden in her pocket. Outside, the crickets were singing and the moon came out big and yellow. Everything was calm, until suddenly we heard: ssssss. We looked at each other. \"What was that?\" whispered Beto. Ssssss, the sound said again. It came from above. And then, from outside: nom, nom, nom. Lola grabbed her teddy bear. Crouton perked up his ears. I felt a tickle in my belly. \"Stay calm,\" I said in a voice that came out higher than usual. \"I will go see what it is.\" I grabbed a wooden spoon, the first thing I found, and went out of the tent."
        },
        tasks: [
          task("quiz",
            { es: "¿Qué arma agarra Dani para salir?", en: "What does Danny grab before going out?" },
            { es: ["Una cuchara de madera", "Una linterna gigante", "Un palo de escoba", "Una almohada"], en: ["A wooden spoon", "A giant flashlight", "A broomstick", "A pillow"] }, 0),
          task("vocab",
            { es: "¿Qué son los «grillos»?", en: "What are \"crickets\"?" },
            { es: ["Insectos que cantan de noche", "Pájaros grandes", "Peces pequeños", "Ranas verdes"], en: ["Insects that sing at night", "Big birds", "Small fish", "Green frogs"] }, 0,
            { word: { es: "grillos", en: "crickets" }, fact: { es: "Los grillos cantan frotando sus alas.", en: "Crickets sing by rubbing their wings." } })
        ]
      },
      {
        text: {
          es: "Alumbré con mi linterna hacia el rincón del patio. Allí, junto a la cerca, había una figura enorme y peluda. Estaba de espaldas. Se movía y hacía ñam, ñam, ñam. Respiré hondo y grité: «¿Quién anda ahí?». La figura se dio la vuelta. Era Pelusa, la perra del vecino. Tenía la cabeza metida entre dos tablas de la cerca y la boca llena de mis sándwiches. Había olvidado uno sobre la mesa. Pelusa se quedó atascada un ratito más, y tuve que ayudarla a sacar la cabeza con mucho cuidado. Me miró con ojos de culpa y siguió masticando. No pude evitarlo. Me eché a reír, y mi risa despertó a Beto y a Lola. «¿Era un dragón?», preguntó Lola desde la carpa. «Peor», dije yo. «Era una perra con hambre».",
          en: "I shone my flashlight toward the corner of the yard. There, next to the fence, was a huge, furry shape. It had its back to me. It was moving and going nom, nom, nom. I took a deep breath and shouted: \"Who is there?\" The shape turned around. It was Fluffy, the neighbor's dog. She had her head stuck between two boards of the fence and her mouth full of my sandwiches. I had forgotten one on the table. Fluffy stayed stuck a little longer, and I had to help her pull out her head very carefully. She looked at me with guilty eyes and kept chewing. I could not help it. I burst out laughing, and my laugh woke up Beto and Lola. \"Was it a dragon?\" asked Lola from the tent. \"Worse,\" I said. \"It was a hungry dog.\""
        },
        tasks: [
          task("quiz",
            { es: "¿Quién hacía el ruido de ñam, ñam, ñam?", en: "Who was making the nom, nom, nom sound?" },
            { es: ["Pelusa, la perra del vecino", "Croqueta", "Lola", "Un oso"], en: ["Fluffy, the neighbor's dog", "Crouton", "Lola", "A bear"] }, 0),
          task("sentence",
            { es: "Pon la oración en el orden correcto.", en: "Put the sentence in the right order." },
            { es: ["Pelusa se comió mis sándwiches.", "Sándwiches Pelusa mis comió se.", "Se mis Pelusa sándwiches comió.", "Comió Pelusa se sándwiches mis."], en: ["Fluffy ate my sandwiches.", "Sandwiches Fluffy my ate.", "My ate Fluffy sandwiches.", "Ate Fluffy sandwiches my."] }, 0)
        ]
      },
      {
        text: {
          es: "Todavía nos reíamos cuando volvió el ruido de arriba: ssssss. Era la carpa. Tenía un agujerito, chiquito, y se desinflaba poco a poco. El techo empezó a bajar sobre nuestras cabezas, lento, lento, como una sábana mojada. Beto trató de sostenerlo con la mano. Lola se escondió debajo de su bolsa de dormir y asomó solo la nariz. Yo me puse la almohada de sombrero. Y entonces, ¡tsss, tsss, tsss! El rociador del jardín del vecino se encendió de golpe. Lanzó chorros de agua por encima de la cerca, directo a la mitad de nuestra carpa. Llovía de un lado y estaba seco del otro. Beto levantó el dedo: «Es el campamento más raro del mundo». Y era verdad. Croqueta, empapado, se sacudió encima de todos nosotros.",
          en: "We were still laughing when the sound came back from above: ssssss. It was the tent. It had a tiny hole, and it was slowly going flat. The roof began to sink onto our heads, slow, slow, like a wet sheet. Beto tried to hold it up with his hand. Lola hid under her sleeping bag and poked out only her nose. I put my pillow on my head like a hat. And then, tsss, tsss, tsss! The neighbor's garden sprinkler turned on all at once. It shot streams of water over the fence, straight at half of our tent. It was raining on one side and dry on the other. Beto raised a finger: \"This is the weirdest camping trip in the world.\" And it was true. Crouton, soaked, shook himself all over us."
        },
        tasks: [
          task("quiz",
            { es: "¿Qué hace que llueva sobre la mitad de la carpa?", en: "What makes it rain on half of the tent?" },
            { es: ["El rociador del vecino", "Una nube de verdad", "Una manguera de Dani", "La lluvia de la tarde"], en: ["The neighbor's sprinkler", "A real cloud", "Danny's hose", "The afternoon rain"] }, 0),
          task("predict",
            { es: "¿Qué crees que hará mamá cuando los vea?", en: "What do you think Mom will do when she sees them?" },
            { es: ["Los invitará a entrar a la casa", "Los dejará mojados toda la noche", "Se enojará muchísimo", "Llamará a los bomberos"], en: ["She will invite them inside the house", "She will leave them wet all night", "She will get very angry", "She will call the firefighters"] }, 0)
        ]
      },
      {
        text: {
          es: "Mamá apareció con una toalla en cada mano. «Muy bien, exploradores», dijo. «Es hora de entrar». Nos secó uno por uno, a Croqueta último. Beto colgó sus medias mojadas de una linterna. Parecían banderas. Lola preguntó si la carpa Dino se podía arreglar. Mamá dijo que con un parche quedaría como nueva. En la sala armamos una carpa de sábanas con dos sillas y el sofá. Quedó mejor que la de verdad. Mamá nos dio malvaviscos en palitos y los dorró un poquito sobre la estufa, con mucho cuidado. Olían a dulce. Lola se comió siete. Nos acostamos todos en fila, adentro de la carpa de sábanas, con las linternas prendidas. Beto dijo: «Este es el mejor campamento de mi vida». Yo me puse rojo de orgullo. Había cumplido mi promesa, aunque no como la había imaginado. Cuaderno de Dani: mala suerte, tres veces. Pero si cuento la historia, no me sale mal ni una vez. Esa noche Croqueta roncó como un tractor, y Lola se durmió con un malvavisco en la mano.",
          en: "Mom showed up with a towel in each hand. \"All right, explorers,\" she said. \"It is time to come in.\" She dried us off one by one, Crouton last. Beto hung his wet socks from a flashlight. They looked like flags. Lola asked if the tent called Dino could be fixed. Mom said that with a patch it would be good as new. In the living room we built a sheet tent with two chairs and the couch. It turned out better than the real one. Mom gave us marshmallows on sticks and toasted them a little over the stove, very carefully. They smelled sweet. Lola ate seven. We all lay in a row inside the sheet tent, with the flashlights on. Beto said: \"This is the best camping trip of my life.\" I turned red with pride. I had kept my promise, although not the way I had imagined. Danny's notebook: bad luck, three times. But when I tell the story, it does not go wrong even once. That night Crouton snored like a tractor, and Lola fell asleep with a marshmallow in her hand."
        },
        tasks: [
          task("retell",
            { es: "¿Cómo termina la noche de campamento?", en: "How does the camping night end?" },
            { es: ["En una carpa de sábanas dentro de la casa", "En el bosque con un oso", "Con todos peleando", "En el patio bajo la lluvia"], en: ["In a sheet tent inside the house", "In the forest with a bear", "With everyone fighting", "In the yard in the rain"] }, 0),
          task("missing",
            { es: "¿Qué letra falta? MALV_VISCO", en: "Which letter is missing? MARSH_ALLOW" },
            { es: ["A", "E", "O", "U"], en: ["M", "N", "P", "T"] }, 0,
            { hint: { es: "Dilo despacio: mal-va-vis-co.", en: "Say the word slowly: marsh-mal-low." } })
        ]
      }
    ]
  });
  // @dani-stories

  CONTENT.worlds.push(mili, dani);
})();
