# Find Distance Along A Line
-------------------------------------------------------------------------------------

## About
This sample allows the user to enter a distance and a linear unit and then find the location that distance from the beginning of the line. I have seen multiple users ask how this can be done. For example, let's suppose you are mapping traffic accidents. Your crash data records the crash location as a certain number of miles from an intersection. How can you quickly determine the absolute location of the crash? Using the approach outlined by this sample it is quite simple!

[Live Sample](https://nhaney90.github.io/find-distance-along-line/index.html)

## How it works
Loop through the line segments to check if the length of the previous line segments added to the length of the current line segement is greater than the distance the user has entered. If the length is less, add the length of the current line segment to the length of the previous line segments and keep looping. Otherwise pass the current and previous line segments to the calculatePointLocation function.

```javascript
let runningTotal = 0;
for(var i = 0; i < geometry.paths[0].length - 1; i++) {
	let polylineJSON = {"paths":[[geometry.paths[0][i],geometry.paths[0][i +1]]],"spatialReference":{"wkid":102100}};
	let polyline = new Polyline(polylineJSON);
	let length = geometryEngine.planarLength(polyline, unit);
	if(runningTotal + length < distance) runningTotal += length;
	else {
		i = geometry.paths[0].length;
		calculatePointLocation(polyline.paths[0][0],polyline.paths[0][1], (distance-runningTotal), unit);
```

Create a polyline from the two points. Add the length of this polyline to the length of the previous line segements. If this length is within a tolerance (3 feet) of the distance the user has specified a point is added to the map at that location. Otherwise a new polyline half the length of the first is calculated and the function calls itself to repeat the process.

```javascript
function calculatePointLocation(point1, point2, distance, unit) {
	let polylineJSON = {"paths":[[point1,point2]],"spatialReference":{"wkid":102100}};
	let polyline = new Polyline(polylineJSON);
	let length = geometryEngine.planarLength(polyline, unit);
	if(length < (distance + 3)) {
		let point = new Point(point2, map.spatialReference);
		addPointToMap(point);
	}
	else {
		let point = calculateMidPoint(point1, point2);
		calculatePointLocation(point1, point, distance);
	}
```
This is a simple method to return the midpoint of the line segment which will be used to "half" the segement.

```javascript
function calculateMidPoint(point1, point2) {
	let x = ((point1[0] + point2[0])/2);
	let y = ((point1[1] + point2[1])/2);
	return [x, y];
```
