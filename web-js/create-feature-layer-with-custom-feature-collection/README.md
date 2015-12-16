#Create Feature Layer Using Custom FeatureCollection

##About
There are many REST API's floating around the internet that return geographic data. Unfortunately relatively few of these return information in Esri's REST format. Most simply return lat long values. How to display this information and render it effectively using the Esri JavaScript API can be challenging. This application demonstrates how to do this. In this sample a request is sent to the SpotCrime API. The data returned is reorganized into a feature collection which is used to create a feature layer.

##How it works:
The following code snippets show how the code works:

Create the featureSet object. We will set the "features" property of the featureSet latter.
```javascript
var featureSet = {
	"objectIdFieldName":"OBJECTID",
	"displayFieldName":"Address",
	"fieldAliases": {
		"OBJECTID":"OBJECTID",
		"Address":"Address",
		"City":"City",
		"Date":"Date",
		"Type":"Type",
		"Description":"Description"
	},
	"geometryType":"esriGeometryPoint",
	"spatialReference":{
		"wkid":4326,
		"latestWkid":4326
	},
	"features": null
};
```
Using esriRequest send a Get request to the SpotCrime API to return the crime data. You must use a proxy to get around CORS issues.
```javascript
esriRequest({
	url: "http://spotcrime.com/feed/search.php",
    handleAs: "json",
	content: {
		searchQuery: "cdate=10/01/2015&cdate1=12/14/2015",
		ctype: 1,
		area_id: "al/mobile-county",
		_: apiKey
	},			
    load: resultsReturned,
    error: requestFailed
}, {
    usePost: false,
	useProxy: true
});
```
Loop through the results and create an attributes and geometry object for each record returned. Use these two object to create a feature object. Push this object to an array which will serve as the feature parameter of the featureSet.
```javascript
var features = [];
for(var i = 0; i < results.crimeList.length; i++) {
	var temp = results.crimeList[i];
	var attributes = {"OBJECTID":i, "Address":temp.caddress, "City":temp.ccity, "Date":temp.calc_date, "Type":temp.cname, "Description":temp.cdescription};
	var feature = {"geometry":{"x": temp.clongitude, "y": temp.clatitude}, "attributes":attributes};
	features.push(feature);
}
featureSet.features = features;
createFeatureLayer(featureSet);
```
Create a feature collection object using the featureSet object and the layerDefinition object. Pass this feature collection as the argument to the FeatureLayer constructor. Add a renderer and infoTemplate to the FeatureLayer to the map.
```javascript
var featureCollection = {layerDefinition: layerDefinition, featureSet: featureSet};
var featureLayer = new FeatureLayer(featureCollection);
featureLayer.setRenderer(renderer);
featureLayer.setInfoTemplate(infoTemplate);
map.addLayer(featureLayer);
```
