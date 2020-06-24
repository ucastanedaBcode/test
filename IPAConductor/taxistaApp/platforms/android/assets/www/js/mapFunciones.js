
    var direccion_ubicacion;
    var direccion_destino;
    var markersArray = [];
    var map;
    var directionsService;
    var directionsDisplay;
    var geocoder;
    var destinoLng;
    var destinoLat;
    var markacentrar;
    function initMap() {
        direccion_ubicacion = "";
        direccion_destino = "";
        directionsService = new google.maps.DirectionsService();
        geocoder = new google.maps.Geocoder();


        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 19.702559, lng: -101.192341},
            zoom: 13,
            rotateControl: false,
            mapTypeControl: true,
            streetViewControl: false
        });

        google.maps.event.trigger(map, 'resize');

        directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
        });

        google.maps.event.addListener(map, 'bounds_changed', function () {
            document.getElementById("img_loading_map").style.display = "none";
            $(".img_loading_map").hide();
        });


    }


    function marker(ubicacion_taxi_lat,ubicacion_taxi_lng) {
        if (markersArray[0]) {
            markersArray[0].setMap(null);
            markersArray.splice(-1, 1);
        }
        var icon = {
            url: "icon/taxi_marca.png",
            scaledSize: new google.maps.Size(40, 40),
            labelOrigin: new google.maps.Point(20, 15)
        };
        var marker = new google.maps.Marker({
            position: {lat: ubicacion_taxi_lat, lng: ubicacion_taxi_lng},
            map: map,
            icon: icon,
            draggable: false
        });

        markacentrar = marker;

        marker.setMap(map);
        markersArray.push(marker);
    }

    function traza_ruta(dir_ubicacion, dir_destino) {
        console.log("tr " + dir_ubicacion);
        console.log("tr " + dir_destino);

        directionsDisplay.setMap(null);

        direccion_destino = dir_destino;
        directionsDisplay.setMap(map);
        directionsService.route({
            origin: dir_ubicacion,
            destination: dir_destino,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                document.getElementById("txt_metros_viaje").value = response.routes[0].legs[0].distance.value;
                directionsDisplay.setDirections(response);
                consulta_costo_viaje();
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    function borrar_marcas() {
        directionsDisplay.setMap(null);
    }



    function obtener_direccion_ubicacion_actual() {
        var latlng = new google.maps.LatLng(ubicacion_taxi_lat, ubicacion_taxi_lng);

        geocoder.geocode({'latLng': latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    document.getElementById("txt_direccion_destino_cliente").value = results[0].formatted_address;
                    document.getElementById("txt_destino").value = results[0].formatted_address;
                    traza_ruta(document.getElementById("txt_direccion_ubicacion_cliente").value, results[0].formatted_address);
                } else {
                    myApp.alert('Ocurrio un error al cargar la direccion de destino');
                }
            } else {
                myApp.alert('Ocurrio un problema con maps ' + status);
            }
        });
    }

    function center_map() {
        map.setCenter(markacentrar.getPosition());
        console.log("centrado");
    }
    function Centrar_Ubicacion_Taxi(ubicacion_taxi_lng,ubicacion_taxi_lat){
        console.log(ubicacion_taxi_lng);
        console.log(ubicacion_taxi_lat);
        geocoder.geocode({'address':'monaco 189, villa universidad'},function(results,status){
            if (status=='OK') {
                var position = new google.maps.LatLng(19.686510889594558,-101.19904797777406);
                //var position= new google.maps.LatLng(lat_cli, lng_cli);  
                map.setCenter(position);
                map.setZoom(17);
            }
        });
    }   
