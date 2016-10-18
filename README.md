# Leaflet.DriveTime
A quick and simple plugin for generating drive time polygons using Mapbox Directions API. Click on the map on a location that you want to
use as the origin, pass in the drive time in minutes and this plugin will give you a polygon GeoJSON that encapsulates the area that can
be reached from the selected origin within the drive time. You can either add the GeoJSON directly to a Leaflet map using a featureLayer or 
convert it into an L.polygon and then add it to the featureGroup that the Leaflet.Draw plugin uses to draw shapes on map.
