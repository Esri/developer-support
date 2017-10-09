# ArcGIS API for JavaScript Center Zoom Helper

This is a sample app that displays the current basemap, zoom level and centerpoint (in WGS84) for ease of copy/paste into your own map constructor within your application.

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)

[webMercatorToGeographic()](https://developers.arcgis.com/javascript/jsapi/esri.geometry.webmercatorutils-amd.html#webmercatortogeographic)

## Features

* written in AMD
* A red cursor is drawn at the current map center each time the extent changes or someone clicks on the map
* The clientside utility webMercatorUtils.webMercatorToGeographic() is used to convert the web mercator mapPoint to the WGS84 coordinates which can be conveniently inserted in the map constructor.
* uses version 3.8 of the JS API, but should be able to be upgraded conveniently.

NOTE: Feel free to contribute new templates to this repo!

[Live Sample](http://esri.github.io/developer-support/web-js/center-zoom-helper/index.html)
