# Leaflet.DriveTime (work in progress)
### NB:  Please use the Leaflet.DriveTime folder if you want to see a reference usage of the module. I still need to figure out how to delete the Leaflet.DriveTime2 folder from Github.

A simple JavaScript module for generating drive time polygons using Mapbox Directions API. Checkout the demo <a href="http://drivetimedemo.us-west-2.elasticbeanstalk.com/">here</a>. Just click on the map anywhere!

Click on the map on a location that you want to use as the origin, pass in the drive time in minutes and this module will give you a polygon GeoJSON that encapsulates the area that can be reached from the selected origin within the drive time. You can either add the GeoJSON directly to a Leaflet map using a featureLayer or convert it into an L.polygon and then add it to the featureGroup that the Leaflet.Draw plugin uses to draw shapes on map.

### External Dependencies
The Leaflet.DriveTime.js module depends on turf.js (https://api.mapbox.com/mapbox.js/plugins/turf/v2.0.2/turf.min.js) and underscore.js (http://underscorejs.org/underscore-min.js) and it loads these dynamically from their respective CDNs using Asynchronous Module Definition (AMD) using Require.js. So no need to add these dependencies manually.

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

`$(document).ready(function () {`
	`// This module uses Mapbox's Directions API to generate a drive time polygon so its going to need an accessToken which is easy to generate. You can` 
	`// simply create a free account and get a token from mapbox.com.`
	`var mapboxAccessToken = <set your own Mapbox access token>`
	`var LMap = L.map('map').setView([51.505, -0.09], 13);`      
    `L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(LMap);`
	
	`require(["../Src/Leaflet.DriveTime"], function (driveTime) {`
        `LMap.on('click', function (eventInvoker) {`
            `var driveTimeInMinutes = 5;`
        
            `if (driveTimeInMinutes > 0) {`
                `driveTime.GetDriveTimePolygon(eventInvoker.latlng, driveTimeInMinutes, mapboxAccessToken, function (driveTimePolygonGeoJSON) {`
                    `L.geoJSON(driveTimePolygonGeoJSON).addTo(LMap);`
                `});`
            `}`
        `});`
    `});`
`});`

`<div id="map" style="height:100%; position: relative;"></div>`

### Browser compatibility
Tested in Chrome 55, IE 11 (minimum IE10), Firefox 48 successfully.

### License
https://opensource.org/licenses/BSD-2-Clause
