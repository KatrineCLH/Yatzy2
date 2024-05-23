import { assert } from 'chai';
import { resetStuff, diceLocked, players, gameStatus, lockDie, setCurrentPlayer } from '../app/gameLogic.js';
import Player from '../app/player.js';

/*
export function resetStuff(){
    diceLocked = [false, false, false, false, false];
    players = []
    gameStatus = {turn: 1, currentPlayer: null, isGameOngoing: false, firstRollDone: false}
}
*/

describe( 'For resetStuff()', () => {
    it('Should change lock status of die (test lockDie())', () => {
        //change lock status of a die and compare with old value to see if lockDie()-method works
        let oldDiceLocked = [...diceLocked]
        lockDie(0);
        assert.notEqual(oldDiceLocked[0], diceLocked[0], "dice lock status changed to opposite")
    })
    it('Should ensure there is data to reset', () => {
        //make a player and insert them into players array
        let bob = new Player("bob")
        players[0] = bob

        //change some of the values of gameStatus
        setCurrentPlayer(bob)
        gameStatus.isGameOngoing = true;

        //test if the necessary variables have data that can be resetted
        assert.include(diceLocked, true, "one or more dice are currently locked")
        assert.isNotEmpty(players, "array players is not empty")
        assert.isNotNull(gameStatus.currentPlayer, "current player is not null")
        assert.equal(gameStatus.isGameOngoing, true, "game is ongoing")
    })
    it('Should reset data', () => {
        //reset and test
        resetStuff();

        assert.sameMembers(diceLocked, [false, false, false, false, false], "all dice are unlocked")
        assert.isEmpty(players, "player array is now empty")
        assert.isNull(gameStatus.currentPlayer, "current player is now null")
        assert.equal(gameStatus.isGameOngoing, false, "game is no longer ongoing")
    })
}
)