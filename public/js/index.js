let scores;
//Dice images
let diceImages;
let diceValues = [0, 0, 0, 0, 0];
//Roll button for dice
let rollButton = document.getElementById("rollButton");
rollButton.onclick = () => buttonRoll();


//Window onload. Do all the variable stuff here
window.onload = function () {
    //Extracting all input fields (scores)and attaching event clickers
    scores = document.querySelectorAll("input");
    for (let field of scores) {
        field.addEventListener("click", function () {
            if (turn != 0) {
                if (field.style.backgroundColor != "lightblue") {
                    for (let otherField of scores) {
                        otherField.style.backgroundColor = "white";
                    }
                    field.style.backgroundColor = "lightblue";
                    rollButton.disabled = false;
                }
                else {
                    field.style.backgroundColor = "white";
                }
            }
        });
    }

    //Dice event listeners
    dice = [document.getElementById('die1'), document.getElementById('die2'), document.getElementById('die3'),
    document.getElementById('die4'), document.getElementById('die5')];
    for (let i = 0; i < dice.length; i++) {
        dice[i].addEventListener("click", function () {
            if (turn != 0) {
                diceHeld[i] = !diceHeld[i];
            }
            if (diceHeld[i]) {
                dice[i].style.borderColor = "red";
            }
            else {
                dice[i].style.borderColor = "black"
            }
        });
    }
}


function buttonRoll() {
    rollButton.disabled = true;
    //restcall to backend //TEST EXAMPLE
    fetch("rest/game/rollbtn").then(response => {
        if (!response.ok) {
            throw new Error("ain't working")
        }

        return response.json();
    }).then(data => {
        console.log(data);
        for (let i = 0; i < dice.length; i++) {
            diceValues[i] = data.dice[i];
            dice[i].style.borderColor = "black";
        }

        updateDice();
        console.log(scores);
        for (let i = 0; i < scores.length; i++) {
            scores[i].value = getValue(i, data.pot);
        }
    })


}

function getValue(i, score){
    switch(i) {
        case 0: return score.ones.value;
        case 1: return score.twos.value;
        case 2: return score.threes.value;
        case 3: return score.fours.value;
        case 4: return score.fives.value;
        case 5: return score.sixes.value;
        case 6: return score.onePair.value;
        case 7: return score.twoPair.value;
        case 8: return score.threeSame.value;
        case 9: return score.fourSame.value;
        case 10: return score.fullHouse.value;
        case 11: return score.smallStraight.value;
        case 12: return score.largeStraight.value;
        case 13: return score.chance.value;
        case 14: return score.yatzy.value;
        case 15: return score.sum.value;
        case 16: return score.bonus.value;
        case 17: return score.total.value;
        default: return 0;
        
    }
}

//Updates the dice images
function updateDice() {
    for (i = 0; i < dice.length; i++) {
        switch (diceValues[i]) {
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

function resetGame() {
    for (let field of scores) {
        field.style.backgroundColor = "white";
        field.disabled = false;
        field.value = "";
    }

    for (let i = 0; i < dice.length; i++) {
        diceValues[i] = 0;
        diceHeld[i] = false;
        dice[i].style.borderColor = "black"
    }

    dice[0].src = "dice-six-faces-one.png";
    dice[1].src = "dice-six-faces-two.png";
    dice[2].src = "dice-six-faces-three.png";
    dice[3].src = "dice-six-faces-four.png";
    dice[4].src = "dice-six-faces-five.png";


    rollButton.disabled = false;
}







/* this part is not refactored */


//Locks the choice of a field, called when the roll button is pressed
function lockChoice() {
    for (let field of scores) {
        if (field.style.backgroundColor == "lightblue") {
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
function resetGame() {
    for (let field of scores) {
        field.style.backgroundColor = "white";
        field.disabled = false;
        field.value = "";
    }

    for (let i = 0; i < dice.length; i++) {
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
function newGameConfimation() {
    let total = document.getElementById("Total").value;
    if (confirm("Game over, you got " + total + " points. Do you want to play again?") == true) {
        location.reload();
    }
}

//Checks if the game is over
function gameOver() {
    for (let field of scores) {
        if (field.disabled == false) {
            return false;
        }
    }
    return true;
}


