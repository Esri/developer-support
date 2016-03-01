#Set Map Center and Zoom with URL Parameters

##About
ArcGIS Online allows a user to specify the zoom level and where to center the map as url parameters. This sample shows how to implement similar functionality in your standalone JavaScript application. Following this workflow you could specify almost any parameter in the url.

[Live Sample](https://nhaney90.github.io/url-center-and-zoom/index.html?center=-86,33&zoom=8)

##Usage Notes

The order of the center and zoom properties does not matter. URLs can be specified like this:

https://nhaney90.github.io/url-center-and-zoom/index.html?center=-86,33&zoom=8

Or like this:

https://nhaney90.github.io/url-center-and-zoom/index.html?zoom=8&center=-86,33

However the two parameters must be seperated by "&". In the center property the longitude must come first and must be seperated from the latitude by a comma. It is not necessary to include both parameters as requests like this:

https://nhaney90.github.io/url-center-and-zoom/index.html?zoom=8

Or like this:

https://nhaney90.github.io/url-center-and-zoom/index.html?center=-86,33

Work without issue.

##How it works:
The following snippets highlight the important portions of the code.

Pass the name of the parameter to the getParameterByName function. Remove any escape characters from the name. Create a new regular expression and use this expression to search the url's query string (location.search is the query string). If the search returns a value decode the URI component and return the value.
```javascript
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
	results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}
```
If the center parameter has a value split the coordinates on the "," character and parse each coordinate into a float. If both coordinates are latitude and longitude values center the map at that location.
```javascript
if(center) {
	var coords = center.split(",");
	var lon = parseFloat(coords[0]);
	var lat = parseFloat(coords[1]);
	if(isNaN(lon) == false && isNaN(lat) == false && lon <= 180 && lon >= -180 && lat <= 90 && lat >= -90) {
		map.centerAt([lon, lat]);
	}
}
```
If the zoom parameter has a value parse it's value into an integer. If the zoom value is valid set the zoom of the map to that value.
```javascript
if(zoom) {
	zoom = parseInt(zoom);
	if(isNaN(zoom) == false && zoom <= 19 && zoom >= 0) {
		map.setZoom(zoom);
	}
}
```
