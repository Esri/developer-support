#Change Open Street Map Servers

##About
Esri's default basemaps include an Open Street Map basemap. However this basemap is only one of many different Open Street Map basemaps that are available. Quite frankly most of these basemaps look awesome and are definately worth exploring! You can access these basemaps by adding an OpenStreetMapLayer to your application and setting the tileServer's property to the servers that provide the basemap you want. You can [read about the different Open Street Map servers here](http://wiki.openstreetmap.org/wiki/Tile_servers). In this sample I have aggregated most of the Open Street Maps and allow you to explore the different options.

[Live Sample](http://nhaney90.github.io/change-osm-servers/index.html)

##Usage notes
While Open Street Map basemaps are free and publically available some do have specific attribution and use requirements. Please research the requirement for each basemap before including it in your project. This application uses so many basemaps that the server information was cluttering the code. I moved this information to a seperate JSON file which I query and then use to populate the different basemap options.

##How it works:
The following snippets highlight the important portions of the code.

Make a get request to retrieve the server information. Use the first basemap in the response as the default basemap in the application.
```javascript
$.get("https://nhaney90.github.io/change-osm-servers/OSMSERVER.json").done(function(data) {
	osmData = data.servers;
	addOSMData(Object.keys(osmData)[0]);
	populateDropdown();
});
```
Loop through the properties in the response object and create an option in the dropdown for each basemap
```javascript
for(var server in osmData) {
	if(osmData.hasOwnProperty(server)) {
		$("#basemapSelect").append("<option>" + server + "</option>");
	}
}
```
Check to see if the map already has a basemap. If it does remove it. Instatiate a new OpenStreetMapLayer and set it's tileServers property to the servers of the currently selected basemap. Finally add the layer to the map.
```javascript
if(openStreetMapLayer) {
	map.removeLayer(openStreetMapLayer);
	openStreetMapLayer = null;
}
openStreetMapLayer = new OpenStreetMapLayer({
	tileServers: osmData[value]
});
map.addLayer(openStreetMapLayer);
```
