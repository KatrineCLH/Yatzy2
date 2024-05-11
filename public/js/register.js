//import { response } from "express"
//import { add } from "nodemon"

let dropDown

window.onload = function (){
    dropDown = document.getElementById('users')
    populateDropDown(dropDown)

    let warning = document.getElementById("warning")

    document.getElementById("addButton").onclick = function (){
        //read who user is trying to add to game
        let fieldInput = document.getElementById("inputUser").value;
        let user = {name: fieldInput}
        //console.log(fieldInput);

        //make list of current gamers
        let chosenGamers = document.querySelectorAll("td")
        let cleanGamers = []

        for (const gamer of chosenGamers) {
            cleanGamers.push(gamer.innerText)
        }

        //if inputted name is not already a gamer, add name to gamer list
        if (!cleanGamers.includes(user.name)){
            let addResponse = addUser(user)
            if (addResponse === 200){
                let option = document.createElement("option")
                option.value = user.name
                dropDown.appendChild(option)
            }
            let selectedTable = document.getElementById("selectedUsers");
            let newRow = selectedTable.insertRow(-1);
            let newCell = newRow.insertCell(-1);
            newCell.innerHTML = fieldInput
            warning.style.display = "none"
        }
        else{
            warning.style.display = "block"
            warning.style.color = "red"
        }
    }
}

function addUser(user){
    //use post in app.js
    let postData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }
    fetch("rest/register", postData).then(response => response.status)
}

function populateDropDown(dropDown){
    fetch("rest/register").then(response =>{
        if (!response.ok) {
            throw new Error("ain't working")
        }

        return response.json();
    }).then(data =>{
        //console.log(data);
        let userList = JSON.parse(data)
        //console.log(userList);
        userList.forEach(user => {
            let option = document.createElement("option")
            option.value = user.name
            dropDown.appendChild(option)
        });
    })
}



//For add knappen
//Hvis navnet vælges fra listen, skal det bare tilføjes
//Hvis navnet indtastes
    //Kast en fejl, hvis navnet allerede findes
    //Tilføj navnet til user-fil og til højre side af skærmen