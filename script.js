//Victoria
let myLat = 48.4284;
let myLong = -123.3656;
let myLocation = new google.maps.LatLng(myLat, myLong);

let map;
let service;
let infoWindowPark;//for park info
let infoWindowCurrentLocation;//for your location

let markers = [];//list of all markers on the map.
let initMap;

//when the window loads intitalize the map
window.onload = initializeMap;



//initialize map
function initializeMap(){
  
  
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLocation,
    zoom:13
  });
  
  searchForParks(myLocation);//call function searchForParks
  
  infoWindowCurrentLocation = new google.maps.InfoWindow();
  infoWindowPark =  new google.maps.InfoWindow();
  
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindowCurrentLocation.setPosition(pos);
          infoWindowCurrentLocation.setContent("Location found.");
          infoWindowCurrentLocation.open(map);
          map.setCenter(pos);
          
          searchForParks(pos);
          
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}//initialize Map

// Error Message if Geolocation fails
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
//initalize map

//search parks within 5km
//https://developers.google.com/maps/documentation/javascript/examples/place-search

function searchForParks(location){
 
  // use places API to search for all parks within 5km
  let request = {
    location: location,
    radius:"500",
    query: "park"
  };
  
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, processParks);
} 

//process search results for park
function processParks(results, status) {
  if(status== google.maps.places.PlacesServiceStatus.OK){
   
    deleteMarkers();
    
    for(let i = 0; i < results.length; i++) {
      let place = results[i];
      console.log(place);
      createMarker(place);
    
    }//for
  }//if
}//processParks
function createMarker(place) {

  if (!place.geometry || !place.geometry.location) return;

  const scaledIcon = {
  url: place.icon,
  scaledSize: new google.maps.Size(30, 30),
    anchor: new google.maps.Point(0,0),//anchor
    origin: new google.maps.Point(0,0)//origin

  }
  
  const marker = new google.maps.Marker({
    map,//markerOnMap
    position: place.geometry.location,
    title: place.name,
    icon: scaledIcon
  });

  console.log(infoWindowPark);
  
  google.maps.event.addListener(marker, "click", () => {//adds event listener for click
    let contentString = "<h3>" + place.name + "</h3>" + "Rating: <b>" 
    + place.rating + "</b> / 5 <p>" + place.formatted_address + "</p>";
    
    infoWindowPark.setContent(contentString || "");
    infoWindowPark.open(map, marker);//infowindow open when user clicks icon
  });
  
  markers.push(marker);
  
}//createMarker

//https://developers.google.com/maps/documentation/javascript/examples/marker-remove
// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  hideMarkers();
  markers = [];
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}