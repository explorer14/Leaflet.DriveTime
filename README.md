# Leaflet.DriveTime
A simple JavaScript module for generating drive time polygons using Mapbox Directions API. 

### Demo
Checkout the demo <a href="http://leafletdrivetimedemo.azurewebsites.net//">here</a>. Just click on the map anywhere! For demo purposes, the drive time requests default to 5 minutes only.

### Concept
This module will give you a polygon GeoJSON that roughly encapsulates the area that can be reached from the selected origin (i.e. clicking on the map at a location) within a certain amount of driving time in minutes. You can either add the resulting GeoJSON directly to a Leaflet map using a featureLayer or convert it into an L.polygon and then add it to the featureGroup that the Leaflet.Draw plugin uses to draw shapes on map. This could be quite a handy tool for making geo-fencing location queries where you want to identify the locations within a certain area. 

### External Dependencies
The Leaflet.DriveTime.js module depends on <a href="https://api.mapbox.com/mapbox.js/plugins/turf/v2.0.2/turf.min.js">turf.js</a> and <a href="http://underscorejs.org/underscore-min.js">underscore.js</a> and it loads these dynamically from their respective CDNs using Asynchronous Module Definition (AMD) using Require.js. So no need to add these dependencies manually.

This module was built against v2.4 of the Mapbox API which uses v0.7 of the Leaflet library so that's the minimum version of Leaflet map you would need.

### How to get a Leaflet map?
You can get a Leaflet map in one of the 2 following ways:

1. Use Mapbox JS API (if you are using Mapbox map, this will also automatically load the right version of leaflet.js)

    `<script src='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js'></script>`
    `<link href='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css' rel='stylesheet' />`

	OR

2. Use Leaflet.js directly with third party tile layers. The sample usage code shows both approaches.

### How to use/reference the module?
One of the ways I load Leaflet.DriveTime is using Require.js' require() function in my main page like so:
```
$(document).ready(function () {
	// This module uses Mapbox's Directions API to generate 
	// a drive time polygon so its going to need an accessToken which is easy to generate. 
	// You can simply create a free account and get a token from mapbox.com.
	var mapboxAccessToken = <set your own Mapbox access token>
	var LMap = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(LMap);
	
	require(["../Src/Leaflet.DriveTime"], function (driveTime) {
        LMap.on('click', function (eventInvoker) {
            var driveTimeInMinutes = 5;
        
            if (driveTimeInMinutes > 0) {
                driveTime.GetDriveTimePolygon(eventInvoker.latlng, driveTimeInMinutes, mapboxAccessToken, function (driveTimePolygonGeoJSON) {
                    L.geoJSON(driveTimePolygonGeoJSON).addTo(LMap);
                });
            }
        });
    });
});

<div id="map" style="height:100%; position: relative;"></div>
```

### Browser compatibility
Tested in Chrome 55, IE 11 (minimum IE10), Firefox 48 successfully.

### License
<a href="https://opensource.org/licenses/BSD-2-Clause">BSD 2 Clause</a>
