
  // Note: This example requires that you consent to location sharing when
  // prompted by your browser. If you see the error "The Geolocation service
  // failed.", it means you probably did not give permission for the browser to
  // locate you.
  var geocoder;
  function setUbicacion(marker) {
    var markerLatLng = marker.getPosition();
    var latitud=markerLatLng.lat();
    var longitud=markerLatLng.lng();
    codeLatLng(latitud,longitud);
  }
  function setDestino(destino) {
    var destinoLatLng = destino.getPosition();
    var latitud=destinoLatLng.lat();
    var longitud=destinoLatLng.lng();
    setDireccion_destino(latitud,longitud);
  }

  function codeLatLng(la, lo) {
    var lat = la;
    var lng = lo;
    console.log(la);
    console.log(lo);
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#ubicacion').val(results[0].formatted_address);
         
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }

  function setDireccion_destino(la, lo) {
    var lat = la;
    var lng = lo;
    console.log(la);
    console.log(lo);
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#destino').val(results[0].formatted_address);
         
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }

  var markersArray=[];
  function initMap() {
    geocoder = new google.maps.Geocoder();
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 19.7028257, lng: -101.1923878},
      zoom: 17,
      rotateControl : false,
      mapTypeControl: true,
      streetViewControl: false
    });
    
//        var infoWindow = new google.maps.InfoWindow({map: map});
    google.maps.event.addListener(map, 'click', function(event) {
      var coordenadas = event.latLng;
      var lat = coordenadas.lat();
      var lng = coordenadas.lng();
      var destino;
    

        var pinColor = "01DF01";
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));

        var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
            new google.maps.Size(40, 37),
            new google.maps.Point(0, 0),
            new google.maps.Point(12, 35));

      destino = new google.maps.Marker({
        position: {lat:lat, lng:lng},
        map: map,
        icon: pinImage,
        shadow: pinShadow,
        draggable: true 
      });
      destino.setMap(map); 
      markersArray.push(destino);

      google.maps.event.addListener(destino, 'dragend', function(){
            setDestino(destino);
      });
      setDestino(destino);
    });
    
    // Try HTML5 geolocation.
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(function(position) {
        var pos ={
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
       
        var marker = new google.maps.Marker({
          position: pos,
          draggable: true 
        });

        marker.setMap(map); 
        markersArray.push(marker);
        //infoWindow.setPosition(pos);
        //infoWindow.setContent('Location found.');
        map.setCenter(pos);
        setUbicacion(marker);

        google.maps.event.addListener(marker, 'dragend', function(){
            setUbicacion(marker);
        });


      }, function() {
        //handleLocationError(true, infoWindow, map.getCenter());
        myApp.alert('No fue encontrada tu ubicación', '¡Algo ocurrió!', function () {
          myApp.alert('Sólo mueve el marcador a tu ubicación actual','No te preocupes')
        });
        var marker = new google.maps.Marker({
          position: {lat: 19.7028257, lng: -101.1923878},
          draggable: true 
        });
        marker.setMap(map); 
        setUbicacion(marker);
        google.maps.event.addListener(marker, 'dragend', function(){
            setUbicacion(marker);
        });
        markersArray.push(marker);
      });
    } else {
        myApp.alert('Tu dispositivo no soporta la geolocalización','ERROR');
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
  }