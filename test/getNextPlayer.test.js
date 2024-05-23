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
        let cPlayer = getNextPlayer();
        setCurrentPlayer(cPlayer);

        assert.sameMembers(players, playersss, "players succesfully added to array players")
        assert.equal(gameStatus.currentPlayer, kaj, "set currentPlayer correctly to next player")
    })
})