$(window).on('load', function () {
// If we are on users index page
  if ($('.usersIndex').length > 0) {
    var map = new Geocoding("usersIndexMap")
    map.init()
  }
// If we are on challenge show page
  if ($('.challengeShow').length > 0) {
    var map = new Geocoding("userChallengeMap",
      { lat: $('#loc-lat').data('lat'),
        lng: $('#loc-lng').data('lng') })
    map.init()
  }
})

window.Geocoding = function(mapAreaElement, destination) {

  this.init = function() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(this.onSuccess.bind(this), this.onError, {
        maximumAge: 60 * 1000,
        timeout: 5 * 60 * 1000,
        enableHighAccuracy: true
      })
    }
  },

  this.createMap = function(position) {
    var currentLocation = { lat: position.coords.latitude,
                            lng: position.coords.longitude };
    var map = new google.maps.Map(document.getElementById(mapAreaElement), {
      center: currentLocation,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    return this.populateMarkers({currentLocation, destination}, map)
  },

  this.populateMarkers = function(locations, map) {
    var latlngbounds = new google.maps.LatLngBounds();
    for (var key in locations) {
      var marker = new google.maps.Marker({
        position: locations[key],
        map: map
      })
      latlngbounds.extend(marker.position);
    }
    map.fitBounds(latlngbounds);
    return this.drawPath(map, locations)
  },

  this.drawPath = function(map, locations) {
    var directionsService = new google.maps.DirectionsService();
    var poly = new google.maps.Polyline({
      strokeColor: "#FF0000",
      strokeWeight: 4
    });
    var request = {
      origin: locations.currentLocation,
      destination: locations.destination,
      travelMode: 'WALKING'
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        new google.maps.DirectionsRenderer({
          map: map,
          polylineOptions: poly,
          directions: response
        });
      }
    });
  },

  this.onSuccess = function(position) {
    return this.createMap(position)
  },

  this.onError = function(error) {
    console.log("Error", error.code);
  }
}
