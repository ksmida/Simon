//Global variables that keep track of game's state
let gamePattern = []; //Sequence of colors generated by the game
let userClickedPattern = []; //User's input sequence
let buttonColors = ["red", "blue", "green", "yellow"]; //Available colors
let levelNumber = 1; //Starting level
let gameStarted = false; //Flag to check if game has started

//User can interact with DOM when content is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  
  //Initializes continously flashing top heading and captures its interval id
  let topHeadingIntervalId = setTopHeading();

  //Listens for keyboard input to start game
  document.addEventListener("keydown", function() {
    if (!gameStarted) {
      removeBottomHeading();
      gameStarted = true; 
      pauseFlashingTopHeading(topHeadingIntervalId); 
      nextSequence(); //Begins game and controls subsequent rounds
    }
  })

  //Listens for user clicks and repsonds with correct audio and visual effects
  $(".btn").on("click", function () {
      let userChosenColor = $(this).attr("id");
      userClickedPattern.push(userChosenColor);
      userClickedFlashAndSound(userChosenColor);
      compareArrays(userClickedPattern.length - 1);
    });

});

//Pauses flashing effect for top heading and ensures visibility
function pauseFlashingTopHeading(intervalId) {
  clearInterval(intervalId);
  document.querySelector("#level-title").classList.remove("invisible");
}

//Updates heading at top of screen with current level number
function displayLevel() {
  document.querySelector("#level-title").textContent = "LEVEL " + levelNumber;
}

//Resets game state variables and updates headings
function levelReset() {
  removeTopHeading();
  setBottomHeading();
  levelNumber = 1;
  gameStarted = false;
  userClickedPattern = [];
  gamePattern = [];
}

/*Generates next color, updates game and user arrays, and 
executes audio and visual effects*/
function nextSequence() {
  displayLevel();
  userClickedPattern = [];
  let randomNumber = Math.floor(Math.random()*4);
  let randomChosenColor = buttonColors[randomNumber];

  gamePattern.push(randomChosenColor);
  nextSequenceFlashAndSound(randomChosenColor);
}  

//Flashes game-generated random color and plays corresponding sound
function nextSequenceFlashAndSound(nextSequenceColor) {
  colorFlash(nextSequenceColor);
  playSound(nextSequenceColor);
}

//Flashes user-chosen color and plays corresponding sound
function userClickedFlashAndSound(userChosenColor) {
  colorFlash(userChosenColor);
  playSound(userChosenColor);
}

/*Compares game-generated array with user-clicked array for current level "i".
Begins next round if matching, resets if mismatch.*/
function compareArrays(i) {
  if (gamePattern[i] === userClickedPattern[i]) {
    if (gamePattern.length === userClickedPattern.length) {
      beginNextRound();
    }
  }
  else {
    flashRedBackground();
    playSound("wrong");
    levelReset();
  }
    return true;
}

/*Prepares game for next round with user-array reset, level increase, and one
second delay*/
function beginNextRound() {
  userClickedPattern = [];
  levelNumber++;
  setTimeout((nextSequence), 1000)
}

//Button press animation
function colorFlash(flashedColor) {
  $("#" + flashedColor).addClass("pressed");
  setTimeout(function () {
  $("#" + flashedColor).removeClass("pressed");
  }, 125)
}

//Sound file is played based on color or error
function playSound(soundColor) {
  let audio = new Audio("./sounds/" + soundColor + ".mp3")
  audio.play();
  }

//Background flashes red upon error
function flashRedBackground() {
  $("body").css("background-color", "#FF0000");
  setTimeout(function() {
    $("body").css("background-color", "#011F3F");
  }, 125)
}

//Displays continously flashing heading at top of screen
function setTopHeading() {
  let topHeadingIntervalId = setInterval(function() {
    document.querySelector("h1").classList.toggle("invisible");
  }, 500);
  return topHeadingIntervalId;
}

//Removes heading at top of screen
function removeTopHeading() {
  document.querySelector("h1").classList.add("invisible");
}

//Displays restart message when user loses
function setBottomHeading() {
    document.querySelector("#restart").classList.remove("invisible");
  }
  
//Hides restart heading
function removeBottomHeading() {
  document.querySelector("#restart").classList.add("invisible");
}