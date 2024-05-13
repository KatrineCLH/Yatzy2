fetch('rest/game/reset', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: ''
}).then(response => {
    if (response.status !== 200){
        console.log("der gik noget galt");
    }
})