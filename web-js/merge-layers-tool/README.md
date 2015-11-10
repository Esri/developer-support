#Use the Merge Layers spatial analysis service.

##About
There are currently no official samples showing how to use the Merge Layers analysis service. This very simple sample was written to remedy that.

##Usage notes
When using this sample you will need to sign in using your ArcGIS Online credentials. If you are using Portal instead of ArcGIS Online you will need to change the Portal URL in the MergeLayers constructor to your Portal URL. Remember this service CONSUMES CREDITS just like the other spatial analysis services. This sample creates a feature service within your ArcGIS Online or Portal account. The MergeLayers tool can also be configured to return a feature collection instead of creating a feature service. More information about the MergeLayers service [can be found here](https://developers.arcgis.com/rest/analysis/api-reference/merge-layers.htm).

##How it works:
The following code snippet shows how the MergeLayers widget is used in the sample:
```javascript
var mergeLayersTool = new MergeLayers({
	inputLayer: inputLayer,
	mergeLayers: [mergeLayer],
	map: map,
	outputLayerName: "MyTestLayer",
	portalUrl: "http://www.arcgis.com",
	showHelp: true,
	showSelectFolder: true
}, "merge");
mergeLayersTool.startup();
			 
mergeLayersTool.on("job-result", function(result) {
	map.removeLayer(inputLayer);
	map.removeLayer(mergeLayer);
	map.addLayer(new FeatureLayer(result.value.url));
});
```