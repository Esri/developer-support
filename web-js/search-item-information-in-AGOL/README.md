#Query Organization Item Information with JavaScript

##About
I wrote this sample as a way to quickly retrieve and analyze information about items hosted in ArcGIS Online. This application sends a REST request to the search endpoint of an ArcGIS Online organization. The results are returned and converted to a comma separated list. This list is then converted to a csv file and downloaded to the user's computer to facilitate analysis. A standalone Python or Ruby script might make more sense if you only want to return the item information. However if you want to integrate this functionality into a larger web based application then this workflow would be useful.

##How it works:
The following code snippets show how the application works:

Use esriRequest send a simple get request to the search REST endpoint of your organization
```javascript
esriRequest({
	url: "https://ess.maps.arcgis.com/sharing/rest/search",
	content: {
		q: "orgid:Wl7Y1m92PbjtJs5n",
		num: 100,
		start: 101,
		f: "json"
	},
	handleAs: "json",
	load: firstRequest,
	error: requestFailed
}, {usePost: false});
```
Select the fields you wish to return data from. Loop through the results and create a string of comma separated values. Adding a new line character to each row completes the formatting.
```javascript
var headers = ["id", "owner", "type", "created", "access", "title"];
var content = headers.toString() + "\n";
for(var i = 0; i < response.results.length; i++) {
	var row = "";
	for (property in headers) {
		row += response.results[i][headers[property]] + ",";
	}
	content += row.substring(0, row.length - 1) + "\n";
}
```
Set the content type to CSV and url encode the list of comma separated values. Create a hyperlink with the url encoded string as the url. Fire the click event of the hyperlink to download the file.
```javascript
var csvContent = "data:text/csv;charset=utf-8,";
csvContent += content;
var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", filename);
link.click();
```
