let scores = [];
let playerName;
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
        field.addEventListener("click", function (e) {
           if(turn != 0 && field.style.backgroundColor != 'lightblue'){
                postChoice(e.target);
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

function postChoice(element) {
    let index = [...scores].indexOf(element);
    fetch('rest/game/lockfield', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id: index})
    }).then(async function(res) {
        if(res.status === 200) {
            return res.json();
        }

        if(res.status === 403){
            let errText = await res.text();
            alert(errText);
        }
        throw new Error ("Something went wrong");

    }).then(function(data) {
        console.log(data);
        for (let i = 0; i < scores.length; i++) {
            const score = getScore(i, data.player.score);
            scores[i].value = score.value;
            if(score.held === true) {
                scores[i].style.backgroundColor = 'lightblue';
            } else {
                scores[i].style.backgroundColor = 'white';
            }
        }
        document.getElementById('playerName').innerText ="Spiller: " + data.player.name;
        turn = data.turn;
        rollButton.disabled = false;
    })
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
            scores[i].value = getScore(i, data.pot).value;
        }
    })


}

function getScore(i, score){
    switch(i) {
        case 0: return score.ones;
        case 1: return score.twos;
        case 2: return score.threes;
        case 3: return score.fours;
        case 4: return score.fives;
        case 5: return score.sixes;
        case 6: return score.onePair;
        case 7: return score.twoPair;
        case 8: return score.threeSame;
        case 9: return score.fourSame;
        case 10: return score.fullHouse;
        case 11: return score.smallStraight;
        case 12: return score.largeStraight;
        case 13: return score.chance;
        case 14: return score.yatzy;
        case 15: return score.sum;
        case 16: return score.bonus;
        case 17: return score.total;
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


