var map;
var infowindow;
var set_price;
var placesList;
var service;
var lat;
var long;

$( "#sub-but" ).click(function() {
  search();
});

function search() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        alert('It seems like Geolocation, which is required for this page, is not enabled in your browser.');
    }
    

}

function successFunction(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    var food = $('#food').val();

    //console.log(lat);
    //console.log(long);

    var cur_location = new google.maps.LatLng(lat, long);


    map = new google.maps.Map(document.getElementById('map-1'), {
        center: cur_location,
        zoom: 13
    });

    var request = {
        location: cur_location,
        radius: 4000,
        types: ['restaurant'],
        keyword: food,
    };

    //console.log(food);
    //console.log(request.types);

    placesList = document.getElementById('places');

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    var person = new google.maps.Marker({
        position: cur_location,
        icon: 'cur.png',
        map: map
    });

    google.maps.event.addListener(person, 'click', function () {

        infowindow.setContent("Current Location");
        infowindow.open(map, person);
    });
}

function errorFunction(position) {
    alert('Error!');
}

function callback(results, status, pagination) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
    if (pagination.hasNextPage) {
        var moreButton = document.getElementById('more');

        moreButton.disabled = false;

        google.maps.event.addDomListenerOnce(moreButton, 'click',
            function () {
                moreButton.disabled = true;
                pagination.nextPage();
            });
    }

}

function createMarker(place) {

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        position: place.geometry.location,
        icon: 'burger.png',
        map: map,
        title: place.name
    });



    var service = new google.maps.places.PlacesService(map);
    placesList.innerHTML += '<li>' + place.name + '</li>';

    var request = {
        reference: place.reference
    };
    service.getDetails(request, function (details, status) {
        google.maps.event.addListener(marker, 'click', function () {
            if (details == null) {
                infowindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + place.name + '&nbsp; &nbsp; ' + place.rating + '/5 </h5>');
                infowindow.open(map, marker);
            } else {
                infowindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + place.name + '&nbsp; &nbsp; ' + place.rating + '/5 </h5><p>' + details.formatted_address + '<br />' + details.formatted_phone_number + '<br />' + '<a  target="_blank" href=' + details.website + '>' + details.website + '</a></p><br>' + '<a id="mapping"><button class="mapping btn waves-effect waves-light red darken-4" id="' + details.formatted_address + '"' + '>Go</button></a>');
                infowindow.open(map, marker);
                var loc = details.formatted_address;
                var button_go = document.getElementById('mapping');
                button_go.addEventListener('click', function() {
                    go(loc);
                });
            
            }
        });
    });
}

function go(destination) {
    var url = 'https://www.google.com/maps/dir/' + lat + ',' + long + '/' + destination;
    //console.log(url);
    var win = window.open(url, '_blank');
}


    