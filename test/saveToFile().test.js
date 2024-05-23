import { assert } from "chai";
import fileStream from "fs";
import { clearGameFile, saveToFile } from "../app/fileManagement.js";

const gameFile = 'app/game.txt'
const readerGF = () => fileStream.readFileSync(gameFile)
const writerGF = (toWrite) => {
    fileStream.writeFile(toWrite, gameFile)
} 

/*
export function saveToFile(data, filepath) {
    fileStream.writeFileSync(filepath, JSON.stringify(data), {flag: 'w'}, (err) => {
        if(err) {
            console.error(`Failed to save to ${filepath}`);
            return false;
        }
    });
    return true;
}
*/

describe('For saveToFile()', () => {
    it('Should write content to destination', () => {
        let content = "Der blæste en vældig vind den dag ude fra vest."
        let destination = 'app/game.txt'
        clearGameFile()

        //act
        saveToFile(content, destination)
        assert.isNotEmpty(destination)
    })
})