// Start button
const startBtn = document.querySelector(".start-button button");

// Rules box
const rulesBox = document.querySelector(".rules-box");

// The answers to the question
const answerList = document.querySelector(".answer_list");

// Quiz box
const quizBox = document.querySelector(".quiz_box");

// The point chart
const ctx = document.querySelector("#chart").getContext("2d");

//Result box
const resultBox = document.querySelector(".result_box");

// Exit button
const exitBtn = rulesBox.querySelector(".control-buttons .exit");

// Ready button
const readyBtn = rulesBox.querySelector(".control-buttons .ready");

// The timers counter, that will count down from the amount of time I give the user
const theTimeCounter = quizBox.querySelector(".timer .timer_sec");

// The text inserted in the timer when the time has run out
const outOfTime = quizBox.querySelector("header .timer_text")

//Next button
const nextBtn = quizBox.querySelector(".next_btn");

//Restart button
const restartBtn = resultBox.querySelector(".buttons .restart")

//Quit button
const quitBtn = resultBox.querySelector(".buttons .quit")

//This sets the total question number to start at 0
let totalQueNumber = 0;

//This sets the question number to start at 1
let questionNumber = 1;

// Counter is equal to one second so that it goes in intervals of 1 second
let counter;

// These variable chooses the amount of seconds you have when you go to the next question
let timeValue = 15;

//The amount of questions the user gets correct
let amountAnswerCorrect = 0;

//The user point is equivalent to the amount of questions they got right
let totalUserPoint = 0;

//Start button click action
startBtn.addEventListener("click", function() {
    //Adds the rules box
    rulesBox.classList.add("clickRulesBox");
    //Removes the start button
    startBtn.classList.add("clickStartBtn");
})

//Exit button click action
exitBtn.addEventListener("click", function() {
    //Removes the rules box
    rulesBox.classList.remove("clickRulesBox");
    //Adds the start button when you click the exit button
    startBtn.classList.remove("clickStartBtn");
})

//Ready button click action
readyBtn.addEventListener("click", function() {
    //Removes the rules box
    rulesBox.classList.remove("clickRulesBox");
    //Adds the quiz box
    quizBox.classList.add("clickQuizBox");
    //Start at the first question
    getQuestion(0);
    //This will make the counter in the bottom of the quiz box where it tells you which question you're on start at 1
    footerQuestionCounter(1);
    //Choosing how many seconds you have to answer
    startTimer(15);
})

//When quit button is clicked
quitBtn.addEventListener("click", function (){
    //Reloads the webpage and returns you to the beginning again
    window.location.reload();
})

//When clicked on next button
nextBtn.addEventListener("click", function () {
    //This makes sure you can only click the next button up until the last question without being able to click next after answering all questions
    if(totalQueNumber < theQuestions.length - 1){
        //Counts up the total que number
        totalQueNumber++;
        //Counts up the question number
        questionNumber++;
        //Here we call the getQuestion function to get the next question in que when clicked
        getQuestion(totalQueNumber);
        //Here we insert the counted question number in the footer, to show the user what question they are on
        footerQuestionCounter(questionNumber);
        //This clears the timer
        clearInterval(counter);
        //This starts the timer again
        startTimer(timeValue);
        //This makes the next button disappear when you have clicked it, so it wont show up on the next question
        nextBtn.style.display = "none";
        //This will make sure the text in the timer says "Tid tilbage" instead of "ude af tid" if the user didnt answer the earlier question
        outOfTime.textContent = "Tid tilbage";
    }
    //This makes sure that if you have answered the last question you will be shown the result box, to see you're result
    else{
        //Clears the timer
        clearInterval(counter);
        console.log("Du er færdig")
        //Gets you to the result box
        getResultBox();
    }
})

//This function makes sure that you get the questions and options from the arrays
function getQuestion(answerValue) {
    const totalQueNumber = document.querySelector(".question_text");
    //Inserts the question
    let changeQuestionTag = "<span>" + theQuestions[answerValue].theQuestion + "</span>"
    //Inserts the answers from the array
    let changeAnswerTag = "<div class='answers'>" + theQuestions[answerValue].theAnswers[0] + "<span></span></div>"
        + "<div class='answers'><span>" + theQuestions[answerValue].theAnswers[1] + "</span></div>"
        + "<div class='answers'><span>" + theQuestions[answerValue].theAnswers[2] + "</span></div>"
        + "<div class='answers'><span>" + theQuestions[answerValue].theAnswers[3] + "</span></div>";
    //Replacing span tag inside changeQuestionTag
    totalQueNumber.innerHTML = changeQuestionTag;
    //Replacing div tag inside changeAnswerTag
    answerList.innerHTML = changeAnswerTag;

    const theAnswers = answerList.querySelectorAll(".answers");
    //Set the on click attribution to all the available answers
    for (let i = 0; i < theAnswers.length; i++) {
        theAnswers[i].setAttribute("onClick", "clickedAnswer(this)");
    }
}

// This function controls what happens when one of the answers is clicked
function clickedAnswer(answer){
    //This will stop the timer, when an answer is clicked
    clearInterval(counter);
    //Getting the answer the user clicked on
    let whenAnswerClicked = answer.textContent;
    //Getting the correct answer from the array
    let correctAnswer = theQuestions[totalQueNumber].answer;
    //Getting all the items in the answer array
    let allAnswers = answerList.children.length;
    //When you choose the right answer
    if (whenAnswerClicked === correctAnswer){
        //This counts the amount of correct answers the user have clicked and adds one everytime
        amountAnswerCorrect += 1;
        //This adds to the point chart each time a user have answered correct
        totalUserPoint += 2;
        console.log(amountAnswerCorrect);
        //Adding color to the correct answer from css
        answer.classList.add("correct");
        console.log("Du har svaret rigtigt");
        //Updating the chart with the users points
        chart.data.datasets[0].data = [totalUserPoint]
        //Updating chart
        chart.update();
        //Play music when you click right answer
        const data = [11,14,17];
        data.forEach((dataPoint, i) => {
            const synth = new Tone.Synth().toDestination();
            const now = Tone.now();
            const timeBetweenNotesInSeconds = 0.1;
            synth.triggerAttackRelease(dataPoint * 230, "10n", now + (i * timeBetweenNotesInSeconds));
        });
    }
    //When you choose the wrong answer
    else {
        //Adds the coloring to the wrong answer from css
        answer.classList.add("incorrect");
        console.log("Du har svaret forkert");
        //This will deduct the users points when a question is answered wrong
        totalUserPoint -= 1;
        console.log(totalUserPoint);
        //Update the chart with the users points
        chart.data.datasets[0].data = [totalUserPoint]
        //Update chart
        chart.update();
        //Play music when you click the wrong answer
        const data = [8,6,4];
        let delay = 300;
        data.forEach((dataPoint, i) => {
            const synth = new Tone.Synth().toDestination();
            const now = Tone.now();
            const timeBetweenNotesInSeconds = 0.3;
            synth.triggerAttackRelease(dataPoint * 40, "10n", now + (i * timeBetweenNotesInSeconds));
        });

        //Show the right answer if you choose the wrong
        for (let i = 0; i < allAnswers; i++) {
            //This will look through the array and see if any of the answers matches the correct
            if(answerList.children[i].textContent === correctAnswer){
                //This will color the correct answer even if you clicked the wrong
                answerList.children[i].setAttribute("class", "answers correct");
            }
        }
    }

    //To only choose one answer
    for (let i = 0; i < allAnswers; i++) {
        answerList.children[i].classList.add("turnedOff")
    }

    //This does so that the next button first shows when you have clicked an answer
    nextBtn.style.display = "block";
}

//This will make sure that you only see the result box and nothing else
function getResultBox(){
    //This will remove the rules box
    rulesBox.classList.remove("clickRulesBox");
    //This will remove the quiz box
    quizBox.classList.remove("clickQuizBox");
    //This does so that the result box will show
    resultBox.classList.add("clickResultBox");
    const pointText = resultBox.querySelector(".point_text");
    //If you got every question right then this will show
    if (amountAnswerCorrect > 19){
        let pointTag = "<span>Tillykke du har fået <p>"+ amountAnswerCorrect +"</p> ud af <p>"+ theQuestions.length +"</p> rigtige!!!</span>" +
            "<p>Du fik "+ totalUserPoint +" points!</p>" +
            "<p>HELT FANTASTISK</p>"
        pointText.innerHTML = pointTag;
    }
    //If you got over 17 questions right this will show
    else if (amountAnswerCorrect > 17){
        let pointTag = "<span>Du har fået <p>"+ amountAnswerCorrect +"</p> ud af <p>"+ theQuestions.length +"</p> rigtige</span>" +
            "<p>Du er der næsten!</p>" +
            "<p>Du fik "+ totalUserPoint +" points!</p>" +
            "<p>VIRKELIG GODT GÅET</p>"
        pointText.innerHTML = pointTag;
    }
    //If you got over 15 questions right this will show
    else if (amountAnswerCorrect > 15){
        let pointTag = "<span>Du har fået <p>"+ amountAnswerCorrect +"</p> ud af <p>"+ theQuestions.length +"</p> rigtige</span>" +
            "<p>Du har styr på det, prøv lige en gang til!</p>" +
            "<p>Du fik "+ totalUserPoint +" points!</p>" +
            "<p>Godt gået, jo hurtigere du er jo flere points</p>"
        pointText.innerHTML = pointTag;
    }
    //If you got over 11 questions right this will show
    else if (amountAnswerCorrect > 11){
        let pointTag = "<span>Du har fået <p>"+ amountAnswerCorrect +"</p> ud af <p>"+ theQuestions.length +"</p> rigtige</span>" +
            "<p>Godt forsøg, prøv igen!</p>" +
            "<p>Du fik "+ totalUserPoint +" points!</p>" +
            "<p>Jo hurtigere du er, jo flere points får du</p>"
        pointText.innerHTML = pointTag;
    }
    //If you got halv the answers correct this will show
    else if (amountAnswerCorrect === 10){
        let pointTag = "<span>Du har fået <p>"+ amountAnswerCorrect +"</p> ud af <p>"+ theQuestions.length +"</p> rigtige</span>" +
            "<p>Du er halvvejs, prøv igen!</p>" +
            "<p>Du fik "+ totalUserPoint +" points!</p>" +
            "<p>Jo hurtigere du er jo flere points får du</p>"
        pointText.innerHTML = pointTag;
    }
    //If you got less than halv the questions right this will show
    else{
        let pointTag = "<span>Du har fået <p>"+ amountAnswerCorrect +"</p> ud af <p>"+ theQuestions.length +"</p> rigtige</span>" +
            "<p>Du fik under halvdelen rigtige, prøv igen</p>" +
            "<p>Du fik "+ totalUserPoint +" points!</p>" +
            "<p>Du får flere points jo hurtigere du svarer</p>"
        pointText.innerHTML = pointTag;
    }
}

//This function will start the timer
function startTimer(time){
    //This will set the interval to 1 second
    counter = setInterval(timer, 1000);
    //This is the timer function
    function timer(){
        //This will change the value of theTimeCounter with the time value
        theTimeCounter.textContent = time;
        //This will make the timer go down every second
        time--;
        //This will deduct 0.1 point from the totalUserPoint when the timer has run for 2 seconds
        if (time === 13){
            totalUserPoint -= 0.1;
            console.log("-0.1 Point ikke indenfor 2 sekunder")
        }
        //This will deduct 0.2 points from the totalUserPoint when the timer has run for 3 seconds
        else if (time === 12){
            totalUserPoint -= 0.1;
            console.log("-0.2 Point ikke indenfor 3 sekunder")
        }
        //This will deduct 0.3 points from the totalUserPoint when the timer has run for 4 seconds
        else if (time === 11){
            totalUserPoint -= 0.1;
            console.log("-0.3 Point ikke indenfor 4 sekunder")
        }
        //This will deduct 0.4 points from the totalUserPoint when the timer has run for 5 seconds
        else if (time === 10){
            totalUserPoint -= 0.1;
            console.log("-0.4 Point ikke indenfor 5 sekunder")
        }
        //This will deduct 0.5 points from the totalUserPoint when the timer has run for 6 seconds
        else if (time === 9){
            totalUserPoint -= 0.1;
            console.log("-0.5 Point ikke indenfor 6 sekunder")
        }
        //This will add one 0 in the timer if the timer is less than 9 seconds
        if (time < 9){
            let addZero = theTimeCounter.textContent;
            theTimeCounter.textContent = "0" + addZero;
        }
        //This stops the timer when it has reached 0
        if (time < 0){
            //This will clear the timer
            clearInterval(counter);
            //This will add two 00 to the timer
            theTimeCounter.textContent = "00";
            //This will change the text in the timer to "ude af tid"
            outOfTime.textContent = "Ude af tid:";
            console.log("Du nåede det ikke i tide, vær hurtigere næste gang")
            //This will get the correct answer from the array
            let correctAnswer = theQuestions[totalQueNumber].answer;
            //This will get the amount of answers in the answerlist
            let allAnswers = answerList.children.length;
            //This will look through all the answers in the array
            for (let i = 0; i < allAnswers; i++) {
                //This will look through all the answers and see if there is one that matches with the correct answer
                if(answerList.children[i].textContent === correctAnswer){
                    //This will color the correct answer using css if the user didn't choose an answer in time
                    answerList.children[i].setAttribute("class", "answers correct");
                }
            }
            //To only choose one answer
            for (let i = 0; i < allAnswers; i++) {
                //This will disable you to click an answer after the time has run out
                answerList.children[i].classList.add("turnedOff")
            }
            //This does so that the next button first show when the time has run out
            nextBtn.style.display = "block";
        }
    }
}

//This function shows the question you are on in the bottom of the quiz box
function footerQuestionCounter(answerValue){
    const footerTotalQuestionCounter = quizBox.querySelector(".total_question_que");
    let totalQuestionCounterTag = "<span><p>"+ answerValue +"</p><p>af</p><p>"+ theQuestions.length +"</p><p>spørgsmål</p></span>"
    footerTotalQuestionCounter.innerHTML = totalQuestionCounterTag;
}

//The questions and answers in an array of objects
let theQuestions = [
    {
        number: 1,
        theQuestion: "Hvilket land har den højeste forventede levetid?",
        answer: "Hong Kong",
        theAnswers: [
            "Danmark",
            "Schweiz",
            "Sverige",
            "Hong Kong"
        ]
    },
    {
        number: 2,
        theQuestion: "Hvad er det mest almindelige efternavn i Danmark?",
        answer: "Nielsen",
        theAnswers: [
            "Jensen",
            "Andersen",
            "Nielsen",
            "Hansen"
        ]
    },
    {
        number: 3,
        theQuestion: "Hvad er Australiens nationaldyr?",
        answer: "Rød kæmpekænguru",
        theAnswers: [
            "Panda",
            "Rød kæmpekænguru",
            "Bjerg ged",
            "Konge ørn"
        ]
    },
    {
        number: 4,
        theQuestion: "Hvor mange dage tager det for jorden at dreje rundt om solen?",
        answer: "365 dage",
        theAnswers: [
            "ca. 30 dage",
            "24 timer",
            "365 dage",
            "Solen drejer rundt om jorden"
        ]
    },
    {
        number: 5,
        theQuestion: "Hvilket land i verden har flest øer?",
        answer: "Sverige",
        theAnswers: [
            "Danmark",
            "Sverige",
            "Thailand",
            "Indonesien"
        ]
    },
    {
        number: 6,
        theQuestion: "Hvad er Canadas hovedstad?",
        answer: "Ottawa",
        theAnswers: [
            "Ottawa",
            "Toronto",
            "Vancouver",
            "Montréal"
        ]
    },
    {
        number: 7,
        theQuestion: "Hvilken er verdens længste flod?",
        answer: "Nilen",
        theAnswers: [
            "Amazonfloden",
            "Nilen",
            "Mississippi-Missouri-Red Rock",
            "Rio de la Plata-Paraná-Rio Grande"
        ]
    },
    {
        number: 8,
        theQuestion: "Hvilket sprog har flest ord (i følge antal ord i ordbøger)?",
        answer: "Engelsk",
        theAnswers: [
            "Arabisk",
            "Spansk",
            "Dansk",
            "Engelsk"
        ]
    },
    {
        number: 9,
        theQuestion: "Hvilken kendt grafitti kunstner kommer fra Bristol?",
        answer: "Banksy",
        theAnswers: [
            "Banksy",
            "Lady pink",
            "Dondi White",
            "Daze"
        ]
    },
    {
        number: 10,
        theQuestion: "Hvilken kunstner malede loftet i Det Sixtinske Kapel i Rom?",
        answer: "Michelangelo",
        theAnswers: [
            "Da Vinci",
            "Picasso",
            "Van Gogh",
            "Michelangelo"
        ]
    },
    {
        number: 11,
        theQuestion: "Hvad var den mest sete serie på Netflix i 2019?",
        answer: "Stranger Things",
        theAnswers: [
            "Modern Family",
            "Friends",
            "The Office",
            "Stranger Things"
        ]
    },
    {
        number: 12,
        theQuestion: "Hvem har skrevet titelsangen til filmen ”Løvernes Konge”?",
        answer: "Elton John",
        theAnswers: [
            "Elton John",
            "Kanye West",
            "Duke Ellington",
            "Leroy Hutson"
        ]
    },
    {
        number: 13,
        theQuestion: "Hvilken ø er den største i verden?",
        answer: "Grønland",
        theAnswers: [
            "Madagaskar",
            "Grønland",
            "Storbritannien",
            "Honshu"
        ]
    },
    {
        number: 14,
        theQuestion: "Hvilket dyr slår flest mennesker ihjel? ",
        answer: "Malariamyggen",
        theAnswers: [
            "Hajen",
            "Tigeren",
            "Malariamyggen",
            "Flodhesten"
        ]
    },
    {
        number: 15,
        theQuestion: "Hvilket nulevende dyr er det største i verden?",
        answer: "Blåhval",
        theAnswers: [
            "Elefant",
            "Spækhugger",
            "Hvalhaj",
            "Blåhval"
        ]
    },
    {
        number: 16,
        theQuestion: "Hvad er hummus primært lavet på som hovedingrediens?",
        answer: "Kikærter",
        theAnswers: [
            "Peanuts",
            "Kikærter",
            "Blommer",
            "Kakaobønner"
        ]
    },
    {
        number: 17,
        theQuestion: "Fra hvilket land stammer retten ”Sauerkraut”?",
        answer: "Tyskland",
        theAnswers: [
            "Tyskland",
            "Frankrig",
            "Italien",
            "Finland"
        ]
    },
    {
        number: 18,
        theQuestion: "Hvilket land stammer ”remoulade” fra?",
        answer: "Frankrig",
        theAnswers: [
            "Danmark",
            "Tyskland",
            "Sverige",
            "Frankrig"
        ]
    },
    {
        number: 19,
        theQuestion: "Hvilken ost bruges til at lave desserten ”Tiramisu”?",
        answer: "Mascarpone ost",
        theAnswers: [
            "Feta ost",
            "Parmasan ost",
            "Gede ost",
            "Mascarpone ost"
        ]
    },
    {
        number: 20,
        theQuestion: "Hvad hedder det største teknologiselskab i Sydkorea?",
        answer: "Samsung",
        theAnswers: [
            "HTC",
            "LG",
            "Sony",
            "Samsung"
        ]
    },
]
// The sizing of the chart
ctx.canvas.width = 400;
ctx.canvas.height = 1100;

// The chart info and data
const chart = new Chart(ctx,{
    type: "bar",
    data: {
        labels: [""],
        datasets: [{
            data: [0],
            label: "Points",
            backgroundColor: ["#7AB642"],
        },
        ],
    },
    options: {
        scales:{
            x:{
                grid:{
                    display: false
                }
            },
        },
        plugins: {
            legend:{
                display: true,
                position: "bottom"
            },
            title:{
                display: true,
                text: "Quiz points"
            }
        }
    }
});
