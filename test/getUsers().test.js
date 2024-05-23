import { assert } from "chai";
import fileStream from "fs";
import { getUsers, saveToFile } from "../app/fileManagement.js";
import { userFile } from "../app/app.js";

const gameFile = 'app/game.txt'
const readerGF = fileStream.readFileSync(gameFile)
const writerGF = (toWrite) => {
    fileStream.writeFile(toWrite, gameFile)
} 
/*
export function getUsers(){
    if(!fileStream.existsSync(userFile)) {
        //add something about why
       return [];
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
*/
let gutterne = [{"name":"Katja Kaj"}, {"name": "Bente Bendt"}]
let addGutterne = () => { saveToFile(gutterne, userFile) }
let clearUsers = () => fileStream.writeFileSync('app/game.txt', "", {flag: 'w'})


describe('For getUsers()', () => {
    it('Should return a list of all users in users.txt as an [] of {}', () => {

        addGutterne()
        assert.isArray(getUsers())
        assert.equal(getUsers()[0].name, "Katja Kaj")
    })
})