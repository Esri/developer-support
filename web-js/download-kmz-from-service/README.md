# Download KMZ From A MapService
-------------------------------------------------------------------------------------

## About
This sample shows how to query a MapService and return the result as a KMZ that is downloaded to the client. This KMZ can then be used within other applications.

[Live Sample](https://nhaney90.github.io/download-kmz-from-service/index.html)

## How it works
This application allows users to click the map to select the state whose boundary they wish to download as a KMZ. Using map click location the FeatureLayer is then queries to determine which state the user selected. The user is then asked to confirm the selected the correct state. A timeout of 500 milliseconds is set to allow the feature's selection symbol to be set before the confirmation popup appears.

```javascript
let query = new Query();
	query.geometry = point;
	query.outFields = ["*"];
	statesLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW, (result) => {
		if(result.length > 0) {
			let message = "You have selected " + result[0].attributes.state_name + ". \n Is this the state you want to download?";
				setTimeout(() => {
				if(confirm(message) == true) {
					getKMZ(result[0].attributes.state_name);
```

The QueryTask that does not handle the kmz return type correctly so we will need to use esriRequest and manually handle the request instead. Because the request is returning a file the response needs to be handled as a blob. 

```javascript
let layersRequest = esriRequest({
	url: statesLayer.url + "/query",
	content: {
		where: "state_name='" + statename + "'",
		returnGeometry: true,
		f: "kmz"
	},
	handleAs: "blob",
	callbackParamName: "callback"
},{
```
To download the file we will need to create a hidden hyperlink element and add it to the dom. Then the blob is url encoded and set as the href of the hyperlink. Next the hyperlink is programmatically clicked to start the download. Finally the hyperlink is removed from the dom.

```javascript
function downloadFile(blob, fileName) {
	let link = document.createElement("a");
	document.body.appendChild(link);
	link.style = "display: none";
	url = window.URL.createObjectURL(blob);
	link.href = url;
	link.download = fileName;
	link.click();
	window.URL.revokeObjectURL(url);
	body.removeChild(link);
}
```
