$(window).on('load', function () {
// If we are on users index page

  if ($('.usersIndex').length > 0) {
    var $map = $('#usersIndexMap')
    var height = $map.width()
    $('#usersIndexMap').height(height)
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
    return this.populateMarkers({currentLocation, destination}, map);
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
    return this.drawPath(map, locations);
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

  this.calculateDistance = function(location, destination) {
    latSourceRadians = location.lat * Math.PI / 180;
    longSourceRadians = location.lng * Math.PI / 180;
    latDestRadians = destination.lat * Math.PI / 180;
    longDestRadians = destination.lng * Math.PI / 180;
    var distance = 3959 * Math.acos(Math.cos(latSourceRadians) * Math.cos(latDestRadians) * Math.cos(longSourceRadians - longDestRadians) + Math.sin(latSourceRadians) * Math.sin(latDestRadians));
    distance = distance * 1.609344;
    // Change this to return 1 to see the user winning state for tests
    return Math.floor(distance * 1000);
  },

  this.onSuccess = function(position) {
    var currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
    if (destination && this.calculateDistance(position, destination) < 20) {
      $("#winChallengeModal").modal('show');
    } else {
      return this.createMap(position);
    }
  },

  this.onError = function(error) {
    console.log("Error", error.code);
  }
}
