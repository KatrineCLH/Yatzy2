//Variables used in the various functions

import { gameFile } from "./app.js";
import { clearGameFile, saveToFile } from "./fileManagement.js";
import gameState from "./gameState.js";

//these two variables should be a dice class
export let diceValues = [0, 0, 0, 0, 0];
//keeps track of turn
///should be updated after every turn to next player in game.
export let players = [];
export let diceLocked = [false, false, false, false, false]
//Lucas: fields pertinent to gameStatus is now an object
export let gameStatus = {turn: 0, currentPlayer: null, isGameOngoing: true, firstRollDone: false}

export function loadGame(file) {
    //I Literally have no freaking clue why we have multiple variables for the same thing,
    //but I suspect it's due to people working on different branches and not checking when they merge.
    // Or frankly, maybe never looked for the variable at all... not good, might introduce bugs.
    gameStatus.turn = file.gameState.turn
    gameStatus.currentPlayer = file.gameState.currentPlayer;
    gameStatus.isGameOngoing = file.gameState.isGameOngoing;
    players = file.players;
}

//Rolls the dice
export function rollDice() {
    for (let i = 0; i < diceValues.length; i++) {
        if (!diceLocked[i]) {
            diceValues[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
}

export function unlockAllDice() {
    for (let i = 0; i < 5; i++) {
        diceLocked[i] = false;
    }
  }

export function setHeld(i, player) {
    switch(i) {
        case 0:
            player.score.ones.held = true;
            break;
        case 1:
            player.score.twos.held = true;
            break;
        case 2:
            player.score.threes.held = true;
            break;
        case 3:
            player.score.fours.held = true;
            break;
        case 4:
            player.score.fives.held = true;
            break;
        case 5:
            player.score.sixes.held = true;
            break;
        case 6:
            player.score.onePair.held = true;
            break;
        case 7:
            player.score.twoPair.held = true;
            break;
        case 8:
            player.score.threeSame.held = true;
            break;
        case 9:
            player.score.fourSame.held = true;
            break;
        case 10:
            player.score.fullHouse.held = true;
            break;
        case 11:
            player.score.smallStraight.held = true;
            break;
        case 12:
            player.score.largeStraight.held = true;
            break;
        case 13:
            player.score.chance.held = true;
            break;
        case 14:
            player.score.yatzy.held = true;
            break;
        case 15:
            player.score.sum.held = true;
            break;
        case 16:
            player.score.bonus.held = true;
            break;
        case 17:
            player.score.total.held = true;
            break;
        default:
            break;
    }
}

export function lockDie(id) {
    diceLocked[id] = !diceLocked[id];
    return diceLocked[id];
}

export function getPlayer(id) {
    let playerArr = [...players];
    let index = playerArr.findIndex(p => p.name === id);
    console.log('getPlayer() id:    ' + id)
    console.log('getPlayer() index: ' + index)

    return playerArr[index];
}

export function getNextPlayer() {
    let playerArr = [...players];
    let index = playerArr.findIndex(p => p.name === gameStatus.currentPlayer.name);
    //turn 16 denotes the end of the game as all players have picked their 15 fields.
    //Add some handling that says game is over.
    if(index === playerArr.length-1 && gameStatus.turn < 16) {
        gameStatus.turn++;
        index = -1
    }

   return playerArr[index +1]
}

export function emptyPlayers(){
    return players = [];
}

export function saveGame() {
    if(saveToFile(new gameState(players, gameStatus), gameFile)) {
        return true
    }

    return false
}


/*  Fix this to fill a Score object instead and return that*/
export function updateScores(player) {
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
    fillTotal(player);
}


//Updates the sum of the singles fields
export function fillSinglesSum(player) {
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
export function fillTotal(player) {

    let total = 0;
    for (const [key, value] of Object.entries(player.score)) {
        if (key.toString() !== 'sum') {
            total += value
        }
    }
    player.score.total = total

}


/*Fill 1-s, 2-s, 3-s, 4-s, 5-s, 6-s fields*/
export function fillSingles(player) {
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
export function fillOnePair(player) {
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
export function fillTwoPairs(player) {
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
export function fillThreeSame(player) {
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
export function fillFourSame(player) {
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
export function fillFullHouse(player) {
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
export function fillSmallStraight(player) {
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
export function fillLargeStraight(player) {
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
export function fillChance(player) {
    if (player.score.chance.held == true) { return; }
    let sum = 0;
    for (const no of diceValues) {
        sum += no;
    }

    player.score.chance.value = sum;
}

/*Yatzy*/
export function fillYatzy(player) {
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

export function resetStuff(){
    diceLocked = [false, false, false, false, false];
    players = []
    gameStatus = {turn: 1, currentPlayer: null, isGameOngoing: false, firstRollDone: false}
}

//getter og setter
export function setCurrentPlayer(player){
    gameStatus.currentPlayer = player;
}

export function setPlayers(playersss){
    players = playersss;
}

export function setFirstRollDone(isDone){
    gameStatus.firstRollDone = isDone;
}

export function getCurrentPlayer(){
    return gameStatus.currentPlayer;
}