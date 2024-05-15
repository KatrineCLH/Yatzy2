function reset() {
    fetch('rest/game/reset', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dummy: '' })
    }).then(response => {
        if (response.status !== 200) {
            console.log("der gik noget galt");
        }
    })
}