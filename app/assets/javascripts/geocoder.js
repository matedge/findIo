var watchId, geocoder, startLat, startLong;
var start = 1;
window.onload = function() {
  if (navigator.geolocation) {
     watchId = navigator.geolocation.watchPosition(onSuccess, onError,{maximumAge:60*1000, timeout:5*60*1000, enableHighAccuracy:true});}
}
function onSuccess(position) {
  var currentLat = position.coords.latitude;
  var currentLong = position.coords.longitude;
  if (start == 1) {
    startLat = currentLat;
    startLong = currentLong;
    start = 0;
  }
  var geocoder = new google.maps.Geocoder();
  var latlong = new google.maps.LatLng(currentLat, currentLong);
  geocoder.geocode({'latLng':latlong}, function(results, status){
    if (status == google.maps.GeocoderStatus.OK){
      if (results) {
        $("#location").html("You are now near " + results[0].formatted_address);
        // document.getElementById("location").innerHTML = "You are now near " + results[0].formatted_address;
      }
    } else {
        alert("Could not get the geolocation information");
    }
  });
  var mapOptions = {
    center: new google.maps.LatLng(startLat, startLong),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapArea"), mapOptions);
  var marker = new google.maps.Marker({
    position: latlong,
    map: map
  });
}
function onError(error){
  switch(error.code){
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
