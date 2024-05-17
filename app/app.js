import express from "express";
import path from "path";
import HttpStatus from "http-status-codes";
import fileStream from "fs";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
export const userFile = 'app/users.txt';
export const gameFile = 'app/game.txt';

import gameState from "./gameState.js";
import Player from "./player.js";
import User from "./user.js";

import { clearGameFile, getGameFile, getUser, getUsers, saveToFile } from "./fileManagement.js";
import {
    diceValues, turn, firstRollDone, currentPlayer, emptyPlayers,
    gameStatus, rollDice, setHeld, getPlayer, getNextPlayer, updateScores,
    players, setCurrentPlayer, setPlayers, setFirstRollDone, getCurrentPlayer,
    lockDie, unlockAllDice,
    saveGame
} from "./gameLogic.js";

const app = express();
const router = express.Router();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', './views')
app.use(express.static("public"))
app.use(express.json());

app.get('/', function (req, res) {
    const file = getGameFile();

    if (file === null || file.gameState.isGameOngoing === false) {
        res.render('error', { error: "No game started. Go to /register to start game." });
        return;
    }

    setCurrentPlayer(file.gameState.currentPlayer);
    setPlayers(file.players);
    res.render('yatzy', { name: currentPlayer.name, players: players });
})

app.get('/register', function (req, res) {
    res.render('register')
})

//REST CALLS UNDER HERE

router.route('/game/rollbtn')
    .get((req, res) => {
        if (firstRollDone === false) {
            setFirstRollDone(true);
        }
        rollDice();
        let pppp = players[[...players].findIndex(p => p.name == getCurrentPlayer().name)]
        updateScores(pppp);
        let result = { pot: pppp.score, dice: diceValues };
        res.status(HttpStatus.ACCEPTED).json(result);
    });

router.route('/game/lockdie')
    .post((req, res) => {
        const id = req.body.id;
        console.log(id)
        if (id === undefined || typeof id !== 'number' || id < 0 || id >= diceValues.length) {
            return res.status(HttpStatus.BAD_REQUEST).send("Invalid dice index")
        }
        let result = lockDie(id)
        res.status(HttpStatus.OK).json({ lock: result })
    });

router.route('/game/getplayer')
    .post((req, res) => {
        let player = getPlayer(req.body.id)
        res.status(HttpStatus.OK).json({ player: player })
    })

router.route('/game/lockfield')
    .post((req, res) => {
        if (firstRollDone === false) {
            res.status(HttpStatus.FORBIDDEN).send("You must roll atleast once before locking in a choice<3");
            return;
        }
        unlockAllDice();
        setHeld(req.body.id, getPlayer(currentPlayer))
        setCurrentPlayer(getNextPlayer());
        res.status(HttpStatus.OK).json({ player: currentPlayer, turn: turn });
    })

router.route('/register')
    .post((req, res) => {

        let user = new User(req.body.name);

        //If no user file?
        if (!fileStream.existsSync(userFile)) {
            //add something about why
            res.status(HttpStatus.METHOD_FAILURE).send();
            return;
        }

        //If content in user file, then make list of users and make sure user doesn't already exist
        let userList = getUsers();
        if (userList.length > 0) {
            if (userList.filter(function (u) { return u.name === user.name }).length > 0) {
                //add that username already exists to response
                res.status(HttpStatus.NOT_MODIFIED).send();
                return;
            }
        } else {
            res.status(HttpStatus.METHOD_FAILURE).send();
            return;
        }

        //User doesn't exist, then add user to list. Add list to file
        userList.push(user)
        if(!saveToFile(userList, userFile)) {
            res.status(HttpStatus.METHOD_FAILURE).send();
            return;
        }
        res.status(HttpStatus.OK).json(JSON.stringify(userList)).send();

    })
    .get((req, res) => {
        let userList = getUsers();
        if (userList.length === 0) {
            res.status(HttpStatus.METHOD_FAILURE).send();
            return
        }
        res.status(HttpStatus.OK).json(JSON.stringify(userList));
    })


router.route('/startGame')
    .post((req, res) => {
        const file = getGameFile();

        if (file !== null) {
            if (file.gameState.isGameOngoing) {
                return res.status(HttpStatus.LOCKED).send("There is already an ongoing game.\nWait for game to be finished before starting a new game.")
            }
        }
        if (!fileStream.existsSync(userFile)) {
            res.status(HttpStatus.NOT_FOUND).send(userFile + " could not be found");
            return;
        }
        emptyPlayers();
        let userList = req.body.users
        userList.sort()
        for (const u of userList) {
            players.push(new Player(u.name))
        }


        //tager mod listen over de tilmeldte spillere
        if (userList.length > 0) {

            //gør gameStatus klar til afsending
            gameStatus.turn = 1
            gameStatus.isGameOngoing = true
            gameStatus.currentPlayer = players[0]

            //skriver til game.txt med spillende brugere og nuværende gameStatus
            if (!saveGame()) {
                res.status(HttpStatus.METHOD_FAILURE).send()
                return;
            }

            res.status(HttpStatus.OK).send()
            return;
        }

        res.status(HttpStatus.BAD_REQUEST).send("No users selected")
        return;
    })

router.route('/game/reset')
    .post((req, res) => {
        if (!fileStream.existsSync(gameFile)) {
            res.status(HttpStatus.NOT_FOUND).send(userFile + " could not be found");
            return;
        }

        clearGameFile();

        res.status(HttpStatus.OK).send()
    })

//MUST BE AT THE BOTTOM OF ALL THE ROUTER CODE
app.use('/rest', router);

//-----------------------------------------------------------------


app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});