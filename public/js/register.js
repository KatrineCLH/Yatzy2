let dropDown
let gamerList = []

window.onload = function (){
    dropDown = document.getElementById('users')
    populateDropDown(dropDown)

    let warning = document.getElementById("warning")

    document.getElementById("addButton").onclick = function (){
        //read who user is trying to add to game
        let fieldInput = document.getElementById("inputUser").value;
        let user = {name: fieldInput}
        //console.log(fieldInput);

        //if inputted name is not already a gamer, add name to gamer list
        if (!gamerList.map(gamer => gamer.name).includes(user.name)){
            addUser(user)
        }
        else{
            warning.style.display = "block"
            warning.style.color = "red"
        }

        //console.log(gamerList);
    }

    document.getElementById("startButton").onclick = function (){
        console.log(gamerList);
        let postUsers = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({users: gamerList})
        }
        console.log(JSON.parse(postUsers.body).users);
        fetch("rest/startGame", postUsers).then(response => console.log(response.status))
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
    fetch("rest/register", postData).then(response => {
        if (response.ok){
            let option = document.createElement("option")
            option.value = user.name
            dropDown.appendChild(option)
        }
        let selectedTable = document.getElementById("selectedUsers");
        let newRow = selectedTable.insertRow(-1);
        let newCell = newRow.insertCell(-1);
        newCell.innerHTML = user.name
        gamerList.push(user)
        warning.style.display = "none"
        document.getElementById("inputUser").value = ""
    })
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