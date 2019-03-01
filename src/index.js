saveMarker =() => {

    const markerObject = {
        name: document.getElementById('placeName').value,
        description: document.getElementById('placeDescription').value,
        latitude: document.getElementById('placeLat').value,
        longitude: document.getElementById('placeLng').value,
        keywords: document.getElementById('placeKeywords').value,
        favorite: document.getElementById('checkbox').checked
    }

    axios
        .post('/markers', markerObject)
        .then(response => {
            console.log('post response: ', response)
        })
    location.reload(true)
}

check = () => {
    document.getElementById('checkbox').checked !== document.getElementById('checkbox').checked
}

editCheck = () => {
    document.getElementById('editMarkerFavorite').checked !== document.getElementById('editMarkerFavorite').checked
}

editMarker = () => {

    const editId = event.target.getAttribute('class')
    const editMarkerObject = {
        name: document.getElementById('editPlaceName').value,
        description: document.getElementById('editPlaceDescription').value,
        latitude: document.getElementById('editPlaceLat').value,
        longitude: document.getElementById('editPlaceLng').value,
        keywords: document.getElementById('editPlaceKeywords').value,
        favorite: document.getElementById('editMarkerFavorite').checked
    }

    axios.put(`/markers/${editId}`, editMarkerObject)
        .then(response => {
            console.log('edit response: ', response)
        })
    location.reload(true)
}

initMap = () => {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(60.20364340471037, 24.88388737511127),
        zoom: 10
    });
    var infowindow = new google.maps.InfoWindow();
    var favoriteIcon = 'http://maps.google.com/mapfiles/kml/paddle/ylw-stars.png'
    var defaultIcon = 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png'

    let promise = axios.get('/markers/')
    promise.then((response) => {
        var markers = response.data
        let markerList = [];
        let notFavorites = [];

        for (var i = 0; i < markers.length; i++) {
            var latLng = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: markers[i].name,
                id: markers[i].id,
                keywords: markers[i].keywords,
                favorite: markers[i].favorite,
                icon: defaultIcon
            });
            markerList.push(marker)
            if (marker.favorite) {
                marker.setIcon(favoriteIcon)
            }

            if (!marker.favorite) {
                notFavorites.push(marker)
            }

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(
                        `<h2>${markers[i].name}</h2>
                            <h4>${markers[i].description}</h4>
                            <p>Latitude: ${markers[i].latitude}</p>
                            <p>Longitude: ${markers[i].longitude}</p>
                            <p>Keywords: ${markers[i].keywords}</p>
                            <button id='${markers[i].id}'onclick='deleteMarker()' class='deleteMarkerButton' >Delete</button><br>
                            <button id='addFavoritesButton' class='${markers[i].id}'onclick='addToFavorites()'>Add to favorites</button><br>
                            <button id='removeFavoritesButton' class='${markers[i].id}'onclick='removeFromFavorites()'>Remove from favorites</button><br>
                            <div id='infowindow'>
                            <button id='openEditWindowButton'onclick='toggleDiv()'>Edit place</button>
                            <div id='editWindow'>
                                Name: <br><input id='editPlaceName' type='text' value='${markers[i].name}'><br>
                                Description: <br><input id='editPlaceDescription' type='text' value='${markers[i].description}'><br>
                                Latitude: <br><input id='editPlaceLat' value='${markers[i].latitude}'><br>
                                Longitude: <br><input id='editPlaceLng'value='${markers[i].longitude}'><br>
                                Keywords: <br><input id='editPlaceKeywords'value='${markers[i].keywords}'><br>
                                Add or remove from favorites: <br> <input id='editMarkerFavorite' type='checkbox' value ='false' onclick='editCheck()'><br>
                            <button  id='saveEditsButton' class='${markers[i].id}' onclick='editMarker()'>Save edits</button>
                            </div>
                            </div>
                            `
                    );
                    infowindow.open(map, marker);
                }
            })(marker, i));
        }
        filterTitle = (filterId) => {
            const filterableValue =
                document.getElementById(filterId).value.toUpperCase()
            for (let i = 0; i < markerList.length; i++) {
                const markerName = markerList[i].title.toUpperCase()
                if (markerName.indexOf(filterableValue) > -1) {
                    markerList[i].setVisible(true)
                } else {
                    markerList[i].setVisible(false)
                }
            }
        }

        filterKeywords = (keywordId) => {
            const filterableValue =
                document.getElementById(keywordId).value.toUpperCase()
            for (let i = 0; i < markerList.length; i++) {
                const markerKeywords = markerList[i].keywords.toUpperCase()
                if (markerKeywords.indexOf(filterableValue) > -1) {
                    markerList[i].setVisible(true)
                } else {
                    markerList[i].setVisible(false)
                }
            }
        }

        filterFavorites = () => {
            document.getElementById('filterFavorites').checked !== document.getElementById('filterFavorites').checked
            let checkboxValue = document.getElementById('filterFavorites').checked
            for (let i = 0; i < markerList.length; i++) {
                if (checkboxValue === false) {
                    markerList[i].setVisible(true)
                } else {
                    notFavorites[i].setVisible(false)
                }
            }
        }
        deleteMarker = () => {
            const placeId = event.target.getAttribute('id')

            axios.delete(`/markers/${placeId}`, placeId)
                .then(response => {
                    console.log('delete response: ', response)
                })
            for (let i = 0; i < markerList.length; i++) {
                if (placeId === markerList[i].id) {
                    markerList[i].setMap(null)
                }
            }
        }

        addToFavorites = () => {

            const editId = event.target.getAttribute('class')
            const editMarkerObject = {
                name: document.getElementById('editPlaceName').value,
                description: document.getElementById('editPlaceDescription').value,
                latitude: document.getElementById('editPlaceLat').value,
                longitude: document.getElementById('editPlaceLng').value,
                keywords: document.getElementById('editPlaceKeywords').value,
                favorite: true
            }

            axios.put(`/markers/${editId}`, editMarkerObject)
                .then(response => {
                    console.log('edit response: ', response)
                })

            for (let i = 0; i < markerList.length; i++) {
                if (editId === markerList[i].id) {
                    markerList[i].setIcon(favoriteIcon)
                }
            }
        }

        removeFromFavorites = () => {

            const editId = event.target.getAttribute('class')
            const editMarkerObject = {
                name: document.getElementById('editPlaceName').value,
                description: document.getElementById('editPlaceDescription').value,
                latitude: document.getElementById('editPlaceLat').value,
                longitude: document.getElementById('editPlaceLng').value,
                keywords: document.getElementById('editPlaceKeywords').value,
                favorite: false
            }

            axios.put(`/markers/${editId}`, editMarkerObject)
                .then(response => {
                    console.log('edit response: ', response)
                })
            for (let i = 0; i < markerList.length; i++) {
                if (editId === markerList[i].id) {
                    markerList[i].setIcon(defaultIcon)
                }
            }
        }
    });
    google.maps.event.addListener(map, 'click', function (event) {
        addMarker(event.latLng)
    })

    addMarker = (location) => {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Add new place',
            description: 'not set',
            info: infowindow,
            latitude: location.lat(),
            longitude: location.lng(),
            keywords: 'no words yet',
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
        });
        infowindow.setContent(
            `
            <div id='infowindow'>
                <h4 id='add'>${marker.title}</h4>
                    <input id='placeName' type='text' placeholder='Add title'><br>
                    <input id='placeDescription' type='text' placeholder='Add description'><br>
                    <input id='placeKeywords' type='text' placeholder='Add keywords'><br>
                    <input id='checkbox' type='checkbox' onclick='check()'> Add to favorites<br>
                <p>Coordinates:</p>
                <input id='placeLat' value='${marker.latitude}'><br>
                <input id='placeLng'value='${marker.longitude}'><br>
                <button id='saveMarkerButton' onclick='saveMarker()'>Save</button>
            </div>
            `
        )

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    }
}

window.initMap = initMap;

toggleBounce = () => {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

toggleDiv = () => {
    var div = document.getElementById('editWindow');
    div.style.display = div.style.display == "block" ? "none" : "block";
}