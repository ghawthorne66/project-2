/* eslint-disable */
// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var exampleData = [
  {
    location: {
      lat: 32.7341,
      lng: -117.1446
    },
    name: "example"
  }
];
​
var placeSearch, autocomplete, map;
var markers = [];
​
function initMap() {
  console.log("initMap()");
  if (google.maps) {
    console.log("1) Google maps has been loaded");
  }
​
  if (typeof google === "object" && typeof google.maps === "object") {
    console.log("2) Google maps has been loaded");
  }
​
  bounds = new google.maps.LatLngBounds();
  infoWindow = new google.maps.InfoWindow();
  currentInfoWindow = infoWindow;
  infoPane = document.getElementById("panel");
​
  // The location of San Diego
  pos = {
    lat: 32.7157,
    lng: -117.1611
  };
  // The map, centered at San Diego
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: pos
  });
  // The marker, positioned at San Diego
  // var marker;
  // marker = new google.maps.Marker({ position: pos, map: map });
  createDataMarkers(exampleData);
  bounds.extend(pos);
  // infoWindow.setPosition(pos);
  // infoWindow.setContent('Location found.');
​
  // console.log("Should be opening map: " + map);
  // infoWindow.open(map);
  // getNearbyPlaces(pos, "restaurants");
}
​
/////___________Search by City_____________////
​
$("#search").on("click", function(event) {
  // Clear map
  deleteMarkers();
​
  // Gets nearby places using the zip code the user inputted
  var city = $("#city").val();
  // getNearbyPlaces({}, city);
​
  // AJAX GET request to a /api/cities route
  $.ajax({
    url: "/api/location/" + city,
    method: "GET"
  }).then(function(response){
    // that should respond with data from the db of corresponding cities
    console.log(response);
    for (var i = 0; i < response.length; i++) {
      var newMarker = {
        location: {
          lat: response[i].lat,
          lng: response[i].lng,
        },
        name: response[i].text
      }
      // then we push that data into our markers array
      markers.push(newMarker);
    }
    // call createDataMarkers function to display the markers on the page
    createDataMarkers(markers);
​
  })
});
​
​
​
​
// Perform a Places Nearby Search Request
function getNearbyPlaces(position, query) {
  //console.log("----------------> query: " + query);
  var request = {
    location: position,
    radius: "500",
    query: query,
    type: ["restaurants"]
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, nearbyCallback);
}
function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMarkers(results);
  }
}
​
function createDataMarkers(arr) {
  console.log("new data");
  for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]);
    marker = new google.maps.Marker({
      position: arr[i].location,
      map: map,
      title: arr[i].name
    });
    markers.push(marker);
  }
}
​
// Set markers at the location of each place result
function createMarkers(places) {
  places.forEach(place => {
    // console.log("----------------------------------")
​
    map.setCenter(place.geometry.location);
    let marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name
    });
    markers.push(marker);
    // Add click listener to each marker
    google.maps.event.addListener(marker, "click", () => {
      let request = {
        placeId: place.place_id,
        fields: [
          "name",
          "formatted_address",
          "geometry",
          "rating",
          "website",
          "photos"
        ]
      };
      service.getDetails(request, (placeResult, status) => {
        console.log("status in createMarkers: " + status);
        console.log("placeResult in createMarkers: " + placeResult);
        showDetails(placeResult, marker, status);
      });
    });
    // Adjust the map bounds to include the location of this marker
    bounds.extend(place.geometry.location);
  });
  map.fitBounds(bounds);
}
​
// InfoWindow to display details above the marker
function showDetails(placeResult, marker, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let placeInfowindow = new google.maps.InfoWindow();
    let rating = "None";
    if (placeResult.rating) {
      rating = placeResult.rating;
    }
    placeInfowindow.setContent(
      "<div><strong>" +
        placeResult.name +
        "</strong><br>" +
        "Rating: " +
        rating +
        "</div>"
    );
    placeInfowindow.open(marker.map, marker);
    currentInfoWindow.close();
    currentInfoWindow = placeInfowindow;
    showPanel(placeResult);
  } else {
    console.log("showDetails failed: " + status);
  }
}
​
function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    { types: ["geocode"] }
  );
​
  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(["address_component"]);
​
  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener("place_changed", fillInAddress);
}
​
function fillInAddress() {
  console.log("fillInAddress started");
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();
​
  for (var component in componentForm) {
    document.getElementById(component).value = "";
    document.getElementById(component).disabled = false;
  }
​
  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    console.log("filling out form");
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}
​
function showPanel(placeResult) {
  // If infoPane is already open, close it
  if (infoPane.classList.contains("open")) {
    infoPane.classList.remove("open");
  }
  // Clear the previous details
  while (infoPane.lastChild) {
    infoPane.removeChild(infoPane.lastChild);
  }
  if (placeResult.photos) {
    let firstPhoto = placeResult.photos[0];
    let photo = document.createElement("img");
    photo.classList.add("hero");
    photo.src = firstPhoto.getUrl();
    infoPane.appendChild(photo);
  }
  // Add place details with text
  let name = document.createElement("h1");
  name.classList.add("place");
  name.textContent = placeResult.name;
  infoPane.appendChild(name);
  if (placeResult.rating) {
    let rating = document.createElement("p");
    rating.classList.add("details");
    rating.textContent = `Rating: ${placeResult.rating} \u272e`;
    infoPane.appendChild(rating);
  }
  let address = document.createElement("p");
  address.classList.add("details");
  address.textContent = placeResult.formatted_address;
  infoPane.appendChild(address);
  if (placeResult.website) {
    let websitePara = document.createElement("p");
    let websiteLink = document.createElement("a");
    let websiteUrl = document.createTextNode(placeResult.website);
    websiteLink.appendChild(websiteUrl);
    websiteLink.title = placeResult.website;
    websiteLink.href = placeResult.website;
    websitePara.appendChild(websiteLink);
    infoPane.appendChild(websitePara);
  }
  // Open the infoPane
  infoPane.classList.add("open");
}
​
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  console.log("geolocate found");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      // autocomplete.setBounds(circle.getBounds());
    });
  }
}
​
​
​
function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}
​
initMap();
// initAutocomplete();
geolocate();