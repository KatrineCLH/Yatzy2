import fileStream from "fs";

import { resetStuff } from "./gameLogic.js";
import { userFile, gameFile } from "./app.js";

export function clearGameFile() {
    console.log("Clearing game file")
    fileStream.writeFileSync(gameFile, "", {flag: 'w'}, (err) => {
        if(err) {
            console.error("failed to reset game file");
        }
    });

    resetStuff()
}

export function saveToFile(data, filepath) {
    fileStream.writeFileSync(filepath, JSON.stringify(data), {flag: 'w'}, (err) => {
        if(err) {
            console.error(`Failed to save to ${filepath}`);
            return false;
        }
    });
    return true;
}


export function getGameFile() {
    try {
      return JSON.parse(fileStream.readFileSync(gameFile));
    }
    catch{
        return null;
    }

}

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

export function getUser(username) {
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