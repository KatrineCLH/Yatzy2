import { assert } from 'chai';
import { setHeld } from '../app/gameLogic.js';
import Player from '../app/player.js';


describe("Hold a score on a player using setHeld()", () => {
    it('test of setting 1-s to held', () => {
        let p1 = new Player("tester");
        p1.score.ones.value = 1;
        setHeld(0, p1)

        assert.strictEqual(p1.score.ones.held, true);

    })
})