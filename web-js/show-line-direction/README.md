#Show Line Direction

##About
This sample shows a simple way to place an arrow on the end of a line showing the direction. The bearing of the line is calculated and can also be displayed as a text symbol.

[Live Sample](http://nhaney90.github.io/add-line-direction/index.html)

##Usage notes
This sample uses a feature layer as input. It is assumed in the sample the feature layer will have a spatial reference of 102100. However this workflow could mork with any spatial reference but I would suggest you convert the coordinates to lat long when calculating the bearing.

##How it works:
The following code snippets show how the code works:

Create an svg arrow symbol:
```javascript
var iconPath = "m90.50001,242.05447l102.18257,-82.07448l-102.18257,-82.07507l58.40251,-46.90492l160.59748,128.97999l-160.59748,129.02";
```
After adding a feature layer to the map, loop through it's graphics and pass pairs of points to the calculateBearing function
```javascript
function traverseGraphics(labelAll) {
	gLayer.clear();
	for(var i = 0; i < fLayer.graphics.length; i++) {
		var temp = fLayer.graphics[i].geometry.paths[0];
		if(labelAll) {
			for(var j = 0; j < temp.length - 1; j++) {
				var point1 = temp[j]
				var point2 =  temp[j + 1]
				calculateBearing(point1, point2);
			}
		}
		else {
			var point1 = temp[(temp.length - 2)];
			var point2 =  temp[(temp.length - 1)];
			calculateBearing(point1, point2);
		}
	}
}
```
Calculate the bearing between each pair of points. Convert the bearing so all values are positive (0 - 360)
```javascript
deltaX = (secondPoint.x - firstPoint.x);
deltaY = (secondPoint.y - firstPoint.y);
bearing = (Math.atan2(deltaX, deltaY) * 180 / Math.PI);
if(bearing < 0) {
	bearing = (180 + bearing) + 180;
}
```
Create a new point, symbolize it with a SimpleMarkerSymbol and add the graphic to the graphics layer
```javascript
var point = new Point(point[0], point[1], fLayer.spatialReference);
var symbol = new SimpleMarkerSymbol();
symbol.setPath(iconPath);
symbol.setAngle(bearing - 90);
symbol.setColor(new esri.Color("#000"));
symbol.setSize(20);
var graphic = new Graphic(point, symbol, {"bearing":bearing, "midPoint":midPoint});
gLayer.add(graphic);
```
