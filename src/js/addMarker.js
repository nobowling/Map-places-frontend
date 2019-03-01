function addMarker() {

    const markerObject = {
        name: document.getElementById('placeName').value,
        description: document.getElementById('placeDescription').value,
        latitude: document.getElementById('placeLat').value,
        longitude: document.getElementById('placeLng').value,
        keywords: document.getElementById('placeKeywords').value,
        favorite: document.getElementById('checkbox').checked
    }

    console.log(markerObject.keywords)

    axios
        .post('http://localhost:3001/markers.xml', markerObject)
        .then(response => {
            console.log('post response: ', response)
        })
    location.reload(true)
}