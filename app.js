import express from "express";
import path from "path";
import HttpStatus from "http-status-codes";
import fileStream from "fs";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const userFile = "users.txt";
const gameFile = "game.txt"

const app = express();
const router = express.Router();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', './views')
app.use(express.static("public"))
app.use(express.json());

app.get('/', function (req, res) {
    const file = getGameFile();

    if(file === null || file.gameState.isGameOngoing === false) {
        res.render('error', {error: "No game started. Go to /register to start game."});
        return;
    }
    console.log(file);

    currentPlayer = file.gameState.currentPlayer;
    players = file.players;
    res.render('yatzy', {name : currentPlayer.name, players: players});
})

app.get('/register', function (req, res) {
    res.render('register')
})

//REST CALLS UNDER HERE

router.route('/game/rollbtn')
    .get((req, res) => {
        if(firstRollDone === false) {
            firstRollDone = true;
        } 
        rollDice();
        updateScores(currentPlayer);
        let result = { pot: currentPlayer.score, dice: diceValues };
        res.status(HttpStatus.ACCEPTED).json(result);
    });

router.route('/game/lockfield')
    .post((req, res) => {
        if(firstRollDone === false) {
            res.status(HttpStatus.FORBIDDEN).send("You must roll atleast once before locking in a choice.");
            return;
        }
        firstRollDone = false;
        setHeld(req.body.id, currentPlayer);
        currentPlayer = getNextPlayer();
        res.status(HttpStatus.OK).json({player: currentPlayer, turn: turn });
    })

router.route('/register')
    .post((req, res) => {
    let user = new User(req.body.name);

    if(!fileStream.existsSync(userFile)) {
        //add something about why
       res.status(HttpStatus.METHOD_FAILURE).send();
       return;
    }

    let content = fileStream.readFileSync(userFile)
    let userList = [];
    if(content.length > 0) {
        userList = JSON.parse(content);
        if(userList.filter( function(u) { return u.name === user.name}).length > 0) {
            //add that username already exists to response
            res.status(HttpStatus.NOT_MODIFIED).send();
            return;
        }
    }

    userList.push(user)
    fileStream.writeFile(userFile, JSON.stringify(userList), function(err) {
        if(err) {
            console.log("tried to save " + user.name + ", to file but failed");
        }
    })
    res.status(HttpStatus.OK).json(JSON.stringify(userList)).send();
    
})

.get((req, res) => {
    let userList = getUsers();
    res.status(HttpStatus.OK).json(JSON.stringify(userList));
})

router.route('/startGame')
    .post((req, res) => {

        if(!fileStream.existsSync(userFile)) {
           res.status(HttpStatus.NOT_FOUND).send(userFile + " could not be found");
           return;
        }
        let userList = req.body.users
        userList.sort()
        for(const u of userList) {
            players.push(new Player(u.name))
        }


        //tager mod listen over de tilmeldte spillere
        if (userList.length > 0) {

            //gør gameStatus klar til afsending
            gameStatus.turn = 0
            gameStatus.isGameOngoing = true
            gameStatus.currentPlayer = userList[0]
            
            //skriver til game.txt med spillende brugere og nuværende gameStatus
            fileStream.writeFileSync(gameFile, JSON.stringify(new gameState(players, gameStatus)), (err) => {
                if (err) {
                    let message = "tried to write " + user.name + ", to file but something went wrong"
                    console.log(message)
                    res.status(HttpStatus.METHOD_FAILURE).send(message)
                    return;
                }
            })
            
            

            res.status(HttpStatus.OK).send()
            return;
        }

        res.status(HttpStatus.BAD_REQUEST).send("No users selected")
        return;
    })

//MUST BE AT THE BOTTOM OF ALL THE ROUTER CODE
app.use('/rest', router);





//Variables used in the various functions
//these two variables should be a dice class
let diceHeld = [false, false, false, false, false];
let diceValues = [0, 0, 0, 0, 0];
//keeps track of turn
let turn = 1;
let firstRollDone = false;
///should be updated after every turn to next player in game.
let currentPlayer;
let players = [];
//Lucas: fields pertinent to gameStatus is now an object
let gameStatus = {turn: 0, currentPlayer: null, isGameOngoing: true}


function getGameFile() {
    try {
      return JSON.parse(fileStream.readFileSync(gameFile));
    }
    catch{
        return null;
    }

}



//Rolls the dice
function rollDice() {
    for (let i = 0; i < diceValues.length; i++) {
        if (!diceHeld[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
}

function setHeld(i, player){
    switch(i) {
        case 0: return player.score.ones.held = true;
        case 1: return player.score.twos.held = true;
        case 2: return player.score.threes.held = true;
        case 3: return player.score.fours.held = true;
        case 4: return player.score.fives.held = true;
        case 5: return player.score.sixes.held = true;
        case 6: return player.score.onePair.held = true;
        case 7: return player.score.twoPair.held = true;
        case 8: return player.score.threeSame.held = true;
        case 9: return player.score.fourSame.held = true;
        case 10: return player.score.fullHouse.held = true;
        case 11: return player.score.smallStraight.held = true;
        case 12: return player.score.largeStraight.held = true;
        case 13: return player.score.chance.held = true;
        case 14: return player.score.yatzy.held = true;
        case 15: return player.score.sum.held = true;
        case 16: return player.score.bonus.held = true;
        case 17: return player.score.total.held = true;
        default: return 0;
        
    }
}

function getNextPlayer() {
    let playerArr = [...players];
    let index = playerArr.indexOf(currentPlayer);
    //turn 16 denotes the end of the game as all players have picked their 15 fields.
    //Add some handling that says game is over.

    if(index === playerArr.length-1 && turn < 16) {
        turn++;
        index = -1
    }

   return playerArr[index +1]
}


function updateScore(playername, scoreField) {
    // read json file, get player with name or have a variable that contains current player
    // get scorefield field from player.score.ones etc. and swap value. Probably a switch case
}

function getUsers(){
    if(!fileStream.existsSync(userFile)) {
        //add something about why
       res.status(HttpStatus.METHOD_FAILURE).send();
       return;
    }
    let userList = [];
    let content = fileStream.readFileSync(userFile)
    try {
        userList = JSON.parse(content);
        //there should always only be one, so we're just returning first.
        return userList;
    } catch(e) {
        console.log("error reading json file " + e)
    }

    return userList;
}

function getUser(username) {
    if(!fileStream.existsSync(userFile)) {
        //add something about why
        console.log("No file for users found")
        return;
    }
    let userList = [];
    let content = fileStream.readFileSync(userFile)
    try {
        userList = JSON.parse(content);
        //there should always only be one, so we're just returning first.
        return userList.filter((u)=> u.name === username)[0];
    } catch(e) {
        console.log("error reading json file" + e)
    }

    return null;
}

class Score {
    constructor() {
        this.ones = {held: false, value: 0}
        this.twos = {held: false, value: 0}
        this.threes = {held: false, value: 0}
        this.fours = {held: false, value: 0}
        this.fives = {held: false, value: 0}
        this.sixes = {held: false, value: 0}
        this.onePair = {held: false, value: 0}
        this.twoPair = {held: false, value: 0}
        this.threeSame = {held: false, value: 0}
        this.fourSame = {held: false, value: 0}
        this.fullHouse = {held: false, value: 0}
        this.smallStraight = {held: false, value: 0}
        this.largeStraight = {held: false, value: 0}
        this.chance = {held: false, value: 0}
        this.yatzy = {held: false, value: 0}
        this.total = {held: false, value: 0}
        this.sum = {held: false, value: 0}
        this.bonus = {held: false, value: 0}
        this.result = {held: false, value: 0}
    }
}

class Player {
    constructor(name) {
        this.score = new Score();
        this.name = name;
    }
}

class gameState {
    constructor(playingUsers, currentGameState) {
        this.players = playingUsers
        this.gameState = currentGameState
    }
}

//move to another file, export
class User {
    constructor(name) {
        this.name = name;
    }
}
/*  Fix this to fill a Score object instead and return that*/
function updateScores(player) {
    fillSingles(player);
    fillOnePair(player);
    fillTwoPairs(player);
    fillThreeSame(player);
    fillFourSame(player);
    fillFullHouse(player);
    fillSmallStraight(player);
    fillLargeStraight(player);
    fillChance(player);
    fillYatzy(player);
    fillSinglesSum(player);
    //fillTotal(player);
}


//Updates the sum of the singles fields
function fillSinglesSum(player) {
    let singleSum = 0;
    let singles = [player.score.ones, player.score.twos, player.score.threes, player.score.fours, player.score.fives, player.score.sixes];
    for (let field of singles) {
        if (field.held == true) {
            singleSum += parseInt(field.value);
        }
    }

    player.score.sum.value = singleSum;
    if (singleSum >= 63) {
        bonus = 50;
        player.score.bonus.value = 50;
    }
}
//Updates the total field
function fillTotal() {
    document.getElementById("Total").value = points + bonus;
}


/*Fill 1-s, 2-s, 3-s, 4-s, 5-s, 6-s fields*/
function fillSingles(player) {
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

    if (player.score.ones.held == false) player.score.ones.value = sumArray[0];
    if (player.score.twos.held == false) player.score.twos.value = sumArray[1];
    if (player.score.threes.held == false) player.score.threes.value = sumArray[2];
    if (player.score.fours.held == false) player.score.fours.value = sumArray[3];
    if (player.score.fives.held == false) player.score.fives.value = sumArray[4];
    if (player.score.sixes.held == false) player.score.sixes.value = sumArray[5];
}

/*One pair*/
function fillOnePair(player) {
    if (player.score.onePair.held == true) { return; }

    let bestPair =  0;
    for (let i = diceValues.length - 1; i >= 1; i--) {
        for (let j = i - 1; j >= 0; j--) {
            if (diceValues[i] === diceValues[j] && bestPair < (2 * diceValues[i])) {
                bestPair = (2 * diceValues[i]);
            }
        }

    }

    player.score.onePair.value = bestPair;
}

/*Two pairs*/
function fillTwoPairs(player) {
    if (player.score.twoPair.held == true) { return; }

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

    player.score.twoPair.value = result;
}

/*Three same*/
function fillThreeSame(player) {
    if (player.score.threeSame.held == true) { return; }

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
    player.score.threeSame.value = result;
}

/*Four same*/
function fillFourSame(player) {
    if (player.score.fourSame.held == true) { return; }

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
    player.score.fourSame.value = result;
}

/*Full house*/
function fillFullHouse(player) {
    if (player.score.fullHouse.held == true) { return; }

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

    player.score.fullHouse.value = result;
}

/*Small straight*/
function fillSmallStraight(player) {
    if (player.score.smallStraight.held == true) { return; }
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
    player.score.smallStraight.value = result;
}

/*Large straight*/
function fillLargeStraight(player) {
    if (player.score.largeStraight.held == true) { return; }
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
    player.score.largeStraight.value = result;
}

/*Chance*/
function fillChance(player) {
    if (player.score.chance.held == true) { return; }
    let sum = 0;
    for (const no of diceValues) {
        sum += no;
    }

    player.score.chance.value = sum;
}

/*Yatzy*/
function fillYatzy(player) {
    if (player.score.yatzy.held == true) { return; }

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
    player.score.yatzy.value = result;
}



app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});