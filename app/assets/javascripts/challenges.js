$(document).ready(function() {
  if (('#challenges_form').length > 0) {
    initChallengeMap()
  }
})


function initChallengeMap() {
  var myLatlng = {lat: -33.865143, lng: 151.209900};

  var map = new google.maps.Map(document.getElementById('mapAreaChallengeCreation'), {
    zoom: 15,
    center: myLatlng
  });

  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
    console.log('latitude, longitude', e.latLng.lat(), e.latLng.lng())
  });
}

function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
}
