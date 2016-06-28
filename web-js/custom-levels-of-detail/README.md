#Display Custom Zoom Levels with Esri Basemaps

##About
The ArcGIS Javascript API comes with preset zoom levels. However some customers encounter a situation where the map must be displayed at certain preset zoom levels or that the preset zoom levels are inadequate to display their data. When using an ArcGISDynamicMapServiceLayer as the basemap these zoom levels can be customized. When using an tiled layer as the basemap these zoom levels are determined by the levels at which tiles have been cached. Thus you cannot customize zoom levels when using a tiled basemap because no tiles will be available at that scale. In this case it is recommended you either create your own basemap with a custom tiling scheme or use an ArcGISDynamicMapServiceLayer in your application. Both of these approaches have drawbacks. Creating your own basemap can be very time consuming, require large amounts of storage space and much trial and error to create the custom theme. Using an ArcGISDynamicMapServiceLayer hurts the performance of the application. This application tries to combine the strengths of both tiled layers and dynamic layers to allow users to specify custom zoom levels at larger scales. This sample uses two basemaps, one tiled and one dynamic. The dynamic basemap displays at the custom zoom levels while the tiled layer displays at all other levels.

[Live Sample](https://nhaney90.github.io/custom-levels-of-detail/index.html)

##How It Works
Specify the custom zoom levels you would like to use in the application. A level of detail must include the zoom level, the scale to display at and the resolution. However in this application since the tiled basemap is not shown at these zoom levels the resolution parameter is not used. A variable is also needed to hold the zoom level at which the custom zoom levels begin to be used.
```javascript
var customLODS = [
	{"level":17, "scale":4000, "resolution":1.19},
	{"level":18, "scale":2000, "resolution":0.59},
	{"level":19, "scale":1000, "resolution":0.29},
	{"level":20, "scale":500, "resolution":0.14},
	{"level":21, "scale":250, "resolution":0.07}
]
var customZoomLevelStart = 4000;
```
After the tiled basemap has loaded, access the lods associated with that layer and make a copy of the lods you would like to include in your custom lods list. Append the custom lods defined above to this list. Now set the tileInfo property of the tiled layer to these lods. This "ticks" the layer into using the custom levels of detail. Note that tiles will not display at these zoom levels but this does not matter as this layer will be hidden when zoomed in beyond 1:4000.
```javascript
satTiled.on("load", function() {
	var temp = satTiled.tileInfo.lods.slice(10, 17);
	customLODS = temp.concat(customLODS);
	satTiled.tileInfo.lods = customLODS;
	createMap();
});
```
Create the map object and set the lods parameter to the custom set of lods.
```javascript
map = new Map("map", {
	center: [-86, 33],
	lods : customLODS
});
```
Listen for the extent changed event. Check to see if the current scale is greater than the customZoomLevelStart variable declared above. Then check to see if the dynamic basemap is visible. If it is show the dynamic layer and hide the tiled layer.
```javascript
if(evt.lod.scale > customZoomLevelStart) {
	if(satDynamic.visible == true) {
		satDynamic.hide();
		satTiled.show();
	}
}
else {
	if(satDynamic.visible == false) {
		satDynamic.show();
		satTiled.hide();
	} 
}
```