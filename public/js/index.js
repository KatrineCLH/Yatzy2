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
    scores = document.getElementById("2").querySelectorAll("input");
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
    fetch("/game/rollbtn").then(response => {
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

        for (let i = 0; i < scores.length; i++) {
            scores[i].value = data.pot[i];
        }
    })


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

/* this part is not refactored */

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


