# Leaflet.DriveTime (work in progress)
A quick and simple plugin for generating drive time polygons using Mapbox Directions API. Click on the map on a location that you want to
use as the origin, pass in the drive time in minutes and this plugin will give you a polygon GeoJSON that encapsulates the area that can
be reached from the selected origin within the drive time. You can either add the GeoJSON directly to a Leaflet map using a featureLayer or 
convert it into an L.polygon and then add it to the featureGroup that the Leaflet.Draw plugin uses to draw shapes on map.

### External Dependencies
The Leaflet.DriveTime.js plugin depends on turf.js (https://api.mapbox.com/mapbox.js/plugins/turf/v2.0.2/turf.min.js) and underscore.js (http://underscorejs.org/underscore-min.js)

This plugin was built against v2.4 of the Mapbox API which uses v0.7 of the Leaflet library so that's the minimum version of Leaflet map you would need.

### How to include the plugin?

Include reference to the following dependencies first:

1. `turf.js` (v2.0.2 minimum) from https://api.mapbox.com/mapbox.js/plugins/turf/v2.0.2/turf.min.js
2. `underscore-min.js` from http://underscorejs.org/underscore-min.js
3. Mapbox JS API (if you are using Mapbox map, this will also automatically load the right version of leaflet.js)

    `<script src='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.js'></script>`
    `<link href='https://api.mapbox.com/mapbox.js/v2.4.0/mapbox.css' rel='stylesheet' />`
4. Leaflet.js (if you are using Leaflet.js alone with third party tile layers).

Then add reference to the `Leaflet.DriveTime.js` (no CDN for now, apologies for that! so please bear with me and just download the source file onto your machine and add reference from there. I will sort out the CDN in the coming weeks.)

### Usage
The plugin exposes a `DriveTime` object and the `GetDriveTimePolygon` function takes the origin lat/long, drive time in minutes, Mapbox API access token as input parameters and a callback that should be run when the polygon is ready, as shown below:

`DriveTime.GetDriveTimePolygon(eventInvoker.latlng, driveTimeInMinutes, mapboxAccessToken, function (driveTimePolygonGeoJSON) 
{`                
    `L.mapbox.featureLayer().setGeoJSON(driveTimePolygonGeoJSON).addTo(mapBoxMap);                    `                
`});`

You are going to need the Mapbox API access token to access their RESTful Directions API.

In this example, I have clicked on the Mapbox map (which uses Leaflet map internally) to establish the origin point and read the drive time input from a text field on the page like so:

`$(document).ready(function () {`
        `L.mapbox.accessToken = 'Your own API key';`
        `mapBoxMap = L.mapbox.map('map', 'mapbox.streets', { preferCanvas: true });`
        `mapBoxMap.on('click', function (eventInvoker) {`
            `var driveTimeInMinutes = parseInt($("#driveTime").val());`

            `if (driveTimeInMinutes > 0) {`
                `DriveTime.GetDriveTimePolygon(eventInvoker.latlng, driveTimeInMinutes, L.mapbox.accessToken, function (driveTimePolygonGeoJSON) {`
                    `L.mapbox.featureLayer().setGeoJSON(driveTimePolygonGeoJSON).addTo(mapBoxMap);`
                `});`
            `}`
        `});`
    `});`
`<input id="driveTime" type="text" style="margin-top:8px" placeholder="Drive Time in minutes..." />`
`<div id="map" style="height:100%; position: relative;"></div>`

### Browser compatibility
Tested in Chrome 55, IE 11 (minimum IE10), Firefox 48 successfully.
