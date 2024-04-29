//Variables used in the various functions
let diceHeld = [false, false, false, false, false];
let diceValues = [0, 0, 0, 0, 0];
let turn = 0;
let points = 0;
let bonus = 0;


//Roll button for dice
let rollButton = document.getElementById("rollButton");
rollButton.onclick = () => buttonRoll();

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
let scores = document.getElementById("2").querySelectorAll("input");
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

//Various functions used in the game
function buttonRoll(){
  if (gameOver()){
    newGameConfimation();
    return;
  }
  lockChoice();
  rollDice();
  updateDice();
  updateScores();
  turn++;
  document.getElementById("turn").innerText = "Turn " + turn;
  if (turn == 3){
      rollButton.disabled = true;
      for (let i = 0; i < dice.length; i++) {
        dice[i].style.borderColor = "black";
        diceHeld[i] = false;
      }
    }
}
//Rolls the dice
function rollDice(){
    for (i = 0; i < dice.length; i++){
        if (!diceHeld[i]){
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
}
//Updates the dice images
function updateDice(){
    for (i = 0; i < dice.length; i++){
        if (!diceHeld[i]){
            switch(diceValues[i]){
                case 1:
                    dice[i].src = "dice-six-faces-one.png";
                    break;
                case 2:
                    dice[i].src = "dice-six-faces-two.png";
                    break;
                case 3:
                    dice[i].src = "dice-six-faces-three.png";
                    break;
                case 4:
                    dice[i].src = "dice-six-faces-four.png";
                    break;
                case 5:
                    dice[i].src = "dice-six-faces-five.png";
                    break;
                case 6:
                    dice[i].src = "dice-six-faces-six.png";
                    break;
            }
        }
    }
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


/*Fill 1-s, 2-s, 3-s, 4-s, 5-s, 6-s fields*/
function fillSingles() {
  let sumArray = [0,0,0,0,0,0];
  for (const no of diceValues) {
    if(no == 1){
      sumArray[0]++;
    }
    else if (no == 2){
      sumArray[1] += 2;
    }
    else if (no == 3){
      sumArray[2] += 3
    }
    else if (no == 4){
      sumArray[3] += 4
    }
    else if (no == 5){
      sumArray[4] += 5
    }
    else {
      sumArray[5] += 6
    }
  }

  let one = document.getElementById("1-s");
  let two = document.getElementById("2-s");
  let three = document.getElementById("3-s");
  let four = document.getElementById("4-s");
  let five = document.getElementById("5-s");
  let six = document.getElementById("6-s");

  if (one.disabled == false) one.value = sumArray[0];
  if (two.disabled == false) two.value = sumArray[1];
  if (three.disabled == false) three.value = sumArray[2];
  if (four.disabled == false) four.value = sumArray[3];
  if (five.disabled == false) five.value = sumArray[4];
  if (six.disabled == false) six.value = sumArray[5];
}

/*One pair*/
function fillOnePair(){
  let field = document.getElementById("One pair");
  if (field.disabled == true){return;}
  
  let bestPair = 0;
  for (let i = diceValues.length - 1; i >= 1; i--) {
    for (let j = i - 1; j >= 0; j--) {
      if (diceValues[i] === diceValues[j] && bestPair < (2 * diceValues[i])){
        bestPair = (2 * diceValues[i]);
      }
    }
  
  }

  field.value = bestPair;
}

/*Two pairs*/
function fillTwoPairs(){
  let field = document.getElementById("Two pairs");
  if (field.disabled == true){return;}

  let kopi = [...diceValues];
  kopi.sort();
  let result = 0;

  if (kopi[0] === kopi[1] && kopi[2] === kopi[3]){
    result = 2 * kopi[0] + 2 * kopi[2];
  }
  else if (kopi[1] === kopi[2] && kopi[3] === kopi[4]){
    result = 2 * kopi[1] + 2 * kopi[3];
  }
  else if (kopi[0] === kopi[1] && kopi[3] === kopi[4]){
    result = 2 * kopi[0] + 2 * kopi[3];
  }

  field.value = result;
}

/*Three same*/
function fillThreeSame(){
  let field = document.getElementById("Three same");
  if (field.disabled == true){return;}

  let kopi = [...diceValues];
  kopi.sort();
  let result = 0;

  if (kopi[0] === kopi[1] && kopi[1] === kopi[2]){
    result = 3 * kopi[0];
  }
  else if (kopi[1] === kopi[2] && kopi[2] === kopi[3]){
    result = 3 * kopi[1];
  }
  else if (kopi[2] === kopi[3] && kopi[3] === kopi[4]){
    result = 3 * kopi[2];
  }
  field.value = result;
}

/*Four same*/
function fillFourSame(){
  let field = document.getElementById("Four same");
  if (field.disabled == true){return;}

  let kopi = [...diceValues];
  kopi.sort();
  let result = 0;

  if (kopi[0] === kopi[1]){
    if (kopi[1] === kopi[2]){
      if (kopi[2] === kopi[3]){
        result = 4 * kopi[0];
      }
    }
  }
  else if (kopi[1] === kopi[2]){
    if (kopi[2] === kopi[3]){
      if (kopi[3] === kopi[4]){
        result = 4 * kopi[1];
      }
    }
  }
  field.value = result;
}

/*Full house*/
function fillFullHouse(){
  let field = document.getElementById("Full house");
  if (field.disabled == true){return;}

  let kopi = [...diceValues];
  kopi.sort();
  let result = 0;

  if (kopi[0] === kopi[1] && kopi[1] === kopi[2]){
    if (kopi[3] === kopi[4]){
      result = 3 * kopi[0] + 2 * kopi[4];
    }
  }
  else if (kopi[2] === kopi[3] && kopi[3] === kopi[4]){
    if (kopi[0] === kopi[1]){
      result = 3 * kopi[4] + 2 * kopi[0];
    }
  }

  field.value = result;
}

/*Small straight*/
function fillSmallStraight(){
  let field = document.getElementById("Small straight");
  if (field.disabled == true){return;}
  let result = 0;
  let kopi = [...diceValues];
  kopi.sort();
  if (kopi[0] === 1){
    if (kopi[1] === 2){
      if (kopi[2] === 3){
        if (kopi[3] === 4){
          if (kopi[4] === 5){
            result = 15;
          }
        }
      }
    }
  }
  field.value = result;
}

/*Large straight*/
function fillLargeStraight(){
  let field = document.getElementById("Large straight");
  if (field.disabled == true){return;}
  let result = 0;
  let kopi = [...diceValues];
  kopi.sort();
  if (kopi[0] === 2){
    if (kopi[1] === 3){
      if (kopi[2] === 4){
        if (kopi[3] === 5){
          if (kopi[4] === 6){
            result = 20;
          }
        }
      }
    }
  }
  field.value = result;
}

/*Chance*/
function fillChance(){
  let field = document.getElementById("Chance");
  if (field.disabled == true){return;}
  let sum = 0;
  for (const no of diceValues) {
    sum += no
  }

  field.value = sum
}

/*Yatzy*/
function fillYatzy(){
  let field = document.getElementById("Yatzy");
  if (field.disabled == true){return;}

  let result = 0;
  let isYatzy = true;
  let i = 0;
  while (isYatzy && (i < (diceValues.length - 1))){
    if (diceValues[i] != diceValues[i+1]){
      isYatzy = false;
    }
    i++;
  }

  if(isYatzy){
    result = 50;
  }
  field.value = result;
}
//Updates the scores, total and bonus feilds
function updateScores(){
  fillSingles();
  fillOnePair();
  fillTwoPairs();
  fillThreeSame();
  fillFourSame();
  fillFullHouse();
  fillSmallStraight();
  fillLargeStraight();
  fillChance();
  fillYatzy();
  updateSinglesSum();
  updateTotal();
}
//Updates the sum of the singles fields
function updateSinglesSum(){
  let singleSum = 0;
  let singles = document.getElementById("2").querySelectorAll("[id$='-s']");
  for (let field of singles){
    if (field.disabled == true){
      singleSum += parseInt(field.value);
    }
  }

  document.getElementById("Sum").value = singleSum;
  if (singleSum >= 63){
    bonus = 50;
    document.getElementById("Bonus").value = 50;
  }
}
//Updates the total field
function updateTotal(){
  document.getElementById("Total").value = points + bonus;
}