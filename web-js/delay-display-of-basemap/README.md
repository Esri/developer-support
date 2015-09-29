#Delay the Display of the Basemap Until All Tiles Are Loaded
[Live Sample](http://esri.github.io/developer-support/web-js/delay-display-of-basemap/index.html)
##About
The default behavior of the basemap is for tiles to appear on the screen one at a time as requests for individual tiles are sent to the server and responses are received. This can (especially in high latency environments) create a situation where tiles are loaded in a piece mail fashion showing a "checker board" of tiles momentarily. To combat this behavior you can hide the basemap until all tiles are loaded. Thus everytime the map is panned the basemap will be hidden until the new set of tiles has been populated. This sample demonstrates one way to do this.
##The Logic
When each layer is loaded into the map add an on load event to the layer.
```javascript
/Wait for the map to load
map.on("load", function(evt){
	//then add a layer add event to the map
	map.on("layer-add", function(evt){
		//look through the keys in the map layer's object
		for(var key in map._layers) {
			//if the key is equals the layer that has just loaded
			if(key == evt.layer.id) {
				//add a load event to the layer and pass the key name to the event handler
				map._layers[key].on("load", checkLayerType(key));
			}
		}
	});
});

```
Check to see if the layer is a tiled layer
```javascript
//Check the layer type of the layer that has loaded
function checkLayerType(layer) {
	//if the layer object has a tileIds property we know it is a tiled layer
	if(map._layers[layer]._tileIds) {
		//call the toggle basemap function
		toggleBasemap(layer);
	}
}
```
When the tiled layer begins to request new tiles, hide the div containing the layer. When the requests for new tiles have ended, show the div containing the layer.
```javascript
//Delay the visibility of the tiles until all have loaded
function toggleBasemap(basemap) {
	//When the layer starts to update it's tiles
	map._layers[basemap].on("update-start", function() {
		//Hide the div that contains the basemap
		document.getElementById("map_" + basemap).style.display = "none";
	});
	//When the layer has finished updating it's tiles
	map._layers[basemap].on("update-end", function(){
		//Show the div that contains the basemap
		document.getElementById("map_" + basemap).style.display = "block";
	});	
}
```