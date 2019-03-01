function removeFromFavorites() {

    const editId = event.target.getAttribute('class')
    const editMarkerObject = {
        name: document.getElementById('editPlaceName').value,
        description: document.getElementById('editPlaceDescription').value,
        latitude: document.getElementById('editPlaceLat').value,
        longitude: document.getElementById('editPlaceLng').value,
        keywords: document.getElementById('editPlaceKeywords').value,
        favorite: false
    }

    axios.put(`http://localhost:3001/markers.xml/${editId}`, editMarkerObject)
        .then(response => {
            console.log('edit response: ', response)
        })
    location.reload(true)

    console.log('editable object: ', editId, editMarkerObject)
}