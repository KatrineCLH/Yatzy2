import { assert } from "chai";
import fileStream from "fs";
import { clearGameFile } from "../app/fileManagement.js";

const gameFile = 'app/game.txt'
const readerGF = () => { return fileStream.readFileSync(gameFile) }
const writerGF = (toWrite) => {
    fileStream.writeFileSync(toWrite, gameFile)
} 

describe('For clearGameFile()', () => {
    it('Should clear content of game.txt', () => {
        
        //Filling game.txt with dummy text
        writerGF("Højt på en gren: En krage")

        //Is game.txt empty?
        assert.isNotEmpty(readerGF())

        //act
        clearGameFile()

        //Is game.txt now empty?
        assert.isEmpty(readerGF())
    })
})