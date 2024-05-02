let dropDown

window.onload = function (){
    dropDown = document.getElementById('users')
    populateDropDown(dropDown)

    document.getElementById("addButton").onclick = function (){
        let fieldInput = document.getElementById("inputUser").value;
        console.log(fieldInput);
        let selectedTable = document.getElementById("selectedUsers");
        selectedTable.insertRow(-1);
        let newCell = selectedTable.insertCell(-1);
        newCell.innerHTML("hej")
    }
}

function populateDropDown(dropDown){
    fetch("rest/register").then(response =>{
        if (!response.ok) {
            throw new Error("ain't working")
        }

        return response.json();
    }).then(data =>{
        console.log(data);
        let userList = JSON.parse(data)
        console.log(userList);
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