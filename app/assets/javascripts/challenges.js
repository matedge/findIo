$(document).ready(function() {
  if (('#challenges_form').length > 0) {
    initChallengeMap()
    $('#location_ids').val("[]")

    $('#challenges_form').on('submit', function() {
      var locationIds = $('.locations').children().map(function() { return this.id }).get()
      $('#location_ids').val(locationIds.toString())
    })
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
    $.ajax({
      method: 'POST',
      url: '/locations',
      data: { "location[latitude]": e.latLng.lat(), "location[longtitude]": e.latLng.lng() }
    }).done(function(data) {
      createLocationHtml(data)
    }).fail(function(errors) {
      console.log(errors)
    })
  });
}

function createLocationHtml(data) {
  $.ajax({
    method: 'GET',
    url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+ data.latitude + ',' + data.longtitude
  }).done(function(googleData) {
    $(".locations").append('<div id="' + data.id + '" class="well well-lg"><a class="remove_location" href="#"><span class="pull-right glyphicon glyphicon-trash"></span></a><h3 class="lead"><span class="glyphicon glyphicon-home" aria-hidden="true"></span>  ' + googleData.results[0].formatted_address + '</h3></div>')
    addRemoveListener()
  })
}

function addRemoveListener() {
  $('.remove_location').each(function() {
    $(this).on('click', function(e) {
      e.preventDefault();
      $(this).closest('.well').fadeOut('slow', function() { $(this).remove() })
    })
  })
}

function placeMarkerAndPanTo(latLng, map) {
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  map.panTo(latLng);
}
