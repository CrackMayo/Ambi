const db = firebase['firestore']();
const defaultStorage = firebase.storage();






var currentTriviaQuestion;

var correct = 2;

function changePage(idIn, idOut) {
    if (idIn == "trivia-section") {
        triviaStarter();
    }

    if (idIn == "plants-section") {
        plantLoader(currentTriviaQuestion);
    }
    document.getElementById(idIn).classList.remove("invisible");
    document.getElementById(idOut).className += " invisible";
}

 function ramdomizer(questions){
    return parseInt(Math.random() * (questions - 1) + 1);;
}

function triviaStarter() {

    currentTriviaQuestion = ramdomizer(15);
    db.collection("Preguntas").doc(currentTriviaQuestion.toString()).get().then(snap => {
        document.getElementById("question").innerHTML = snap.data().Pregunta;
        correct = parseInt(Math.random() * 4 + 1);
        document.getElementById("span_answer" + correct).innerHTML = snap.data().Correcta;
        var count = 1;
        for (var k = 1; k <= 4; k++) {
            if (k != correct) {
                if (count == 1) {
                    document.getElementById("span_answer" + k).innerHTML = snap.data().Incorrecta1;
                    count++;
                } else if (count == 2) {
                    document.getElementById("span_answer" + k).innerHTML = snap.data().Incorrecta2;
                    count++;
                } else if (count == 3) {
                    document.getElementById("span_answer" + k).innerHTML = snap.data().Incorrecta3;
                    count++;
                }
            }
        }
        charge(false);
    });
}

function checkAnswer(answer) {
    if (answer == correct) {
        correctAnswer(answer);
    } else {
        wrongAnswer(answer);
    }
}

function wrongAnswer(answer) {
    // alert("Wrong answer!");
    document.getElementById("answer" + answer).className += " animation wrongAnswer";
    document.getElementById("block").classList.remove("invisible");
    setTimeout(function () {
        document.getElementById("answer" + answer).classList.remove("animation");
        setTimeout(function () {
            document.getElementById("block").classList.add("invisible");
            document.getElementById("answer" + answer).classList.remove("wrongAnswer");
            changePage("main-section", "trivia-section")
        }, 2000);
    }, 1000);
}

function correctAnswer(answer) {
    document.getElementById("answer" + answer).classList.add("correctAnswer", "animation");
    confetti.start();
    setTimeout(function () {
        document.getElementById("answer" + answer).classList.remove("correctAnswer", "animation");
        confetti.stop();
        changePage('plants-section', 'trivia-section');
    }, 4000);
}

function charge(ok) {
    if (ok) {
        document.getElementById("charge").classList.remove("invisible");
    } else {
        document.getElementById("charge").classList.add("invisible");
    }
}


function plantLoader(currentQuestion) {
    var storage = firebase.app().storage("gs://ambi-67875.appspot.com/AnswersImg");

    db.collection("Preguntas").doc(currentQuestion.toString()).get().then(snap => {
        // document.getElementById("plant-image").src = defaultStorage.refFromURL(snap.data().PlantIMG);
        // document.getElementById("plant-image").src = storage.refFromURL("/1_manzanilla.png");
        document.getElementById("plant-image").src = defaultStorage.refFromURL("gs://ambi-67875.appspot.com/AnswersImg/1_manzanilla.png");
        document.getElementById("plant-description-p").innerHTML = snap.data().Respuesta;


    });

}

function registerMaker() {

    var preguntas = ["¿Qué planta se considera la más útil para acabar con la acidez estomacal?",
        "¿Qué planta se considera favorecedora para la regeneración cutánea?",
        "¿Qué planta es conocida especialmente por su acción ante las enfermedades respiratorias?",
        "¿Qué planta era utilizada en la antigüedad para tratar heridas como antiséptico?",
        "¿Qué planta se considera útil para situaciones de estrés e insomnio?",
        "¿Qué planta es bastante conocida en nuestras cocinas y también como excelente antioxidante?",
        "¿Qué planta es conocida por disminuir la tensión art erial y reducir el ritmo cardíaco?",
        "¿Qué planta es utilizada para infusiones energizantes y que mantienen activas a las personas?",
        "¿Qué planta se utiliza como digestiva y laxante gracias a su alto contenido de fibra?",
        "¿Qué planta se utiliza como aceite esencial para antiespasmódicos o sedantes?",
        "¿Qué planta es bastante popular por sus propiedades cicatrizantes?",
        "¿Qué planta se utiliza en infusiones como relajante?",
        "¿Qué planta es utilizada por su corteza para la irritación de garganta?",
        "¿Qué planta es apreciada por sus propiedades digestivas y para la expulsión de gases?",
        "¿Qué planta ha sido utilizada durante siglos para favorecer la regeneración de huesos?",
    ];
    var respuestas = ["Manzanilla",
        "Aloe Vera",
        "Eucalipto",
        "Tomillo",
        "Lavanda",
        "Orégano",
        "Pasiflora",
        "Ginseng",
        "Apio",
        "Ruda",
        "Caléndula",
        "Limoncillo",
        "Olmo",
        "Hinojo",
        "Helecho gu-sui-bu",
    ];

    for (let i = 0; i < preguntas.length; i++) {
        db.collection("Preguntas").doc((i+1).toString()).set({
            Correcta: "Correcta",
            Incorrecta1: "Incorrecta",
            Incorrecta2: "Incorrecta",
            Incorrecta3: "Incorrecta",
            PlantIMG: "gs://ambi-67875.appspot.com/ejemplo1.png",
            Pregunta: preguntas[i],
            Respuesta: respuestas[i] ,
        }).then(function() {
            console.log("Document successfully written!");
        });
    }

}
