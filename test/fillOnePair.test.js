import { assert } from 'chai';
import { fillOnePair, diceValues, setDiceValues } from '../app/gameLogic.js';
import Player from '../app/player.js';

//to ens terninger
//2 x to ens terninger
//nul ens terninger

describe('For fillOnePair()', () => {
    it('Should not add a pair to the score of the player', () => {
        let bob = new Player("bob")
        setDiceValues(1,2,3,4,5)
        fillOnePair(bob)
        assert.equal(bob.score.onePair.value, 0, "no pair among the die, so no score added")
    })
    it('Should add the only pair present to the score of the player', () => {
        let ole = new Player("ole")
        setDiceValues(1,1,3,4,5)
        fillOnePair(ole)
        assert.equal(ole.score.onePair.value, 2, "one pair among the die, so score added")
    })
    it('Should add the biggest pair present to the score of the player', () => {
        let lis = new Player("lis")
        setDiceValues(1,1,3,3,5)
        fillOnePair(lis)
        assert.equal(lis.score.onePair.value, 6, "two pairs among the die, so highest pair added")
    })
})

/*
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
*/