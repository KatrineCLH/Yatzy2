let scores = document.getElementById("2").querySelectorAll("input");
//Roll button for dice
let rollButton = document.getElementById("rollButton");
rollButton.onclick = () => buttonRoll();



function buttonRoll() {
    rollButton.disabled = true;
    //restcall to backend //TEST EXAMPLE
    fetch("ourUrl/rollbtn").then(response => {
        if(!response.ok) {
            throw new Error("ain't working")
        }

        return response.json();
    }).then(data => {
        for (let i = 0; i < dice.length; i++) {
            dice[i] = data.dice[i];
            dice[i].style.borderColor = "black";
            diceHeld[i] = false;
        }

        updateDice();

        for(let i = 0; i < scores.length; i++) {
            scores[i].value(data.scores[i]);
        }
    })

    
}

//Updates the dice images
function updateDice(){
    for (i = 0; i < dice.length; i++){
        if (!diceHeld[i]){
            switch(diceValues[i]){
                case 1:
                    dice[i].src = "../DiceImages/dice-six-faces-one.png";
                    break;
                case 2:
                    dice[i].src = "../DiceImages/dice-six-faces-two.png";
                    break;
                case 3:
                    dice[i].src = "../DiceImages/dice-six-faces-three.png";
                    break;
                case 4:
                    dice[i].src = "../DiceImages/dice-six-faces-four.png";
                    break;
                case 5:
                    dice[i].src = "../DiceImages/dice-six-faces-five.png";
                    break;
                case 6:
                    dice[i].src = "../DiceImages/dice-six-faces-six.png";
                    break;
            }
        }
    }
}

//Dice event listeners
let dice = [document.getElementById('die1'), document.getElementById('die2'), document.getElementById('die3'), 
document.getElementById('die4'), document.getElementById('die5')];
for (let i = 0; i < dice.length; i++){
    dice[i].addEventListener("click", function(){
        if (turn != 0){
            diceHeld[i] = !diceHeld[i];
        }
        if (diceHeld[i]){
          dice[i].style.borderColor = "red";
        }
        else {
          dice[i].style.borderColor = "black"
        }
    });
}

// selecting and deselecting fields in the DOM
for (let field of scores){
  field.addEventListener("click", function(){
      if (turn != 0){
        if (field.style.backgroundColor != "lightblue"){
          for (let otherField of scores){
            otherField.style.backgroundColor = "white";
          }
          field.style.backgroundColor = "lightblue";
          rollButton.disabled = false;
        }
        else{
          field.style.backgroundColor = "white";
        }
      }
});
}



//Locks the choice of a field, called when the roll button is pressed
function lockChoice(){
    for (let field of scores){
        if (field.style.backgroundColor == "lightblue"){
            field.style.backgroundColor = "white";
            field.disabled = true;
            points += parseInt(field.value);
            for (let i = 0; i < dice.length; i++) {
              dice[i].style.borderColor = "black";
              diceHeld[i] = false;
            }
            turn = 0;
        }
    }
}

//This is the old resetGame function, left for posterity. As a reminder of how not to write code.
function resetGame(){
  for (let field of scores){
      field.style.backgroundColor = "white";
      field.disabled = false;
      field.value = "";
  }
  
  for (let i = 0; i < dice.length; i++){
      diceValues[i] = 0;
      diceHeld[i] = false;
      dice[i].style.borderColor = "black"
  }

  dice[0].src = "dice-six-faces-one.png";
  dice[1].src = "dice-six-faces-two.png";
  dice[2].src = "dice-six-faces-three.png";
  dice[3].src = "dice-six-faces-four.png";
  dice[4].src = "dice-six-faces-five.png";

  turn = 0;
  points = 0;
  bonus = 0;
  document.getElementById("turn").innerText = "Turn " + turn;
  document.getElementById("Sum").value = "";
  document.getElementById("Bonus").value = "";
  document.getElementById("Total").value = "";

  rollButton.disabled = false;
}

//New game confirmation box
function newGameConfimation(){
  let total = document.getElementById("Total").value;
  if (confirm("Game over, you got " + total + " points. Do you want to play again?") == true){
    location.reload();
  }
}

//Checks if the game is over
function gameOver(){
    for (let field of scores){
        if (field.disabled == false){
            return false;
        }
    }
    return true;
}


