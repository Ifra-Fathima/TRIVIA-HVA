const start=document.forms["myform"]["submit"];
const categoriesDiv = document.getElementById('categoriesDiv')
const player1=document.forms["myform"]["player1"]
const player2=document.forms["myform"]["player2"]
const selectCategory=document.getElementById("selectCategory")
let player1score = 0;
let player2score = 0;
const scoreBoard = document.getElementById('scoreBoard');
let selectedCategoriesList=new Set()
let questions=[]
const getQuestions=document.getElementById("getQuestions")
const questionDiv= document.getElementById("questions")
const answersDiv=document.getElementById("answers")
let currentPlayer=1
const playAgain=document.getElementById("playAgain")
const endButton=document.getElementById("endButton")

selectCategory.disabled=true
getQuestions.disabled=true
playAgain.disabled=true
endButton.disabled=true

start.addEventListener("click", validateNames)

function validateNames(){
    const player1=document.forms["myform"]["player1"].value.trim();
    const player2=document.forms["myform"]["player2"].value.trim();
    
    if (!player1 || !player2) {
        alert('Please enter names for both players')
        return
    }

    if(player1===player2){
        alert("please enter two different names")
        return
    }
    displayCategories()
}

async function displayCategories(){
    selectCategory.disabled=false
    getQuestions.disabled=false
    player1.disabled=true
    player2.disabled=true
    start.disabled=true

    try{
        const response=await fetch("https://the-trivia-api.com/api/categories")

        if(!response.ok){
            throw new Error("Failed to fetch the categories")
        }

        const data=await response.json()
        selectCategory.innerHTML=""
            
        for(let category in data){
            if(!selectedCategoriesList.has(category)){
                const option =document.createElement("option");
                option.value=category
                option.innerText=category
                selectCategory.appendChild(option)
            }   
        }

    }
    catch(error){
        console.error(error)
        alert("Failed to fetch the categories")
    }
    
}

getQuestions.addEventListener("click",fetchQuestions)

async function fetchQuestions(){
    selectCategory.disabled=true
    getQuestions.disabled=true

    const selectedCategory=selectCategory.value
    const selectedOption=selectCategory.selectedIndex
    selectedCategoriesList.add(selectedCategory)
    selectCategory.remove(selectedOption)

    const formattedcateogry =selectedCategory.toLowerCase().replaceAll(" ",'_').replaceAll("&", 'and');

    let easyques=await fetch(`https://the-trivia-api.com/v2/questions?categories=${formattedcateogry}&difficulties=easy&limit=2`).then(response=>response.json())
    let midques=await fetch(`https://the-trivia-api.com/v2/questions?categories=${formattedcateogry}&difficulties=medium&limit=2`).then(response=>response.json())
    let hardques=await fetch(`https://the-trivia-api.com/v2/questions?categories=${formattedcateogry}&difficulties=hard&limit=2`).then(response=>response.json())

    questions=[...easyques,...midques,...hardques]
    currentQueIndex=0
    displayQuestions()
}

let currentQueIndex=0;

function displayQuestions(){
    answersDiv.innerHTML=""
    const currentQuestion=questions[currentQueIndex]
    options=[...currentQuestion.incorrectAnswers,currentQuestion.correctAnswer]
    options.sort(()=>Math.random()-0.5)
    
    questionDiv.innerHTML=currentQuestion.question.text;
    for(let i=0;i<options.length;i++){
        const button=document.createElement("button")
        button.textContent=options[i]
        button.onclick=()=>checkAnswer(options[i],currentQuestion.correctAnswer)
        answersDiv.appendChild(button)
    }
}


function checkAnswer(selectedAnswer,correctAnswer){
    console.log(selectedAnswer)
    if(selectedAnswer===correctAnswer){
        if(currentPlayer===1){
            player1score+=getPoints(currentQueIndex)
        }
        else{
            player2score+=getPoints(currentQueIndex)
        }
    }
    currentPlayer=currentPlayer===1? 2:1;
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
        currentQueIndex++;
        displayQuestions();
    }else{
        endTheGame()
    }
}

function endTheGame(){
    questionDiv.innerHTML=""
    answersDiv.innerHTML=""
    playAgain.disabled=false
    endButton.disabled=false
    let winner;
    if(player1score>player2score){
        winner="Player 1 Wins!"
    }else if(player2score>player1score){
        winner="Player 2 Wins!"
    }else{
        winner="It is a tie"
    }
    scoreBoard.innerHTML+=`<h2>${winner}</h2>`
    selectCategory.disabled = true
    getQuestions.disabled = true
}


playAgain.onclick=()=>{
    if(selectCategory.options.length===0){
        alert('All categories used, game over')
        resetGame()
    }
    else{
        newQuiz()
        alert('Game has been reset, select a new category!')
    }
    
}

endButton.onclick=()=>{
    alert("Game over, Enter the names to start again!!!")
    resetGame()
}


function updateScoreboard(){
    scoreBoard.innerHTML=`<h2>Score Board</h2 >`+
    `<p>Player 1 Score: ${player1score}</p>`+
    `<p>Player 2 Score: ${player2score}</p>`
}

function resetState(){
    player1score = 0
    player2score = 0
    currentQueIndex = 0
    questions = []
    playAgain.disabled=true
    endButton.disabled=true
    scoreBoard.innerHTML=""
    questionDiv.innerHTML=""
    answersDiv.innerHTML=""
}

function newQuiz(){
    displayCategories()
    resetState()
}

function resetGame(){
    player1.disabled = false
    player2.disabled = false
    start.disabled = false
    player1.value=""
    player2.value=""
    resetState()
    selectCategory.disabled = true
    getQuestions.disabled=true
    endButton.disabled=true
    selectedCategoriesList.clear() 
}

