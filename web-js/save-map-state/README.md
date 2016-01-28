#Save Map State Using LocalStorage

##About
This sample shows how to use LocalStorage to store the current state of the map. This is useful if you need to redirect the user from the mapping application to another webpage and then back to the mapping application and you wish to have the application have the same "look" as before. This application saves the extent of the map, the currently selected feature and launches the selected popup.

![This is where an GIF should be. Sorry you can't see it. Try using Chrome](SaveMapState.gif "Application Demo")

##Usage Notes
While this sample only stores the currently selected features and the map extent you could store any information about the map. However data is stored as a string in LocalStorage. Thus any JSON objects will need to be converted to strings. For this I would suggest using JSON.stringify(). A downside of converting JSON to strings is that you will not be able to store ArcGIS JavaScript API objects directly as they will lose all associated methods. This is why you cannot simply store the "map" object to save the map state.


##How It Works
Create an object to store the information that will be placed in LocalStorage.
```javascript
var storageData = {};
```

When a feature is shown in the InfoWindow save the id of that feature in storageData object.
```javascript
map.infoWindow.on("selection-change", function(evt) {
	if(evt.target.selectedIndex > -1) {
		storageData.features = "FID=" + evt.target.features[evt.target.selectedIndex].attributes.FID;
	}
});
```

When the map unload event is fired store the current extent of the map. Convert the storage object to a string and set the _MapData key's value to this string.
```javascript
map.on("unload", function(evt) {
	storageData.extent = {"xmin":map.extent.xmin, "ymin":map.extent.ymin, "xmax":map.extent.xmax, "ymax":map.extent.ymax};
	localStorage.setItem('_MapData', JSON.stringify(storageData));
});
```

After all layers are added to the map retrieve the _MapData item from LocalStorage. If that entry is not null parse the string into JSON.
```javascript
map.on("layers-add-result", function() {
	var storedInformation = localStorage.getItem('_MapData');
	if(storedInformation) {
		var temp = JSON.parse(storedInformation);
```

Call the selectFeatures function of the feature layer to select features corresponding to the FID retrieved from LocalStorage. Set the infoWindow's features property to the selected features. Show the popup window centered on the selected feature.
```javascript
query.where = temp.features;
placesLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(results) {
	setTimeout(function() {
		map.infoWindow.setFeatures(placesLayer.getSelectedFeatures());
		var point = screenUtils.toScreenPoint(extent, map.width, map.height, new Point(map.infoWindow.features[0].geometry.x, map.infoWindow.features[0].geometry.y, map.spatialReference));
		map.infoWindow.show(point);
	}, 500);
});
```
