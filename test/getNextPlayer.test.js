import { assert } from 'chai';
import { getCurrentPlayer, getNextPlayer, players, setCurrentPlayer, setPlayers, gameStatus } from '../app/gameLogic.js';
import Player from '../app/player.js';

//

describe("For getNextPlayer()", () => {
    it('Test of array with length 3', () => {
        let jan = new Player("jan")
        let kaj = new Player("kaj")
        let lin = new Player("lin")
        let playersss = [jan, kaj, lin]

        setPlayers(playersss)
        setCurrentPlayer(jan)
        getNextPlayer()

        assert.sameMembers(players, playersss, "players succesfully added to array players")
        assert.equal(getCurrentPlayer(), kaj, "set currentPlayer correctly to next player")
    })
})

/*
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
*/