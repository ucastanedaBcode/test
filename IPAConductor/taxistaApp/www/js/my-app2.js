
// Initialize app
var myApp = new Framework7();
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});
// Add view
/*var mainView = myApp.addView('.view-main', {
 // Because we want to use dynamic navbar, we need to enable it for this view:
 dynamicNavbar: true
 });¨*/

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
});
// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

});

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
// Get page data from event data
    var page = e.detail.page;
    if (page.name === 'about') {
// Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
// Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
});

var peticionesid;
var claxon;
var claxonid;
var servicio_sttsid;
var ubicacion_taxi_lat;
var ubicacion_taxi_lng;
var ubicacionesid;

var clio;
var clid;

function initial_view(){
	if (document.getElementById("hidden_status").value === "Activo") {
        GPScheck();
        document.getElementById("btn_gps").style.display = "block";
        claxon = document.createElement('audio');
    	claxon.setAttribute('src', 'audio/claxon.mp3');
    } else if (document.getElementById("hidden_status").value === "Sancionado") {
        document.getElementById("btn_gps").style.display = "none";
        actualiza_estatus_taxi('fuera servicio');
    }

}
function GPScheck() {
    if ($('#GPScheck').is(':checked')) { 
        revision_estado();
        
     	/*
        try {
            cordova.plugins.diagnostic.isLocationEnabled(function (activo) {
                if (activo === true) {
                    $("#opcion_inicio").load("inicio_content.html");
				    $("#opcion_inicio").show();
				    ubicacionesid = setInterval(ubicacion_unidad,2000);
				    //interval_peticiones = setInterval(peticiones, 2000);
				    //interval_ubicacion_unidad = setInterval(ubicacion_unidad, 2000);
				    actualiza_estatus_taxi('libre');
				    buscar_peticiones();
				    //setTimeout(center_map(), 10000);
                } else {
                    gps_desactivado();
                    borrar_intervalo_peticiones_ubicacion();
                }
            }, function () {
                gps_desactivado();
                borrar_intervalo_peticiones_ubicacion();
            });
        } catch (e) {
            gps_desactivado();
            borrar_intervalo_peticiones_ubicacion();
        }
    */

    /*    
	$("#opcion_inicio").load("inicio_content.html");
    $("#opcion_inicio").show();
    setInterval(ubicacion_unidad,2000);
    //interval_peticiones = setInterval(peticiones, 2000);
    //interval_ubicacion_unidad = setInterval(ubicacion_unidad, 2000);
    revision_estado();
    actualiza_estatus_taxi('libre');
    buscar_peticiones();
    //setTimeout(center_map(), 10000);
    */
    
    } else {
        borrar_intervalo_peticiones_ubicacion();
        actualiza_estatus_taxi('fuera servicio');
    }
}
function buscar_peticiones(){
	peticionesid = setInterval(peticiones,2000);
}
function peticiones() {
		id_peticion = "";
	    latitud_ubicacion_cliente = "";
	    longitud_ubicacion_cliente = "";
	    latitud_destino_cliente = "";
	    longitud_destino_cliente = "";
	    document.getElementById("txt_texto_direccion_ubicacion_cliente").value = "";
	    document.getElementById("txt_direccion_destino_cliente").value = "";
	    document.getElementById("txt_direccion_ubicacion_cliente").value = "";
	    document.getElementById("destino_cliente").value = "";
	    document.getElementById("costo_cliente_viaje").value = "";
	    //document.getElementById("txt_estatus_taxi").value = "libre";
	    $.ajax({
	        type: "POST",
	        cache: false,
	        url: "http://bcodemexico.com/taxiApp2/Taxistas/peticiones.php",
	        data: "id_chofer=" + document.getElementById("hidden_id_chofer").value,
	        async: false,
	        success: function (datas) {
	            if($.trim(datas)=== "1"){
	                console.log("vacio");
	            }
	            else{
	
	            sonar();
	          	claxonid = setInterval(sonar,5000);
	            var data = JSON.parse(datas);
	            console.log(data);
	            
				latitud_ubicacion_cliente = data["latitud_ubicacion"];
	            longitud_ubicacion_cliente = data["longitud_ubicacion"];
	            latitud_destino_cliente = data["latitud_destino"];
	            longitud_destino_cliente = data["longitud_destino"];
				
				
	            document.getElementById("txt_texto_direccion_ubicacion_cliente").value = data["texto_direccion"];
	            $("#lat_ubic_cliente_sol").val(data["latitud_ubicacion"]);
	            $("#long_ubic_cliente_sol").val(data["longitud_ubicacion"]);
	            $("#id_solicitud_servicio").val(data["id_peticion"]);
	            clearInterval(peticionesid);
	            /*peticionesid = undefined;*/

	            document.getElementById("btn_libre").style.display = "none";
	            document.getElementById("btn_ocupado").style.display ="none";
	            modal_solicitud(latitud_ubicacion_cliente,longitud_ubicacion_cliente,latitud_destino_cliente,longitud_destino_cliente);
	            $("#btn-menup").hide();
	            /*timer_reload = setTimeout(auto_close, 15000);*/
	            }
	            
	        },
	        error: function (e) {
	            console.log('Error: ' + e);
	        }	
    	});
}
function sonar(){
    claxon.play();
}
function revisar_cancelacion(){
	servicio_sttsid = setInterval(servicio_stts,2000)
}
function consultar_direcciones_peticion(latitud_ubicacion_cliente,longitud_ubicacion_cliente,latitud_destino_cliente,longitud_destino_cliente) {
    iniciar_mapa_m();
    var latlng;
    if (latitud_destino_cliente !== "" && longitud_destino_cliente !== "") {
        latlng = new google.maps.LatLng(latitud_destino_cliente, longitud_destino_cliente);
        geocoder1.geocode({'latLng': latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
					clid=results[0].formatted_address;
                    document.getElementById("destino_cliente").value = results[0].formatted_address;
                    document.getElementById("txt_direccion_destino_cliente").value = results[0].formatted_address;
                } else {
                    myApp.alert('Ocurrio un error al cargar la direccion de destino');
                }
            } else {
                myApp.alert('Ocurrio un problema con maps ' + status);
            }
        });
    }
    if (latitud_ubicacion_cliente !== "" && longitud_ubicacion_cliente !== "") {
        latlng = new google.maps.LatLng(latitud_ubicacion_cliente, longitud_ubicacion_cliente);
        geocoder1.geocode({'latLng': latlng}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
					clio=results[0].formatted_address;
                    document.getElementById("ubicacion_cliente").value = results[0].formatted_address;
                    document.getElementById("txt_direccion_ubicacion_cliente").value = results[0].formatted_address;
                } else {
                    alert('Ocurrio un error al cargar la direccion de inicio');
                }
            } else {
                alert('Ocurrio un problema con maps ' + status);
            }
        });
    }
}
function iniciar_mapa_m() {
    directionsService1 = new google.maps.DirectionsService();
    geocoder1 = new google.maps.Geocoder();
    map_m = new google.maps.Map(document.getElementById('mapSolicitud'), {
        center: {lat: 19.702559, lng: -101.192341},
        zoom: 18,
        rotateControl: false,
        mapTypeControl: true,
        streetViewControl: false,
    });

    directionsDisplay1 = new google.maps.DirectionsRenderer({
        map: map_m,
    });
}
function modal_solicitud(latitud_ubicacion_cliente,longitud_ubicacion_cliente,latitud_destino_cliente,longitud_destino_cliente) {
        //myApp.popup('.popup-verSolicitud');
        consultar_direcciones_peticion(latitud_ubicacion_cliente,longitud_ubicacion_cliente,latitud_destino_cliente,longitud_destino_cliente);
        $("#popup-verSolicitud").show();
        $("#opcion_inicio").hide();
        $("#opcion_historial").hide();
        $("#opcion_cartera").hide();
        $("#opcion_perfil").hide();
        $("#opcion_cuenta_bancaria").hide();
        if (latitud_destino_cliente !== "" && longitud_destino_cliente !== "") {
            trazar_ruta();
            google.maps.event.trigger(map_m, 'resize');
        } else if (latitud_ubicacion_cliente !== "" && longitud_ubicacion_cliente !== "") {
            var marker_cliente = new google.maps.Marker({
                position: {lat: parseFloat(latitud_ubicacion_cliente), lng: parseFloat(longitud_ubicacion_cliente)},
                map: map_m,
                draggable: false
            });
            marker_cliente.setMap(map_m);
            google.maps.event.trigger(map_m, 'resize');
            map_m.setCenter(marker_cliente.getPosition());
        } else {
            document.getElementById("ubicacion_cliente").value = document.getElementById("txt_texto_direccion_ubicacion_cliente").value;
        }
        //revisar_cancelacion();
}
function ubicacion_unidad() {
    /*
    try {
        cordova.plugins.diagnostic.isLocationEnabled(function (activo) {
            if (activo === true) {
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(function (position) {
			    	ubicacion_taxi_lat =position.coords.latitude;
					ubicacion_taxi_lng =position.coords.longitude;
			        marker(position.coords.latitude,position.coords.longitude);
			        update_ubicacion(position.coords.latitude,position.coords.longitude);
			    });
                } else {
                    gps_desactivado();
                    borrar_intervalo_peticiones_ubicacion();
                }
            } else {
                gps_desactivado();
                borrar_intervalo_peticiones_ubicacion();
            }
        }, function () {
            gps_desactivado();
            borrar_intervalo_peticiones_ubicacion();
        });
    } 
    catch (e) {
        gps_desactivado();
        borrar_intervalo_peticiones_ubicacion();
    }
    */
    
    
    navigator.geolocation.getCurrentPosition(function (position) {
    	ubicacion_taxi_lat =position.coords.latitude;
		ubicacion_taxi_lng =position.coords.longitude;
		//console.log(position.coords.latitude +","+position.coords.longitude);
        marker(position.coords.latitude,position.coords.longitude);
        update_ubicacion(position.coords.latitude,position.coords.longitude);
    });
    
    
}
function borrar_intervalo_peticiones_ubicacion() {
    /*clearInterval(interval_peticiones);
    interval_peticiones = undefined;
    clearInterval(interval_ubicacion_unidad);
    interval_ubicacion_unidad = undefined;*/
    clearInterval(peticionesid);
    clearInterval(ubicacionesid);
    $("#opcion_inicio").load("componentes/gps_disabled.html");
}
function update_ubicacion(ubicacion_taxi_lat,ubicacion_taxi_lng) {
    if (ubicacion_taxi_lat === "" || ubicacion_taxi_lng === "") {

    } else {
        $.ajax({
            type: "POST",
            dataType: 'text',
            url: "http://bcodemexico.com/taxiApp2/Taxistas/coordenadasUnidad.php",
            data: "id_chofer=" + document.getElementById("hidden_id_chofer").value + "&matricula=" + document.getElementById("hidden_matricula").value + "&latitud=" + ubicacion_taxi_lat + "&longitud=" + ubicacion_taxi_lng + "&estado_taxi=" + document.getElementById("txt_estatus_taxi").value,
            success: function (data) {
                $("#respuesta").html(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }
}

function gps_desactivado() {
    $('#GPScheck').prop('checked', false);
    myApp.alert("Verifica que tengas activada la ubicación en tu teléfono", "GPS");
    actualiza_estatus_taxi('fuera servicio');
}
function actualiza_estatus_taxi(estatus) {
    $.ajax({
        type: "POST",
        dataType: 'text',
        url: "http://bcodemexico.com/taxiApp2/Taxistas/coordenadasUnidad.php",
        data: "id_chofer=" + document.getElementById("hidden_id_chofer").value + "&matricula=" + document.getElementById("hidden_matricula").value + "&estado_taxi=" +estatus,
        success: function (data) {
        	$("#txt_estatus_taxi").val(estatus);
        	$('#status_mostrar_taxi').html($('#txt_estatus_taxi').val())
            $("#respuesta").html(data);
            console.log('actualizo en el ajax')
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

function opcion_menu(opcion){
	switch(opcion){
		case 'opcion1':
				$("#opcion_inicio").show();
                $("#opcion_historial").hide();
                $("#opcion_cartera").hide();
                $("#opcion_perfil").hide();
                $("#opcion_cuenta_bancaria").hide();
		break;
		case 'opcion2':
				$("#opcion_inicio").hide();
                $("#opcion_historial").show();
                $("#opcion_cartera").hide();
                $("#opcion_perfil").hide();
                $("#opcion_cuenta_bancaria").hide();
		break;
		case 'opcion3':
				$("#opcion_inicio").hide();
     	       	$("#opcion_historial").hide();
                $("#opcion_cartera").show();
                $("#opcion_perfil").hide();
                $("#opcion_cuenta_bancaria").hide();
		break;
		case 'opcion4':
				$("#opcion_inicio").hide();
     	       	$("#opcion_historial").hide();
                $("#opcion_cartera").hide();
                $("#opcion_perfil").show();
                $("#opcion_cuenta_bancaria").hide();
		break;
		case 'opcion5':
				$("#opcion_inicio").hide();
     	       	$("#opcion_historial").hide();
                $("#opcion_cartera").hide();
                $("#opcion_perfil").hide();
                $("#opcion_cuenta_bancaria").show();
		break;
	}

}

function closeSession() {
    localStorage.user = "";
    localStorage.pass = "";

    window.open("index.html");
}
function cambiar_estado_a_libre(){
    //actualiza_estatus_taxi('libre');
    myApp.showPreloader("Cambiando a libre");
    $.ajax({
        type: "POST",
        dataType: 'text',
        url: "http://bcodemexico.com/taxiApp2/Taxistas/coordenadasUnidad.php",
        data: "id_chofer=" + document.getElementById("hidden_id_chofer").value + "&matricula=" + document.getElementById("hidden_matricula").value + "&estado_taxi='libre'",
        success: function (data) {
        	myApp.hidePreloader();
        	$("#txt_estatus_taxi").val('libre');
        	$('#status_mostrar_taxi').html($('#txt_estatus_taxi').val())
            $("#respuesta").html(data);
            console.log('actualizo en el ajax'); 
            document.getElementById("btn_libre").style.display = "none";
    		document.getElementById("btn_ocupado").style.display ="block";
        },
        error: function (jqXHR, textStatus, errorThrown) {
        	myApp.hidePreloader();
            console.log(textStatus);       
        }
    });
    
}
function cambiar_estado_a_ocupado(){
    //actualiza_estatus_taxi('ocupado');
    myApp.showPreloader("Cambiando a ocupado");
    $.ajax({
        type: "POST",
        dataType: 'text',
        url: "http://bcodemexico.com/taxiApp2/Taxistas/coordenadasUnidad.php",
        data: "id_chofer=" + document.getElementById("hidden_id_chofer").value + "&matricula=" + document.getElementById("hidden_matricula").value + "&estado_taxi='ocupado'",
        success: function (data) {
        	myApp.hidePreloader();
        	$("#txt_estatus_taxi").val('ocupado');
        	$('#status_mostrar_taxi').html($('#txt_estatus_taxi').val())
            $("#respuesta").html(data);
            console.log('actualizo en el ajax');
            document.getElementById("btn_libre").style.display = "block";
    		document.getElementById("btn_ocupado").style.display ="none";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            myApp.hidePreloader();
        }
    });
    
}
function aceptar_solicitud_entrante() {
    myApp.showPreloader("Cargando datos...");
	clearInterval(claxonid);
    $.ajax({
        type: 'POST',
        url: "http://bcodemexico.com/taxiApp2/Taxistas/aceptarSolicitudEntrante.php",
        data: "id_peticion=" + $("#id_solicitud_servicio").val(),
        success: function (data) {
        	if($.trim(data) == "1"){
    			actualiza_estatus_taxi('ocupado');
			    //document.getElementById("btn-menup").style.display="none";
			    if ($("#lat_ubic_cliente_sol").val() !== "" && $("#long_ubic_cliente_sol").val() !== "") {
			        var latlng = new google.maps.LatLng(ubicacion_taxi_lat, ubicacion_taxi_lng);
			        geocoder1.geocode({'latLng': latlng}, function (results, status) {
			            if (status == google.maps.GeocoderStatus.OK) {
			                if (results[0]) {
			                    traza_ruta(results[0].formatted_address, document.getElementById("ubicacion_cliente").value);
			                }
			            }
			        });
			        document.getElementById("txt_destino").value = document.getElementById("txt_texto_direccion_ubicacion_cliente").value;
			        $("#btn_recoger_cliente").attr('disabled',false);
			        document.getElementById("btn_recoger_cliente").style.display = "block";
			    } else {
			        document.getElementById("txt_destino").value = document.getElementById("txt_texto_direccion_ubicacion_cliente").value;
			        $("#btn_recoger_cliente").attr('disabled',false);
			        document.getElementById("btn_recoger_cliente").style.display = "block";
			    }
                myApp.hidePreloader();
			    //myApp.closeModal(".popup-verSolicitud");
	            $("#popup-verSolicitud").hide();
	            $("#opcion_inicio").show();
	            document.getElementById("ruta_actual").value = "recoger_cliente";
	            document.getElementById("txt_destino").value = document.getElementById("ubicacion_cliente").value;
	            //document.getElementById("btn_cancelar_servicio").style.display = "block";
	            /*intervalo_stts_servicio = setInterval(servicio_stts, 2000);
	            intervalo_seg_unidad = setInterval(seguir_taxi, 2000);*/
        	}
        	else{
    			myApp.alert('¡El cliente ha cancelado el servicio!', 'Servicio cancelado');
    			$("#popup-verSolicitud").hide();
	            $("#opcion_inicio").show();
	            $("#btn-menup").show();
	            buscar_peticiones();
        	}

        },
        error: function (jqXHR, textStatus, errorThrown) {
			myApp.alert('¡El cliente ha cancelado el servicio!',textStatus);
				myApp.hidePreloader();
        }
    });
}
function trazar_ruta() {
	
	  setTimeout(function(){
        
    
	 
	//alert("origen-destino--"+clio+" "+clid);
    directionsService1.route({
        origin: document.getElementById("ubicacion_cliente").value,
        destination: document.getElementById("destino_cliente").value,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            document.getElementById("txt_metros_viaje").value = response.routes[0].legs[0].distance.value;
            directionsDisplay1.setDirections(response);

            consulta_costo_viaje();
        } else {
            window.alert('No se pudo establecer la ruta' + status);
        }
    });
	}, 5000);
}
function rechazar_solicitud_view() {
    myApp.modal({
        title: '<div style="font-size: 20px;font-weight: bold;">Rechazar solicitud</div>',
        text: '<div class="div-modal-notificacion">¿Estás seguro que deseas rechazar la solicitud?</div>',
        buttons: [{
                text: 'No',
                onClick: function () {
                }
            },
            {
                text: 'Si',
                onClick: function () {
                	clearInterval(claxonid);
                    rechazar_peticion("rechazada");
                    //myApp.closeModal(".popup-verSolicitud");
                    document.getElementById("popup-verSolicitud").style.display ='none';
                    document.getElementById("opcion_inicio").style.display = 'block';
                    $("#btn-menup").show();

                    document.getElementById("btn_libre").style.display = "none";
                    document.getElementById("btn_ocupado").style.display ="block";
                }
            }]
    });
}
function rechazar_peticion(stts) {
    $.ajax({
        type: "POST",
        dataType: 'text',
        cache: false,
        url: "http://bcodemexico.com/taxiApp2/Taxistas/borrarPeticion.php",
        data: "id_peticion=" + $("#id_solicitud_servicio").val() + "&estado=" + stts,
        success: function (data) {
        	console.log(data)
        	if($.trim(data) === "successful"){
        		$('#respuesta').html(data);
            	buscar_peticiones();
        	}
        	else{
				myApp.alert('¡Problemas con el servidor!', 'Error');
				buscar_peticiones();
        	}
            
            //interval_peticiones = setInterval(peticiones, 2000);
        },
        error: function (e) {
            console.log('Error: ' + e);
        }
    });
}
function servicio_stts() {
    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/consultaEstadoSolicitud.php",
        type: 'POST',
        data: "id_peticion=" + $("#id_solicitud_servicio").val(),
        success: function (data, textStatus, jqXHR) {
            if (data.trim() === "cancelada") {
            	clearInterval(claxonid);
            	/*
                clearInterval(intervalo_stts_servicio);
                intervalo_stts_servicio = undefined;
                clearInterval(intervalo_seg_unidad);
                intervalo_seg_unidad = undefined;*/
                myApp.alert('¡El cliente ha cancelado el servicio!', 'Servicio cancelado');
                resetear_mapa();
                /*
                interval_peticiones = setInterval(peticiones, 2000);
                */
                actualiza_estatus_taxi('libre'); 
                clearInterval(servicio_sttsid);
                $("#btn_recoger_cliente").hide();
                $("#opcion_inicio").show();
                $("#popup-verSolicitud").hide();
                $("#btn_libre").hide();
                $("#btn_ocupado").show();
                $("#btn-menup").show();
                buscar_peticiones();
            } else if (data.trim() === "terminada") {
            	/*
                clearInterval(intervalo_stts_servicio);
                intervalo_stts_servicio = undefined;

                latitud_destino_cliente = ubicacion_taxi_lat;
                longitud_destino_cliente = ubicacion_taxi_lng;*/
                //obtener_direccion_ubicacion_actual();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}
function resetear_mapa() {
    borrar_marcas();
    document.getElementById("txt_destino").value = "";
}
function recoger_cliente() {
    $("#btn_recoger_cliente").attr('disabled','disabled');
	//alert(ubicacion_taxi_lng);
    console.log(ubicacion_taxi_lng);
    if(ubicacion_taxi_lat !== undefined && ubicacion_taxi_lng !== undefined){
        console.log('entro');
        //$("#btn_recoger_cliente").attr('disabled','disabled');
        myApp.showPreloader("Registrando Llegada...");
        $("#lat_ubic_cliente_real").val(ubicacion_taxi_lat);
        $("#long_ubic_cliente_real").val(ubicacion_taxi_lng);
        $.ajax({
            url: "http://bcodemexico.com/taxiApp2/Taxistas/recoger_cliente.php",
            type: 'POST',
            data: "id_peticion=" + $("#id_solicitud_servicio").val() + "&lat_ubicacion=" + ubicacion_taxi_lat + "&lng_ubicacion=" + ubicacion_taxi_lng,
            success: function (data, textStatus, jqXHR) {
                borrar_marcas();
                console.log("success recoger cliente");
                $("#btn_recoger_cliente").hide();
                myApp.hidePreloader();
                $("#btn_terminar_servicio").attr('disabled',false);
                $("#btn_terminar_servicio").show();
                var latlng;
                latlng = new google.maps.LatLng(ubicacion_taxi_lat, ubicacion_taxi_lng);
                geocoder1.geocode({'latLng': latlng}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            document.getElementById("ubicacion_cliente").value = results[0].formatted_address;
                            document.getElementById("txt_direccion_ubicacion_cliente").value = results[0].formatted_address;
                            document.getElementById("txt_destino").value = "";
                        } else {
                            console.log("Ocurrio un error en formato de dirección destino");
                        }
                    } else {
                        console.log('Ocurrio un problema con maps ' + status);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#btn_recoger_cliente").attr('disabled',false);
                myApp.hidePreloader();
                myApp.alert("Ocurrio un error en la conexion, intenta más tarde", "Error");
                console.log(textStatus);
            }
        });
    }
    else{
        recoger_cliente();
    }
    
}
function terminar_servicio() {
    $("#btn_terminar_servicio").attr('disabled','disabled');
	var destino_temporal="";  
    myApp.showPreloader("Terminando Servicio...");
    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/terminar_viaje.php",
        type: 'POST',
        data: "id_peticion=" + $("#id_solicitud_servicio").val() + "&lat_destino=" + ubicacion_taxi_lat + "&lng_destino=" + ubicacion_taxi_lng,
        success: function (data, textStatus, jqXHR) {

        	document.getElementById("btn-menup").style.display="block";
            var latlng;
            latlng = new google.maps.LatLng(ubicacion_taxi_lat, ubicacion_taxi_lng);
            geocoder1.geocode({'latLng': latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        document.getElementById("destino_cliente").value = results[0].formatted_address;
                        document.getElementById("txt_direccion_destino_cliente").value = results[0].formatted_address;
                        destino_temporal = results[0].formatted_address;
                    } 
                    else {
                        console.log("Ocurrio un error en formato de dirección destino");
                    	document.getElementById("destino_cliente").value = "Direccion No Registrada";
                        document.getElementById("txt_direccion_destino_cliente").value = "Direccion No Registrada";
                        destino_temporal = "Direccion No Registrada";
                    }
                	document.getElementById("txt_destino").value = "";
                    myApp.hidePreloader();
                    $("#btn_terminar_servicio").attr('disabled',false);
                   	$("#btn_terminar_servicio").hide();
                    document.getElementById("btn_libre").style.display = "none";
                    document.getElementById("btn_ocupado").style.display ="block";
                    actualiza_estatus_taxi('libre');
                    myApp.modal({
				        title: '<div style="font-size: 20px;font-weight: bold;">Llegaste</div>',
				        text: "<div class='div-modal-notificacion'>"+"Has llegado al destino</div>",
				        buttons: [{
				                text: 'Ok',
				                onClick: function () {
				                	$.ajax({
	                                    url: "http://bcodemexico.com/taxiApp2/Taxistas/actualiza_datos_viaje.php",
	                                    type: 'POST',
	                                    data: "estado=terminada&id_peticion=" + $("#id_solicitud_servicio").val() + "&ubicacion=" + document.getElementById("txt_direccion_ubicacion_cliente").value + "&destino=" + destino_temporal + "&costo=" + document.getElementById("txt_costo_viaje").value,
	                                    success: function (data, textStatus, jqXHR) {	
	                                        myApp.popup('.popup-calificacion-cliente');
	                                        clearInterval(servicio_sttsid);
			                                buscar_peticiones();
			                                borrar_marcas();
	                                    },
	                                    error: function (jqXHR, textStatus, errorThrown) {
	                                        console.log(textStatus);
	                                    }
	                                });
                                
				                }
				            }]
				    });
                } 
                else {
                    console.log('Ocurrio un problema con maps ' + status);
                }
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#btn_terminar_servicio").attr('disabled',false);
        	myApp.hidePreloader();
        	myApp.alert("Ocurrio un error en la conexion, intenta más tarde", "Error");
            console.log(textStatus);
        }
    });
}
/*
function terminar_servicio() {
    document.getElementById("btn-menup").style.display="block";
    $("#btn_terminar_servicio").attr('disabled','disabled');
    myApp.showPreloader("Terminando Servicio...");
    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/terminar_viaje.php",
        type: 'POST',
        data: "id_peticion=" + $("#id_solicitud_servicio").val() + "&lat_destino=" + ubicacion_taxi_lat + "&lng_destino=" + ubicacion_taxi_lng,
        success: function (data, textStatus, jqXHR) {
            console.log("success terminar");
            var latlng;
            latlng = new google.maps.LatLng(ubicacion_taxi_lat, ubicacion_taxi_lng);
            console.log("success terminar 2");
            geocoder1.geocode({'latLng': latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log("success terminar 3");
                    if (results[0]) {
                        document.getElementById("destino_cliente").value = results[0].formatted_address;
                        document.getElementById("txt_direccion_destino_cliente").value = results[0].formatted_address;
                        console.log("success terminar 4");
                        directionsService1.route({
                            origin: document.getElementById("ubicacion_cliente").value,
                            destination: results[0].formatted_address,
                            travelMode: 'DRIVING'
                        }, function (response, status) {
                            if (status === 'OK') {
                                document.getElementById("txt_metros_viaje").value = response.routes[0].legs[0].distance.value;
                                console.log("success terminar prueba");
                                console.log("metros " + document.getElementById("txt_metros_viaje").value);
                                consulta_costo_viaje();
                                console.log("costo " + document.getElementById("txt_costo_viaje").value);
                                //traza_ruta(document.getElementById("txt_direccion_ubicacion_cliente").value, results[0].formatted_address);
                                document.getElementById("txt_destino").value = "";
                                myApp.hidePreloader();
                               	$("#btn_terminar_servicio").hide();
                                document.getElementById("btn_libre").style.display = "none";
                                document.getElementById("btn_ocupado").style.display ="block";
                                actualiza_estatus_taxi('libre');
                                myApp.modal({
							        title: '<div style="font-size: 20px;font-weight: bold;">Llegaste</div>',
							        text: "<div class='div-modal-notificacion'>"+"Has llegado al destino, costo del viaje: " + document.getElementById("txt_costo_viaje").value + "</div>",
							        buttons: [{
							                text: 'Ok',
							                onClick: function () {
							                	$.ajax({
				                                    url: "http://bcodemexico.com/taxiApp2/Taxistas/actualiza_datos_viaje.php",
				                                    type: 'POST',
				                                    data: "estado=terminada&id_peticion=" + $("#id_solicitud_servicio").val() + "&ubicacion=" + document.getElementById("txt_direccion_ubicacion_cliente").value + "&destino=" + document.getElementById("txt_direccion_destino_cliente").value + "&costo=" + document.getElementById("txt_costo_viaje").value,
				                                    success: function (data, textStatus, jqXHR) {
				                                    	
				                                        myApp.popup('.popup-calificacion-cliente');
				                                        clearInterval(servicio_sttsid);
						                                buscar_peticiones();
						                                borrar_marcas();
				                                    },
				                                    error: function (jqXHR, textStatus, errorThrown) {
				                                        console.log(textStatus);
				                                    }
				                                });
			                                
							                }
							            }]
							    });
                                
                            } else {
                                console.log('No se pudo establecer la ruta' + status);
                            }
                        });

                    } else {
                        console.log("Ocurrio un error en formato de dirección destino");
                    }
                } else {
                    console.log('Ocurrio un problema con maps ' + status);
                }
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}
*/
function consulta_costo_viaje() {
    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/consulta_costo_viaje.php",
        type: 'POST',
        data: "metros=" + document.getElementById("txt_metros_viaje").value,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            document.getElementById("txt_costo_viaje").value = data[0].costo;
            document.getElementById("costo_cliente_viaje").value = "$ " + data[0].costo;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }

    });
}
function califica_cliente() {
    var formData = $("#frm_calificacion_cliente").serialize();

    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/agrega_calificacion_cliente_servicio.php",
        type: 'POST',
        data: formData + "&id_peticion=" + id_peticion,
        success: function (data, textStatus, jqXHR) {
            console.log("correcto");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error " + textStatus);
        }
    });
    myApp.closeModal(".popup-calificacion-cliente");
}
function consulta_datos_chofer() {
    myApp.showPreloader("Cargando datos...");

    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/consulta_foto_chofer.php",
        type: 'POST',
        data: "id_chofer=" + document.getElementById("hidden_id_chofer").value,
        success: function (data, textStatus, jqXHR) {
            document.getElementById("foto_chofer").innerHTML = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error foto");
        }
    });

    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/consulta_datos_chofer.php",
        type: 'POST',
        dataType: 'json',
        data: "id_chofer=" + document.getElementById("hidden_id_chofer").value,
        success: function (data, textStatus, jqXHR) {
            if (data[0].correcto.trim() === "si") {
                document.getElementById("label_apodo_perfil").innerHTML = data[0].apodo;
                document.getElementById("frm_perfil_apodo").value = data[0].apodo;
                document.getElementById("label_fecha_ingreso").innerHTML = data[0].fecha_ingreso;
                document.getElementById("label_nombre_perfil").innerHTML = data[0].nombre;
                document.getElementById("frm_perfil_nombre").value = data[0].nombre;
                document.getElementById("label_apellidos_perfil").innerHTML = data[0].appat + " " + data[0].apmat;
                document.getElementById("frm_perfil_appat").value = data[0].appat;
                document.getElementById("frm_perfil_apmat").value = data[0].apmat;
                document.getElementById("label_fecha_nacimiento_perfil").innerHTML = data[0].fecha_nac;
                document.getElementById("frm_perfil_fechanac").value = data[0].fecha_nac;
                document.getElementById("label_sexo_perfil").innerHTML = data[0].sexo;
                document.getElementById("frm_perfil_sexo").value = data[0].sexo;
                document.getElementById("label_tel_perfil").innerHTML = data[0].telefono;
                document.getElementById("frm_perfil_tel").value = data[0].telefono;
                document.getElementById("label_cel_perfil").innerHTML = data[0].celular;
                document.getElementById("frm_perfil_cel").value = data[0].celular;
                document.getElementById("label_calle_perfil").innerHTML = data[0].calle;
                document.getElementById("frm_perfil_calle").value = data[0].calle;
                document.getElementById("label_no_perfil").innerHTML = data[0].numero;
                document.getElementById("frm_perfil_numero").value = data[0].numero;
                document.getElementById("label_colonia_perfil").innerHTML = data[0].colonia;
                document.getElementById("frm_perfil_colonia").value = data[0].colonia;
                document.getElementById("label_cp_perfil").innerHTML = data[0].cp;
                document.getElementById("frm_perfil_cp").value = data[0].cp;
                myApp.hidePreloader();
            } else {
                myApp.hidePreloader();
                myApp.alert("Ocurrio un error al consultar los datos, intenta más tarde", "Error");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            myApp.hidePreloader();
        }
    });

}
function consulta_datos_cuenta_bancaria() {
    myApp.showPreloader("Obteniendo datos...");

    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/consulta_cuenta_bancaria.php",
        type: 'POST',
        dataType: 'json',
        data: "id_chofer=" + document.getElementById("hidden_id_chofer").value,
        success: function (data, textStatus, jqXHR) {
            if (data[0].existe.trim() === "si") {
                document.getElementById("label_sucursal_cuenta").innerHTML = data[0].sucursal;
                document.getElementById("label_clave_cuenta").innerHTML = data[0].clave;
                document.getElementById("label_titular_cuenta").innerHTML = data[0].titular;

                document.getElementById("txt_id_cuenta_b").value = data[0].id_cuenta;
                document.getElementById("txt_sucursal_cuenta_b").value = data[0].sucursal;
                document.getElementById("txt_clave_cuenta_b").value = data[0].clave;
                document.getElementById("txt_titular_cuenta_b").value = data[0].titular;

                myApp.hidePreloader();
            } else {
                myApp.hidePreloader();
                myApp.alert("No se encontró una cuenta bancaria asociada a tu perfil", "Sin cuenta");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            myApp.hidePreloader();
        }
    });

    myApp.hidePreloader();
}
function consulta_viajes_chofer() {

    if (document.getElementById("fecha1_historial").value === "" || document.getElementById("fecha2_historial").value === "") {
        myApp.alert("Selecciona las fechas inicial y final", "Fechas");
    } else {

        myApp.showPreloader("Cargando...");

        $.ajax({
            url: "http://bcodemexico.com/taxiApp2/Taxistas/consulta_historial_viajes.php",
            type: 'POST',
            data: "id_chofer=" + document.getElementById("hidden_id_chofer").value + "&fecha1=" + document.getElementById("fecha1_historial").value + "&fecha2=" + document.getElementById("fecha2_historial").value,
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                document.getElementById("tbl_body_traslados").innerHTML = data;
                myApp.hidePreloader();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error");
                myApp.hidePreloader();
            }
        });
    }
}
function consulta_cartera_chofer() {
    if (document.getElementById("fecha1_cartera").value === "" || document.getElementById("fecha2_cartera").value === "") {
        myApp.alert("Selecciona las fechas inicial y final", "Fechas");
    } else {
        myApp.showPreloader("Cargando datos");

        $.ajax({
            url: "http://bcodemexico.com/taxiApp2/Taxistas/consulta_cartera_cliente.php",
            type: 'POST',
            data: "id_chofer=" + document.getElementById("hidden_id_chofer").value + "&fecha1=" + document.getElementById("fecha1_cartera").value + "&fecha2=" + document.getElementById("fecha2_cartera").value,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                document.getElementById("label_monto_total_viajes").innerHTML = "$ " + data[0].monto_total_viajes;
                document.getElementById("label_comisiones").innerHTML = "$ " + data[0].comisiones;
                document.getElementById("label_resto_total").innerHTML = "$ " + data[0].restante;
                document.getElementById("porcentaje_comision_cartera").innerHTML = data[0].comision_porcentaje + " %";
                myApp.hidePreloader();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                myApp.hidePreloader();
            }
        });
    }
}

function registrar_cuenta() {
    if (revisa_frm_crea_cuenta_completo()) {
        if (verifica_pass_coincide()) {
            myApp.showPreloader("Registrando cuenta");

            var formData = new FormData(document.getElementById("frm_crear_cuenta"));

            $.ajax({
                url: "http://bcodemexico.com/taxiApp2/Taxistas/cuenta.php",
                type: 'POST',
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function (data, textStatus, jqXHR) {
                    myApp.hidePreloader();

                    if (data.trim() === "1") {
                        myApp.alert("Tu cuenta se ha registrado y esta en espera de autorización", "Registrada");
                        document.getElementById("frm_crear_cuenta").reset();
                    } else {
                        myApp.alert("Ocurrio un problema al registrar tu cuenta, por favor intenta más tarde", "Error");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    myApp.hidePreloader();

                    myApp.alert("Ocurrio un problema al registrar tu cuenta, por favor intenta más tarde", "Error");
                }
            });
        } else {
            myApp.alert("Las contraseñas escritas no coinciden", "Contraseña");
        }
    } else {
        myApp.alert("Completa el formulario", "Datos incompletos");
    }

}

function verifica_pass_coincide() {
    var coincide = false;

    if (document.getElementById("txt_pass_cuenta").value === document.getElementById("txt_pass2_cuenta").value) {
        coincide = true;
    }

    return coincide;
}

function revisa_frm_crea_cuenta_completo() {
    var completo = true;

    if (document.getElementById("txt_nombre_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_appat_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_apmat_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_sexo_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_fecha_nac_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_calle_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_no_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_colonia_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_cp_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_tel_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_cel_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_correo_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_usuario_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_pass_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_pass2_cuenta").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_central_cuenta").value === "") {
        completo = false;
    }

    return completo;

}
function cuenta_bancaria() {
    if (frm_cuenta_b_completo()) {
        myApp.showPreloader("Guardando datos...");

        var frmDatos = $("#frm_cuenta_bancaria").serialize();

        $.ajax({
            url: "http://bcodemexico.com/taxiApp2/Taxistas/cuenta_bancaria.php",
            type: 'POST',
            data: frmDatos + "&id_chofer=" + document.getElementById("hidden_id_chofer").value,
            success: function (data, textStatus, jqXHR) {
                myApp.hidePreloader();
                if (data.trim() === "1") {
                    myApp.alert("Datos de cuenta bancaria guardados", "Guardado");
                    $("#contenido_pagina").load("cuenta_bancaria.html");
                    consulta_datos_cuenta_bancaria();
                } else {
                    myApp.alert("Ocurrio un error al guardar, intenta más tarde", "Error");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                myApp.hidePreloader();
                myApp.alert("Ocurrio un error al guardar, intenta más tarde", "Error");
            }
        });
    } else {
        myApp.alert("Llena todos los campos", "Formulario");
    }
}

function frm_cuenta_b_completo() {
    var completo = true;

    if (document.getElementById("txt_sucursal_cuenta_b").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_clave_cuenta_b").value === "") {
        completo = false;
    }
    if (document.getElementById("txt_titular_cuenta_b").value === "") {
        completo = false;
    }

    return completo;
}
function actualiza_datos_chofer() {
    if (revisa_datos_completos()) {
        myApp.showPreloader("Guardando datos...");
        var formData = new FormData(document.getElementById("frm_actualiza_datos_chofer"));
        formData.append("id_chofer", document.getElementById("hidden_id_chofer").value);

        $.ajax({
            url: "http://bcodemexico.com/taxiApp2/Taxistas/actualiza_datos_chofer.php",
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data, textStatus, jqXHR) {
                myApp.hidePreloader();
                myApp.alert("Datos actualizados", "Correcto");
                $("#contenido_pagina").load("perfil.html");
                consulta_datos_chofer();
                $("#frm_perfil_foto").val("");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                myApp.hidePreloader();
                console.log("error: " + textStatus);
            }
        });

    } else {
        myApp.alert("Llena todos los campos", "Datos incompletos");
    }

}

function revisa_datos_completos() {
    var completo = true;

    if (document.getElementById("frm_perfil_apodo").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_nombre").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_appat").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_apmat").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_fechanac").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_sexo").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_tel").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_cel").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_calle").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_numero").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_colonia").value === "") {
        completo = false;
    }
    if (document.getElementById("frm_perfil_cp").value === "") {
        completo = false;
    }


    return completo;

}
function consulta_detalle(id_traslado) {
    $.ajax({
        url: "http://bcodemexico.com/taxiApp2/Taxistas/consulta_detalle_traslado.php",
        type: 'POST',
        data: "id_traslado=" + id_traslado,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            document.getElementById("fecha_det_t").innerHTML = data[0].fecha;
            document.getElementById("salida_det_t").innerHTML = data[0].salida;
            document.getElementById("llegada_det_t").innerHTML = data[0].llegada;
            document.getElementById("ubicacion_det_t").innerHTML = data[0].ubicacion;
            document.getElementById("destino_det_t").innerHTML = data[0].destino;
            document.getElementById("chofer_det_t").innerHTML = data[0].chofer;
            document.getElementById("matricula_det_t").innerHTML = data[0].matricula;
            document.getElementById("cliente_det_t").innerHTML = data[0].cliente;
            document.getElementById("costo_det_t").innerHTML = data[0].costo;

            myApp.popup(".popup-detalle-traslado");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("error: " + textStatus);
        }
    });


}

function revision_estado(){
    $("#opcion_inicio").load("inicio_content.html");
    $("#opcion_inicio").show();
    ubicacion_unidad();
    setInterval(ubicacion_unidad,2000);
    $.ajax({
        url:"http://bcodemexico.com/taxiApp2/Taxistas/revision_estado.php",
        type:'post',
        data:{'id_chofer':$("#hidden_id_chofer").val()},
        success: function(datas){
            //Centrar_Ubicacion_Taxi(ubicacion_taxi_lng,ubicacion_taxi_lat);
            //center_map();
            if($.trim(datas) === "0"){
                actualiza_estatus_taxi('libre');
                buscar_peticiones();
            }
            else{
                var data = JSON.parse($.trim(datas));
                if(data["estado"] == "aceptada"){
                    actualiza_estatus_taxi('ocupado');
                    $("#id_solicitud_servicio").val(data["id_peticion"]);
                    $("#txt_destino").val(data["mensaje"]);
                    $("#btn_recoger_cliente").attr('disabled',false);
                    document.getElementById("btn_recoger_cliente").style.display = "block";
					//+++++
					$("#btn_cancelar_servicio").attr('disabled',false);
                    document.getElementById("btn_cancelar_servicio").style.display = "block";
					
                    document.getElementById("btn_libre").style.display = "none";
                    document.getElementById("btn_ocupado").style.display ="none";
                    reestaurar_solicitud_aceptada("","","","");
                }
                else if(data["estado"] == "servicio"){
                    actualiza_estatus_taxi('ocupado');
                    $("#id_solicitud_servicio").val(data["id_peticion"]);
                    $("#btn_terminar_servicio").attr('disabled',false);
                    $("#btn_terminar_servicio").show();

                    document.getElementById("btn_libre").style.display = "none";
                    document.getElementById("btn_ocupado").style.display ="none";

                    iniciar_mapa_m();
                    
                    latlng = new google.maps.LatLng(data["latitud_ubicacion"],data["longitud_ubicacion"]);
                    geocoder1.geocode({'latLng': latlng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                document.getElementById("ubicacion_cliente").value = results[0].formatted_address;
                                document.getElementById("txt_direccion_ubicacion_cliente").value = results[0].formatted_address;
                            } else {
                                alert('Ocurrio un error al cargar la direccion de inicio');
                            }
                        } else {
                            alert('Ocurrio un problema con maps ' + status);
                        }
                    });
                    
                    
                }
                
            }
        }
    });
}
function reestaurar_solicitud_aceptada(latitud_ubicacion_cliente,longitud_ubicacion_cliente,latitud_destino_cliente,longitud_destino_cliente) {
        //myApp.popup('.popup-verSolicitud');
        consultar_direcciones_peticion(latitud_ubicacion_cliente,longitud_ubicacion_cliente,latitud_destino_cliente,longitud_destino_cliente);
        /*
        $("#popup-verSolicitud").show();
        $("#opcion_inicio").hide();
        $("#opcion_historial").hide();
        $("#opcion_cartera").hide();
        $("#opcion_perfil").hide();
        $("#opcion_cuenta_bancaria").hide();
        */
        if (latitud_destino_cliente !== "" && longitud_destino_cliente !== "") {
            trazar_ruta();
            google.maps.event.trigger(map_m, 'resize');
        } else if (latitud_ubicacion_cliente !== "" && longitud_ubicacion_cliente !== "") {
            var marker_cliente = new google.maps.Marker({
                position: {lat: parseFloat(latitud_ubicacion_cliente), lng: parseFloat(longitud_ubicacion_cliente)},
                map: map_m,
                draggable: false
            });
            marker_cliente.setMap(map_m);
            google.maps.event.trigger(map_m, 'resize');
            map_m.setCenter(marker_cliente.getPosition());
        } else {
            document.getElementById("ubicacion_cliente").value = document.getElementById("txt_texto_direccion_ubicacion_cliente").value;
        }
        revisar_cancelacion();
}

