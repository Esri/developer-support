# Add a CSV File to the Map as a FeatureLayer
-------------------------------------------------------------------------------------

## About
There are many geographic datasets floating around on the web in CSV format. The Esri JavaScript API provides the CSVLayer class which allows CSV files to be consumed and displayed in web applications. However there are some limitations with CSVLayers. For example, the TimeSlider dijit only works with FeatureLayers and ArcGISDynamicMapServiceLayers. Luckily the FeatureLayer class has a constructor that accepts a FeatureCollection object instead of a url to a MapService. This sample shows how to send a request to a CSV file, parse this file into a FeatureCollection and instantiate a FeatureLayer from the FeatureCollection. As a bonus, this sample then shows how to configure the TimeSlider dijit to work with this FeatureLayer.

[Live Sample](https://nhaney90.github.io/add-csv-file-as-featurelayer/index.html)

## How it works
This sample is not able to  determine which fields in the CSV are used for lat long values or dates. This information must be specified before the application tries to parse the CSV.

```javascript
const latitudeField = "latitude";
const longitudeField = "longitude";
const dateFields = ["time","updated"];
const startTimeField = "time";
const endTimeField = "";
```

Using esriRequest, send a GET request to retrieve the CSV file. Note the "handleAs" parameter must be set as "text". The results are then passed to the parseFile method.

```javascript
esriRequest({
	url: url,
	content: {},
	handleAs: "text"
},{
	usePost: false
}).then((results) => {
	parseFile(results);
});
```
This is the meat of the sample. Parsing the file into a FeatureCollection requires, creating a list of all fields, determining the type of each field, creating a point from each lat long pair and creating an attribute object from each row of field values. Furthermore a FeatureLayer requires an objectId field. Because CSV files typically do not have a unique identifier field we must create our own. First the file (which is currently one huge block of text) needs to be split into rows based on the new line character.

```javascript
let fields = [];
let features = [];
let fileLines = results.split(/\r?\n/);

fields.push({
	name: "OBJECTID",
	type: "esriFieldTypeOID",
	alias: "OID"						
});
```
Now we must loop through each row and split the row into individual values based on commas. Spliting the row is not as simple as it sounds because a value may contain commas within double quotes. Regex is your friend in this situation. The first row contains all of the file's field names. These need to be added to the array of fields that will be used to create the FeatureCollection. The indexes of the latitude, longitude and datefields also need to be identified:

```javascript
for(line in fileLines) {
	let splitLine = fileLines[line].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
	splitLine = splitLine || [];
	//3 is an arbitrary number. Just making sure nothing went wrong when the row was split.
	if(splitLine.length >= 3) {
		if(line == 0) {
			for(item in splitLine) {
				fields.push({
					name: splitLine[item],
					alias: splitLine[item]
				});
				if(dateFields.indexOf(splitLine[item]) > -1) timeFieldIndexes.push(item);
				else if(splitLine[item] == latitudeField) latitudeIndex = item;
				else if(splitLine[item] == longitudeField) longitudeIndex = item;
			}
		}
```

After the first row is parsed, the values of the second row must be tested to determine the field type. Because the resulting FeatureLayer will be time enabled we also must calculate the time extent.

```javascript
for(item in splitLine) {
	let type = null;
	if(timeFieldIndexes.indexOf(item) > -1) {
		type = "esriFieldTypeDate";
		splitLine[item] = Date.parse(splitLine[item]);
		if(startTime && endTime) {
			if(startTime > splitLine[item]) startTime = splitLine[item];
			if(endTime < splitLine[item]) endTime = splitLine[item];
		}
		else {
			startTime = splitLine[item];
			endTime = splitLine[item];
		}
	}
	else if(item == latitudeIndex) {
		latitude = parseFloat(splitLine[item]);
		type = "esriFieldTypeString";
	}
	else if(item == longitudeIndex) {
		longitude = parseFloat(splitLine[item]);
		type = "esriFieldTypeString";
	}
	else if(!isNaN(splitLine[item])) {
		type = "esriFieldTypeDouble";
		splitLine[item] = parseFloat(splitLine[item]);
	}
	else if(splitLine[item].toLowerCase() == "true") {
		type = "esriFieldTypeBoolean";
		splitLine[item] = true;
	}
	else if(splitLine[item].toLowerCase() == "false") {
		type = "esriFieldTypeBoolean";
		splitLine[item] = false;
	}
	else {
		type = "esriFieldTypeString";
	}
	if(line == 1) fields[parseInt(item) + 1].type = type;
```

Now that the fields have been parsed and features have been created from each row, we are now able to create the FeatureCollection object. A FeatureLayer can then be created from the FeatureCollection. Finally the time extent of the map needs to be set.

```javascript
let featureSet = {
	objectIdFieldName: "OBJECTID",
	displayFieldName: dateFields[0],
	fieldAliases: null,
	geometryType: "esriGeometryPoint",
	spatialReference: {wkid:4326,latestWkid:4326},
	features: features
}
let layerDefinition = {
	geometryType: "esriGeometryPoint",
	fields: fields,
	timeInfo: {
		startTimeField: startTimeField,
		endTimeField: endTimeField,
		trackIdField: "",
		timeExtent: [
			new Date(startTime),
			new Date(endTime)
		],
	timeReference: timeReference,
	timeInterval: 0,
	exportOptions: {
		useTime: false,
		timeDataCumulative: false,
		timeOffset: 0,
		timeOffsetUnits: "esriTimeUnitsCenturies"
	},
	hasLiveData: false
	}
}
let timeExtent = new TimeExtent(new Date(startTime), new Date(endTime));
let featureCollection = {layerDefinition: layerDefinition, featureSet: featureSet};
****
let fLayer = new FeatureLayer(featureCollection, {
	infoTemplate: new InfoTemplate("${type}", "${*}")
});
****
map.setTimeExtent(timeExtent);
```