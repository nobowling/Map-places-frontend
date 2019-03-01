function performGetRequest() {
    var resultElement = document.getElementById('dataDiv');
    resultElement.innerHTML = '';

    axios.get('http://localhost:3001/markers.xml/')
        .then(function (response) {
            resultElement.innerHTML = getMarkers(response);
        })
        .catch(function (error) {
            resultElement.innerHTML = generateSuccessHTMLOutput(error);
        });
}

function getMarkers(response) {
    var markers = response;
    for (var i = 0; i < markers.length; i++) {
        var latLng = new google.maps.LatLng(markers[i].latitude, markers[i].longitude);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: markers[i].name,
            id: markers[i].id,
            keywords: markers[i].keywords
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(
                    `<h2>${markers[i].name}</h2>
                        <h4>${markers[i].description}</h4>
                        <p>Latitude: ${markers[i].latitude}</p>
                        <p>Longitude: ${markers[i].longitude}</p>
                        <p>Keywords: ${markers[i].keywords}</p>
                        <button id='${markers[i].id}'onclick='deletePlace()'>Delete</button><br>
                        <div id='infowindow'>
                        <h4 onclick='toggleEditVisibility()'>Edit place</h4>
                        <div id='editWindow'>
                            <input id='editPlaceName' type='text' value='${markers[i].name}'><br>
                            <input id='editPlaceDescription' type='text' value='${markers[i].description}'><br>
                            <input id='editPlaceLat' value='${markers[i].latitude}'><br>
                            <input id='editPlaceLng'value='${markers[i].longitude}'><br>
                            <input id='editPlaceKeywords'value='${markers[i].keywords}'><br>
                        <button class='${markers[i].id}'onclick='editPlace()'>Save edits</button>
                        </div>
                        </div>
                        `
                );
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

function generateErrorHTMLOutput(error) {
    console.log(error)
}