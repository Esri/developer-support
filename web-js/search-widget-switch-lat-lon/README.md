# About

Modified [Search basic](https://developers.arcgis.com/javascript/jssamples/search_basic.html) sample to find a location on map by providing <b> <u> lat, lon</u></b> value instead of <b> <u> lon, lat</u></b> value.  

## Issue Description

 The [sample](https://developers.arcgis.com/javascript/jssamples/search_basic.html) uses [Search widget](https://developers.arcgis.com/javascript/jsapi/search-amd.html) to find the location on map, given the <b> <u> lon, lat</u></b> value. The order of <b> <u> lon, lat</u></b> cannot be interchanged. As we can see in the [REST API documentation of World Geocoding Service](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm#ESRI_SECTION1_CF39B0C8FC2547C3A52156F509C555FC), <i>"The only valid input format for coordinate searches is text=x-coordinate, y-coordinate, where the spatial reference of the coordinates is WGS84."</i> How can we find location on a map by providing <b> <u> lat, lon</u></b> value instead of <b> <u> lon, lat</u></b> value in the Search widget?

## Solution

* We can define a callback function that will be called just before esri.request calls. Here's the [API reference](https://developers.arcgis.com/javascript/jsapi/esri.request-amd.html#esrirequest.setrequestprecallback).
* All the network traffic from the application will go through the callback function. Here, we can filter specific request, modify the request parameters, and return it.

[Live Preview](http://gdhakal.github.io/search-widget-switch-lat-lon/index.html)

* Input 36.114789,-115.172783 in Search box.
* We get the correct result even though the order of the input is <b> <u> lat, lon </u> </b> instead of <b> <u> lon, lat </u> </b>.
