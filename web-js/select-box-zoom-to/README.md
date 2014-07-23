#ArcGIS API for JavaScript Zoom to Feature via Dropdown

This is a sample app that displays the current basemap, zoom level and centerpoint (in WGS84) for ease of copy/paste into your own map constructor within your application.

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)

[zoomRate|zoomDuration](https://developers.arcgis.com/javascript/jshelp/inside_defaults.html)



## Features

* written in AMD
* A red cursor is drawn at the current map center each time the extent changes or someone clicks on the map
* The clientside utility webMercatorUtils.webMercatorToGeographic() is used to convert the web mercator mapPoint to the WGS84 coordinates which can be conveniently inserted in the map constructor.
* uses version 3.8 of the JS API, but should be able to be upgraded conveniently. 

NOTE: Feel free to contribute new templates to this repo!
