# Change the basemap of a web map

Demonstrates how we can use switchBaseMapOnMapView method of AGSWebMap class in order to change the basemap of a web map. 

In AGSWebMap class, switchBaseMapOnMapView method takes AGSWebMapBaseMap object as a single parameter. AGSWebMapBaseMap is a class that represents the basemap layer(s) of a webmap. You can create an instance of AGSWebMapBaseMap class by using initWithJSON method. When you pass AGSWebMapBaseMap object (new basemap for the webmap) as an argument in switchBaseMapOnMapView and call the method, you will be able to switch the basemap of your webmap. The AGSWebmap class adheres to AGSWebmapDelegate protocol. You can implement appropriate methods of AGSWebmapDelegate in order to respond to events such as failure to load layers.

# User interaction

User clicks "Change Basemap" button to change the basemap of the webmap.

In the storyboard:
- Add a map view.
- Add a button to change the basemap of the webmap.

# Resources

[Setting up XCode](https://developers.arcgis.com/ios/guide/install.htm)

[Add a map to your app](https://developers.arcgis.com/ios/guide/adding-a-map.htm)

[Creating the webmap](https://developers.arcgis.com/ios/guide/viewing-web-map.htm)

[Creating the webmap (Sample code)](https://github.com/Esri/arcgis-runtime-samples-ios/tree/master/WebmapSample)

[Web map format](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r30000004n000000)

[Working with JSON](https://developers.arcgis.com/ios/guide/working-with-json.htm)