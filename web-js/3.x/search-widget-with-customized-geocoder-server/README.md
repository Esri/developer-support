# Search Widget with custom geocoding service by using ArcGIS API for JavaScript

This is a sample that shows how to use Search Widget (esri/dijit/Search) to perform search on a custom geocoding service since geocoder widget is going to be deprecated in the future release.

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)
[Search](https://developers.arcgis.com/javascript/jsapi/search-amd.html)

## Pay Attention when using Search Widget on GeocodeServer
If you want to have auto suggestions when input an address for search widget to automatically return close result, there are two requirements need to follow:

1. GeocodeServer must published from ArcGIS Server 10.3 or later version

2. The server must enabled "Suggest" capability, see the below screenshot

![Alt text](https://cloud.githubusercontent.com/assets/5265346/8464836/1abf11aa-1ffa-11e5-82d1-74180a21e51b.JPG "Enable "Suggest" capability")

## Extended based on the sample GeocodeServer is
published from ArcGIS Server 10.3 or later and must enabled "Suggest"
capability
Search with customization
https://developers.arcgis.com/javascript/jssamples/search_customized.html

## Features

* Shows how to use search widget to connect with custom geocoding service
* Contains code showing how to combine search widget with locator to perform the search query on geocoding service

NOTE: Feel free to update to this repo!

**EXPLICIT: The demo server within this sample is not intended for use for anything other than testing!**

[Live Sample](http://esri.github.io/developer-support/web-js/search-widget-with-customized-geocoder-server/searchGeocodeServer.html)
