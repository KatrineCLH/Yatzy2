import exp from "constants";
import express from "express";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const router = express .Router();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', './views')

app.use(express.static("public"))

app.get('/', function (req, res) {

    res.render('yatzy');
})



//Variables used in the various functions
//these two variables should be a dice class
let diceHeld = [false, false, false, false, false];
let diceValues = [0, 0, 0, 0, 0];
//keeps track of turn
let turn = 0;
///should be updated after every turn to next player in game.
let currentPlayer;

//Various functions used in the game
function buttonRoll() {
    if (gameOver()) {
        newGameConfimation();
        return;
    }
    lockChoice();
    rollDice();
    updateDice();
    updateScores();

    turn++; //TODO: fix this to be on after last player.


    document.getElementById("turn").innerText = "Turn " + turn;
    if (turn == 3) {
        rollButton.disabled = true;
        for (let i = 0; i < dice.length; i++) {
            dice[i].style.borderColor = "black";
            diceHeld[i] = false;
        }
    }
}

//Rolls the dice
function rollDice() {
    for (i = 0; i < dice.length; i++) {
        if (!diceHeld[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
}

function createNewPlayer(name) {
    return new Player(name);
}

function updateScore(playername, scoreField) {
    // read json file, get player with name or have a variable that contains current player
    // get scorefield field from player.score.ones etc. and swap value. Probably a switch case
}

class Score {
    constructor() {
        this.ones
        this.twos
        this.threes
        this.fours
        this.fives
        this.sixes
        this.onePair
        this.twoPair
        this.threeSame
        this.fourSame
        this.fullHouse
        this.smallStraight
        this.largeStraight
        this.chance
        this.yatzy
        this.total
        this.sum
        this.result
    }
}

class Player {
    constructor(name) {
        this.score = new Score();
        this.name = name;
    }
}
/*  Fix this to fill a Score object instead and return that*/
function updateScores() {
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
function updateSinglesSum() {
    let singleSum = 0;
    let singles = document.getElementById("2").querySelectorAll("[id$='-s']");
    for (let field of singles) {
        if (field.disabled == true) {
            singleSum += parseInt(field.value);
        }
    }

    document.getElementById("Sum").value = singleSum;
    if (singleSum >= 63) {
        bonus = 50;
        document.getElementById("Bonus").value = 50;
    }
}
//Updates the total field
function updateTotal() {
    document.getElementById("Total").value = points + bonus;
}


/*Fill 1-s, 2-s, 3-s, 4-s, 5-s, 6-s fields*/
function fillSingles() {
    let sumArray = [0, 0, 0, 0, 0, 0];
    for (const no of diceValues) {
        if (no == 1) {
            sumArray[0]++;
        }
        else if (no == 2) {
            sumArray[1] += 2;
        }
        else if (no == 3) {
            sumArray[2] += 3
        }
        else if (no == 4) {
            sumArray[3] += 4
        }
        else if (no == 5) {
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
function fillOnePair() {
    let field = document.getElementById("One pair");
    if (field.disabled == true) { return; }

    let bestPair = 0;
    for (let i = diceValues.length - 1; i >= 1; i--) {
        for (let j = i - 1; j >= 0; j--) {
            if (diceValues[i] === diceValues[j] && bestPair < (2 * diceValues[i])) {
                bestPair = (2 * diceValues[i]);
            }
        }

    }

    field.value = bestPair;
}

/*Two pairs*/
function fillTwoPairs() {
    let field = document.getElementById("Two pairs");
    if (field.disabled == true) { return; }

    let kopi = [...diceValues];
    kopi.sort();
    let result = 0;

    if (kopi[0] === kopi[1] && kopi[2] === kopi[3]) {
        result = 2 * kopi[0] + 2 * kopi[2];
    }
    else if (kopi[1] === kopi[2] && kopi[3] === kopi[4]) {
        result = 2 * kopi[1] + 2 * kopi[3];
    }
    else if (kopi[0] === kopi[1] && kopi[3] === kopi[4]) {
        result = 2 * kopi[0] + 2 * kopi[3];
    }

    field.value = result;
}

/*Three same*/
function fillThreeSame() {
    let field = document.getElementById("Three same");
    if (field.disabled == true) { return; }

    let kopi = [...diceValues];
    kopi.sort();
    let result = 0;

    if (kopi[0] === kopi[1] && kopi[1] === kopi[2]) {
        result = 3 * kopi[0];
    }
    else if (kopi[1] === kopi[2] && kopi[2] === kopi[3]) {
        result = 3 * kopi[1];
    }
    else if (kopi[2] === kopi[3] && kopi[3] === kopi[4]) {
        result = 3 * kopi[2];
    }
    field.value = result;
}

/*Four same*/
function fillFourSame() {
    let field = document.getElementById("Four same");
    if (field.disabled == true) { return; }

    let kopi = [...diceValues];
    kopi.sort();
    let result = 0;

    if (kopi[0] === kopi[1]) {
        if (kopi[1] === kopi[2]) {
            if (kopi[2] === kopi[3]) {
                result = 4 * kopi[0];
            }
        }
    }
    else if (kopi[1] === kopi[2]) {
        if (kopi[2] === kopi[3]) {
            if (kopi[3] === kopi[4]) {
                result = 4 * kopi[1];
            }
        }
    }
    field.value = result;
}

/*Full house*/
function fillFullHouse() {
    let field = document.getElementById("Full house");
    if (field.disabled == true) { return; }

    let kopi = [...diceValues];
    kopi.sort();
    let result = 0;

    if (kopi[0] === kopi[1] && kopi[1] === kopi[2]) {
        if (kopi[3] === kopi[4]) {
            result = 3 * kopi[0] + 2 * kopi[4];
        }
    }
    else if (kopi[2] === kopi[3] && kopi[3] === kopi[4]) {
        if (kopi[0] === kopi[1]) {
            result = 3 * kopi[4] + 2 * kopi[0];
        }
    }

    field.value = result;
}

/*Small straight*/
function fillSmallStraight() {
    let field = document.getElementById("Small straight");
    if (field.disabled == true) { return; }
    let result = 0;
    let kopi = [...diceValues];
    kopi.sort();
    if (kopi[0] === 1) {
        if (kopi[1] === 2) {
            if (kopi[2] === 3) {
                if (kopi[3] === 4) {
                    if (kopi[4] === 5) {
                        result = 15;
                    }
                }
            }
        }
    }
    field.value = result;
}

/*Large straight*/
function fillLargeStraight() {
    let field = document.getElementById("Large straight");
    if (field.disabled == true) { return; }
    let result = 0;
    let kopi = [...diceValues];
    kopi.sort();
    if (kopi[0] === 2) {
        if (kopi[1] === 3) {
            if (kopi[2] === 4) {
                if (kopi[3] === 5) {
                    if (kopi[4] === 6) {
                        result = 20;
                    }
                }
            }
        }
    }
    field.value = result;
}

/*Chance*/
function fillChance() {
    let field = document.getElementById("Chance");
    if (field.disabled == true) { return; }
    let sum = 0;
    for (const no of diceValues) {
        sum += no
    }

    field.value = sum
}

/*Yatzy*/
function fillYatzy() {
    let field = document.getElementById("Yatzy");
    if (field.disabled == true) { return; }

    let result = 0;
    let isYatzy = true;
    let i = 0;
    while (isYatzy && (i < (diceValues.length - 1))) {
        if (diceValues[i] != diceValues[i + 1]) {
            isYatzy = false;
        }
        i++;
    }

    if (isYatzy) {
        result = 50;
    }
    field.value = result;
}



app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});