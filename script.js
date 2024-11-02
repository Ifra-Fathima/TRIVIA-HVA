const start = document.getElementById('start');
const selectcategory = document.getElementById('category')
const categories=document.getElementById('categories')
const playersinfo=document.getElementById('players-info')
const questionsContainer=document.getElementById('display-quetsions')
const fetchQue=document.getElementById("fetch-questions")
const questionDiv=document.getElementById('questions');
const answerDiv=document.getElementById('answers')
const scoreBoard=document.getElementById('score-board')
const endoptions=document.getElementById('end-options')
const playagain=document.getElementById('playAgain')
const endbutton=document.getElementById('endbutton')

let questionsCount=0
let player1score=0
let player2score=0
let questions=[]
let currentQueIndex=0
let options=[]
let currentplayer=1
let selectedCategories=new Set()

start.addEventListener("click", startGame)

function startGame(){
    validatenames()
}

function validatenames(){
    const player1name=document.getElementById('player1').value;
    const player2name=document.getElementById('player2').value;

    if (!player1name || !player2name) {
        alert('Please enter names for both players');
        return;
    }

    if(player1name===player2name){
        alert("please enter two different names")
        return
    }
    displayCategories();
}


function displayCategories() {
    categories.classList.remove('display')
    playersinfo.classList.add('display')
    selectcategory.innerHTML=""
    fetch("https://the-trivia-api.com/api/categories")
        .then(response => response.json())
        .then(data => {
            Object.keys(data).forEach(category => {
                if(!selectedCategories.has(category)){
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                selectcategory.appendChild(option)
                }
            })
            if(selectcategory.options.length===0){
                alert('All categories used, game over')
                resetgame()
            }
        })
        .catch(error=>{
            console.error("Something wrong, Try Again",error)
        })
    }

fetchQue.addEventListener("click",fetchQuestions)

async function fetchQuestions(){
    categories.classList.add('display')
    const selectedCategory=selectcategory.value;
    selectedCategories.add(selectedCategory)

    const formattedcateogry =selectedCategory.toLowerCase().replace(/\s+/g,'_').replace(/&/g, 'and');

    let easyques=await fetch(`https://the-trivia-api.com/v2/questions?categories=${formattedcateogry}&difficulties=easy&limit=2`).then(response=>response.json())
    let midques=await fetch(`https://the-trivia-api.com/v2/questions?categories=${formattedcateogry}&difficulties=medium&limit=2`).then(response=>response.json())
    let hardques=await fetch(`https://the-trivia-api.com/v2/questions?categories=${formattedcateogry}&difficulties=hard&limit=2`).then(response=>response.json())

    questions=[...easyques,...midques,...hardques]
    currentQueIndex=0
    displayQuestions()
 }




function displayQuestions(){
    if (currentQueIndex>=questions.length){
        endthegame()
        return
    }

    questionsContainer.classList.remove('display')
    const currentquestion=questions[currentQueIndex];
    options=[currentquestion.correctAnswer,...currentquestion.incorrectAnswers]
    options.sort(()=>Math.random()-0.5)

    questionDiv.textContent=currentquestion.question.text;
    answerDiv.innerHTML=""
    options.forEach((answer,index)=>{
        const button=document.createElement('button');
        button.textContent=answer;
        button.onclick=()=>checkAnswer(index,options,currentquestion.correctAnswer)
        answerDiv.appendChild(button)
    })
    updateScoreboard();
}


function checkAnswer(index,options,correctAnswer){
    // const rightanswer=questions[currentQueIndex].correctAnswer
    const selectedanswer=options[index]
    
    if(selectedanswer===correctAnswer){
        if(currentplayer===1){
            player1score+=getPoints(currentQueIndex)
        }
        else{
            player2score+=getPoints(currentQueIndex)
        }
    }
   
    currentplayer = currentplayer === 1 ? 2 : 1;
    updateScoreboard();
    nextQuestion();
}

function getPoints(queindex){
    if(queindex<2)return 10;
    if(queindex<4) return 15;
    return 20
}

function nextQuestion(){
    if (currentQueIndex<questions.length-1){
        currentQueIndex++
        displayQuestions()
    }else{
        endthegame()
    }
}

function updateScoreboard(){
    scoreBoard.innerHTML=`<h2>score board</h2>`+
    `<p>player 1 score:${player1score}</p>`+
    `player 2 score: ${player2score} </p>`
}

function endthegame(){
    questionsContainer.classList.add('display')
    scoreBoard.classList.remove('display')

    let winner;
    if (player1score>player2score){
        winner="Player 1 wims"
    }
    else if(player2score>player1score){
        winner="player 2 wins"
    }
    else{
        winner="it is a tie"
    }
    scoreBoard.innerHTML+=`<h2>${winner}</h2>`
    endOptions()
}

function endOptions(){
    endoptions.classList.remove('display')
    playagain.onclick=()=>{
        endoptions.classList.add('display')
        newquiz()
    }

    endbutton.onclick=()=>{
        endbutton.classList.add('display')
        alert("game over")
        resetgame()
    }

}

function newquiz(){
    const remainingcategories=Array.from(selectcategory.options).filter(option=>!selectedCategories.has(option.value))
    resetState()
}

function resetState(){
    questions=[]
    currentQueIndex=0
    player1score=0
    player2score=0
    player1name=""
    player2name=""
    currentplayer=1
    selectcategory.innerHTML=""
    playersinfo.classList.remove("display");
    categories.classList.add("display");
    questionsContainer.classList.add("display");
    scoreBoard.classList.add("display");
    fetchQue.classList.remove('display')
    alert('Game has been reset, Enter player names to start a new one')
    // displayCategories()
}

function resetgame(){
    selectedCategories.clear()
    // scoreBoard.classList.add('display')
    resetState()
    scoreBoard.innerHTML=""
}