function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(60.20364340471037, 24.88388737511127),
        zoom: 14
    });
    var infowindow = new google.maps.InfoWindow();
    var favoriteIcon = 'http://maps.google.com/mapfiles/kml/paddle/ylw-stars.png'

    let promise = axios.get('http://localhost:3001/markers.xml/')
    promise.then((response) => {
        var markers = response.data
        let markerList = [];
        let notFavorites = [];

        console.log(markers)
        for (var i = 0; i < markers.length; i++) {
            var latLng = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: markers[i].name,
                id: markers[i].id,
                keywords: markers[i].keywords,
                favorite: markers[i].favorite,
            });
            markerList.push(marker)
            if (marker.favorite) {
                marker.setIcon(favoriteIcon)
            }

            if (!marker.favorite) {
                notFavorites.push(marker)
            }
            console.log('markerlist: ', markerList)
            console.log('not favorites: ', notFavorites)
            
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent(
                        `<h2>${markers[i].name}</h2>
                            <h4>${markers[i].description}</h4>
                            <p>Latitude: ${markers[i].latitude}</p>
                            <p>Longitude: ${markers[i].longitude}</p>
                            <p>Keywords: ${markers[i].keywords}</p>
                            <button id='${markers[i].id}'onclick='deleteMarker()'>Delete</button><br>
                            <button id='addFavoritesButton' class='${markers[i].id}'onclick='addToFavorites()'>Add to favorites</button><br>
                            <button id='removeFavoritesButton' class='${markers[i].id}'onclick='removeFromFavorites()'>Remove from favorites</button><br>
                            <div id='infowindow'>
                            <h4 onclick='toggleEditVisibility()'>Edit place</h4>
                            <div id='editWindow'>
                                Name: <br><input id='editPlaceName' type='text' value='${markers[i].name}'><br>
                                Description: <br><input id='editPlaceDescription' type='text' value='${markers[i].description}'><br>
                                Latitude: <br><input id='editPlaceLat' value='${markers[i].latitude}'><br>
                                Longitude: <br><input id='editPlaceLng'value='${markers[i].longitude}'><br>
                                Keywords: <br><input id='editPlaceKeywords'value='${markers[i].keywords}'><br>
                                Add or remove from favorites: <br> <input id='editMarkerFavorite' type='checkbox' value ='false' onclick='editCheck()'><br>
                                <button onclick='test()'>Test</button>
                            <button class='${markers[i].id}' onclick='editMarker()'>Save edits</button>
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
            console.log(markerList)
            for (let i = 0; i < markerList.length; i++) {
                if (checkboxValue === false) {
                    markerList[i].setVisible(true)
                } else { 
                    notFavorites[i].setVisible(false)
                }
            }
        }
    });
    google.maps.event.addListener(map, 'click', function (event) {
        addMarker(event.latLng)
    })

    function addMarker(location) {
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
                <button onclick='addMarker()'>Save</button>
            </div>
            `
        )

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    }
}