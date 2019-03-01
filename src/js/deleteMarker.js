function deleteMarker() {
    const placeId = event.target.getAttribute('id')

    console.log('placeID: ', placeId)

    axios.delete(`http://localhost:3001/markers.xml/${placeId}`, placeId)
        .then(response => {
            console.log('delete response: ', response)
        })
    location.reload(true)
}