//import { json } from "express";
//import { gameFile } from "./app.js";
let scores = [];
//Dice images
let diceImages;
let diceValues = [0, 0, 0, 0, 0];
let prevPlayerLI;
let turn = 1;
let dice;
//Roll button for dice
let rollButton = document.getElementById("rollButton");
rollButton.onclick = async () => {
    buttonRoll()
};
let rollCounter = 0



//Window onload. Do all the variable stuff here
window.onload = function () {

    //Extracting all input fields (scores)and attaching event clickers

    //setting first player to be first move.

    playerProfiles = document.querySelectorAll('ol li');

    for (let i = 0; i < playerProfiles.length; i++) {
        playerProfiles[i].addEventListener('mouseenter', function (event) {
            getToolTipData(event.target.id);
        })
    }



    scores = document.querySelectorAll("input");
    for (let field of scores) {
        field.addEventListener("click", function (e) {
            //if turn != 0
            if (field.style.backgroundColor != 'lightblue') {
                postChoice(e.target);
            }
        });
    }

    //Dice event listeners
    dice = document.querySelectorAll("img[id^='die']")

    for (let i = 0; i < dice.length; i++) {
        dice[i].addEventListener("click", function (event) { postLockDie(event) })
    }

    fillFirstPlayer();
}

function fillFirstPlayer() {
    const firstPlayer = JSON.parse(document.getElementById('container').dataset.firstPlayer);
    const startingTurn = document.getElementById('content').dataset.startingTurn
    turn = startingTurn
    for (let i = 0; i < startingTurn; i++) {
        toggleLight(i);
    }

    for (let i = 0; i < scores.length; i++) {
        const score = getScore(i, firstPlayer.score);
        scores[i].value = score.value;
        if (score.held === true) {
            scores[i].style.backgroundColor = 'lightblue';
        } else {
            scores[i].style.backgroundColor = 'white';
        }
    }
    prevPlayerLI = [...playerProfiles].filter((pf) => pf.id === firstPlayer.name)[0];
    if (prevPlayerLI === undefined) {
        prevPlayerLI = playerProfiles[0]
    }
    prevPlayerLI.style.transform = 'scale(1.10)';
}

function postLockDie(event) {
    if (rollCounter < 3 && rollCounter >0) {
        let index = [...dice].indexOf(event.target);
        fetch('/rest/game/lockdie', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: index })
        }).then(async function (res) {
            if (res.status === 200) {
                return res.json();
            }

            alert("Smth smth, not working");

        }).then((data) => {
            if (data.lock) {
                event.target.style.borderColor = 'gray'
            } else {
                event.target.style.borderColor = 'black'
            }
            event.target.disabled = data.lock;
        })
    }
}

function endGame() {
    fetch('/rest/game/gameover', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "gameIsOver": "true" })
    }).then(async (res) => {
        if (res.status === 200) {
            return res.json();
        }
        alert("endGame() har jokket i spinaten.")
    }).then((data) => {

        let makeTable = function () {
            const table = document.createElement('table')

            const tableHead = document.createElement('thead')
            const headerRow = document.createElement('tr')

            const tableHeadName = document.createElement('th')
            tableHeadName.textContent = 'Name'
            headerRow.appendChild(tableHeadName)

            const tableHeadResult = document.createElement('th')
            tableHeadResult.textContent = 'Result'
            headerRow.appendChild(tableHeadResult)

            const tableHeadYatzy = document.createElement('th')
            tableHeadYatzy.textContent = 'Got Yatzy?'
            headerRow.appendChild(tableHeadYatzy)


            tableHead.appendChild(headerRow)
            table.appendChild(tableHead)

            const tableBody = document.createElement('tbody');
            for (let i = 0; i < data.data.length; i++) {
                console.log(data.data[i])
                const row = document.createElement('tr')

                const name = document.createElement('td')
                const nameText = document.createTextNode((i+1) +". " + data.data[i].name)
                name.appendChild(nameText)
                row.appendChild(name)

                const result = document.createElement('td')
                const resultText = document.createTextNode(data.data[i].result)
                result.appendChild(resultText)
                row.appendChild(result)

                const gotYatzy = document.createElement('td')
                const yatzyText = document.createTextNode(data.data[i].gotYatzy ? '✔' : " ")
                gotYatzy.appendChild(yatzyText);

                row.appendChild(gotYatzy)

                tableBody.appendChild(row)

            }

            table.appendChild(tableBody)

            return table;
        }

        let modal = document.getElementById('modalContent');
        modal.appendChild(makeTable());
        openModal('modal');
    })
}


function toggleLight(index) {
    let light = document.getElementsByClassName("sphere")[index];

    if (light.classList.contains("green")) {
        light.classList.remove("green");
        light.classList.add("red");
    }


}

function postChoice(element) {
    let index = [...scores].indexOf(element);
    if (index > 14) {
        return;
    }
    if (rollCounter === 0) {
        alert("Remember to roll dice before choosing a score field<3")
        return;
    }
    fetch('rest/game/lockfield', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: index })
    }).then(async function (res) {
        if (res.status === 200) {
            return res.json();
        }

        if (res.status === 403) {
            let errText = await res.text();
            alert(errText);
        }
        throw new Error("Something went wrong");

    }).then(function (data) {
        console.log(scores);
        scores[17].value = data.player.score.total.value
        scores[15].value = data.player.score.sum.value
        for (let i = 0; i < scores.length; i++) {
            const score = getScore(i, data.player.score);
            if (score.held === true) {
                scores[i].style.backgroundColor = 'lightblue';
                scores[i].value = score.value;
            } else {
                scores[i].style.backgroundColor = 'white';
                if (i < 14) scores[i].value = 0;
            }
            
        }

        prevPlayerLI.style.transform = 'scale(1)';
        let newPlayerLI = document.getElementById(data.player.name);
        newPlayerLI.style.transform = 'scale(1.10)';
        prevPlayerLI = newPlayerLI;
        if (data.turn > turn) {
            toggleLight(turn);
        }
        turn = data.turn;

        rollButton.disabled = false;
        rollCounter = 0
        rollButton.setAttribute("class", "glow-button")

        for (let i = 0; i < dice.length; i++) {
            dice[i].disabled = false;
            dice[i].style.borderColor = "black";
        }

        if(turn === 16) {
            endGame();
        }
    })
}


function buttonRoll() {
    rollCounter++
    if (rollCounter === 3) {
        rollButton.disabled = true;
        rollButton.setAttribute("class", "normcore-button")
    }
    //restcall to backend //TEST EXAMPLE
    fetch("rest/game/rollbtn").then(response => {
        if (!response.ok) {
            throw new Error("ain't working")
        }

        return response.json();
    }).then(data => {
        for (let i = 0; i < dice.length; i++) {
            diceValues[i] = data.dice[i];
        }

        updateDice();
        for (let i = 0; i < scores.length; i++) {
            scores[i].value = getScore(i, data.pot).value;
        }
    })


}

function getScore(i, score) {
    switch (i) {
        case 0: return score.ones;
        case 1: return score.twos;
        case 2: return score.threes;
        case 3: return score.fours;
        case 4: return score.fives;
        case 5: return score.sixes;
        case 6: return score.onePair;
        case 7: return score.twoPair;
        case 8: return score.threeSame;
        case 9: return score.fourSame;
        case 10: return score.fullHouse;
        case 11: return score.smallStraight;
        case 12: return score.largeStraight;
        case 13: return score.chance;
        case 14: return score.yatzy;
        case 15: return score.sum;
        case 16: return score.bonus;
        case 17: return score.total;
        default: return 0;
    }
}

function getToolTipData(pId) {
    console.log(pId)
    fetch('rest/game/getplayer', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: pId })
    }).then((res) => {
        if (res.ok) {
            return res.json();
        }
    }).then((data) => {
        let info = ""
        for (const [key, value] of Object.entries(data.player.score)) {
            if(key.toString() === "total" || key.toString() === "sum" || key.toString() === 'bonus') {
                info += key + ": " + value.value + "\n"
            } else {
                info += value.held ? key + ":" + value.value + "🔒\n" : `${key}: N/A\n`
            }


        }

        document.getElementById(pId + 'tooltip').textContent = info;
    })
}

//Updates the dice images
function updateDice() {
    for (i = 0; i < dice.length; i++) {
        switch (diceValues[i]) {
            case 1:
                dice[i].src = "../DiceImages/dice-six-faces-one.png";
                break;
            case 2:
                dice[i].src = "../DiceImages/dice-six-faces-two.png";
                break;
            case 3:
                dice[i].src = "../DiceImages/dice-six-faces-three.png";
                break;
            case 4:
                dice[i].src = "../DiceImages/dice-six-faces-four.png";
                break;
            case 5:
                dice[i].src = "../DiceImages/dice-six-faces-five.png";
                break;
            case 6:
                dice[i].src = "../DiceImages/dice-six-faces-six.png";
                break;
        }
    }
}

