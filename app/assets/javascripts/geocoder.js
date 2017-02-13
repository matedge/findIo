// var watchId, geocoder, startLat, startLong;
// var start = 1;
// window.onload = function() {
//   if (navigator.geolocation) {
//      watchId = navigator.geolocation.watchPosition(onSuccess, onError,{maximumAge:60*1000, timeout:5*60*1000, enableHighAccuracy:true});}
// }
// function onSuccess(position) {
//   var currentLat = position.coords.latitude;
//   var currentLong = position.coords.longitude;
//   if (start == 1) {
//     startLat = currentLat;
//     startLong = currentLong;
//     start = 0;
//   }
//   var geocoder = new google.maps.Geocoder();
//   var latlong = new google.maps.LatLng(currentLat, currentLong);
//   geocoder.geocode({'latLng':latlong}, function(results, status){
//     if (status == google.maps.GeocoderStatus.OK){
//       if (results) {
//         $("#location").html("You are now near " + results[0].formatted_address);
//         // document.getElementById("location").innerHTML = "You are now near " + results[0].formatted_address;
//       }
//     } else {
//         alert("Could not get the geolocation information");
//     }
//   });
//   var mapOptions = {
//     center: new google.maps.LatLng(startLat, startLong),
//     zoom: 15,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
//   };
//   var map = new google.maps.Map(document.getElementById("mapArea"), mapOptions);
//   var marker = new google.maps.Marker({
//     position: latlong,
//     map: map
//   });
// }
// function onError(error){
//   switch(error.code){
//     case PERMISSION_DENIED:
//     alert("User denied permission");
//     break;
//     case TIMEOUT:
//     alert("Geolocation timed out");
//     break;
//     case POSITION_UNAVAILABLE:
//     alert("Geolocation information is not available");
//     break;
//     default:
//     alert("Unknown error");
//     break;
//   }
// }



var points = [{}, {}];

var map;

function findPath() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {maximumAge:60*1000, timeout:5*60*1000, enableHighAccuracy:true});
  }
  else {
    $("#getLocationResult").text("Your browser does not support HTML5 Geolocation")
  }
}

function onSuccess(position) {
  points[0].lat = position.coords.latitude;
  points[0].long = position.coords.longitude;
  var localAddress = $("#destination")[0].value.replace(" ", "+");
  var xmlhttpAddr = new XMLHttpRequest();
  var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + localAddress;

  xmlhttpAddr.open("GET", url, false);
  xmlhttpAddr.send();

  if (xmlhttpAddr.readyState == 4 && xmlhttpAddr.status == 200) {
    var result = xmlhttpAddr.responseText;
    //TODO: remove this eval, eval is evil
    var jsResult = eval("(" + result + ")");

    points[1].lat = jsResult.results[0].geometry.location.lat;
    points[1].long = jsResult.results[0].geometry.location.lng;

  }

  var mapOptions = {
    center: new google.maps.LatLng(points[0].lat, points[0].long),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map($("#mapArea")[0], mapOptions);
  var latlngbounds = new google.maps.LatLngBounds();

  for (var i=0; i<points.length; i++){
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(points[i].lat, points[i].long),
      map:map
    });
    latlngbounds.extend(marker.position);
  }

  map.fitBounds(latlngbounds);
  drawPath();

  var dist = Math.round(calculateDist(points[0].lat, points[0].long, points[1].lat, points[1].long)*100)/100;
  $("#distance").html("<b>You are " + dist + " kilometers away from your destination.</b>");


}

function drawPath() {

  var directionsService = new google.maps.DirectionsService();
  var poly = new google.maps.Polyline({strokeColor:"#FF0000", strokeWeight:4});
  var way = $('#floating-panel select').val()
  // debugger;
  var mode = google.maps.DirectionsTravelMode[way]

  var request = {
    origin: new google.maps.LatLng(points[0].lat, points[0].long),
    destination: new google.maps.LatLng(points[1].lat, points[1].long),
    travelMode: mode
  };

  directionsService.route(request, function(response, status){

    if (status == google.maps.DirectionsStatus.OK) {
      new google.maps.DirectionsRenderer({
        map:map,
        polylineOptions: poly,
        directions:response
      });
    }
  });
}

function onError(error){
  switch(error.code) {
    case PERMISSION_DENIED:
      alert("User denied permission");
      break;
    case TIMEOUT:
      alert("Geolocation timed out");
      break;
    case POSITION_UNAVAILABLE:
      alert("Geolocation information is not available");
      break;
    default:
      alert("Unknown error");
      break;
  }
}

function calculateDist(latSource, longSource, latDest, longDest) {
  latSourceRadians = latSource*Math.PI/180;
  longSourceRadians = longSource*Math.PI/180;
  latDestRadians = latDest*Math.PI/180;
  longDestRadians = longDest*Math.PI/180;
  var distance = 3959 * Math.acos(Math.cos(latSourceRadians) * Math.cos(latDestRadians) *Math.cos(longSourceRadians - longDestRadians) +Math.sin(latSourceRadians) * Math.sin(latDestRadians));
  distance = distance * 1.609344;
  return distance;
}
