# Leaflet.DriveTime (work in progress)
A quick and simple plugin for generating drive time polygons using Mapbox Directions API. Click on the map on a location that you want to
use as the origin, pass in the drive time in minutes and this plugin will give you a polygon GeoJSON that encapsulates the area that can
be reached from the selected origin within the drive time. You can either add the GeoJSON directly to a Leaflet map using a featureLayer or 
convert it into an L.polygon and then add it to the featureGroup that the Leaflet.Draw plugin uses to draw shapes on map.

The Leaflet.DriveTime.js plugin depends on turf.js (https://api.mapbox.com/mapbox.js/plugins/turf/v2.0.2/turf.min.js) and underscore.js (http://underscorejs.org/underscore-min.js)

### Usage
Add reference to the `turf.js` and `underscore-min.js` script files from the above CDNs in your page.

Then add reference to the `Leaflet.DriveTime.js` (no CDN for now, apologies for that! so please bear with me and just download the source file onto your machine and add reference from there. I will sort out the CDN in the coming weeks.)

The plugin exposes a `DriveTime` object that can be used as shown below:

`DriveTime.GetDriveTimePolygon(eventInvoker.latlng, driveTimeInMinutes, function (driveTimePolygonGeoJSON) 
{`                
    `L.mapbox.featureLayer().setGeoJSON(driveTimePolygonGeoJSON).addTo(mapBoxMap);                    `                
`});`

For e.g. I can click on a Mapbox map (which uses Leaflet map internally) to establish the origin point and read the drive time input from a text field on the page like so:

`$(document).ready(function () {`
        `L.mapbox.accessToken = 'Your own API key';`
        `mapBoxMap = L.mapbox.map('map', 'mapbox.streets', { preferCanvas: true });`

        `mapBoxMap.on('click', function (eventInvoker) {`
            `var driveTimeInMinutes = parseInt($("#driveTime").val());`

            `if (driveTimeInMinutes > 0) {                `
                `DriveTime.GetDriveTimePolygon(eventInvoker.latlng, driveTimeInMinutes, function (driveTimePolygonGeoJSON) {`
                    `L.mapbox.featureLayer().setGeoJSON(driveTimePolygonGeoJSON).addTo(mapBoxMap);                    `
                `});`
            `}`
        `});`
    `});`

`<input id="driveTime" type="text" style="margin-top:8px" placeholder="Drive Time in minutes..." />`
`<div id="map" style="height:100%; position: relative;"></div>`
