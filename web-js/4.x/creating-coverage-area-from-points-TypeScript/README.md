# Create Coverage Areas from Points

## About
Why would you want to do this? Let's say a farmer has several fields that need to be sprayed with fertilizer. To maximize profits the farmer wants to ensure the entire field is covered with fertilizer and no fertilizer is sprayed outside the field. The farmer would like to determine what percentage of the field is currently being covered and what percentage of fertilizer is being wasted. The spray truck is equipped with GPS tracking software which records it's position and whether the truck was spraying at that point. The width of the truck's booms is also known. Using just this information how can the farmer determine what parts of the fields were covered?

[Live Sample](https://nhaney90.github.io/creating-coverage-area-from-points/index.html)

## Workflow
I solved this problem by creating a polyline from each group of points collected from the same truck while the truck was spraying. The polyline is then buffered by half of the truck's boom width to create a polygon. To determine the area covered outside the field the difference between the coverages and the field polygons are calculated. To determine the area of the field covered, the area covered outside the field is subtracted from the total spray coverage area. This number is then subtracted from the field area to determine the area of field that was not covered.

## Usage Notes
This sample uses the JavaScript 4.4 API and is written using TypeScript. For more information about how to use TypeScript with the 4.x API please [refer to this documentation.](https://developers.arcgis.com/javascript/latest/guide/typescript-setup/index.html)

## How it works
The field polygons and spray points are included in separate JSON files. Each file is retrieved using esriRequest which returns a promise that is then added to an array. Promise.all is used to determine when both promises have been fullfilled.

```javascript
let promises = [esriRequest(
	"app/SprayTruckPoints.json",
    {
		responseType: "json",
		method: "get"
    }
), esriRequest(
 	"app/FieldPolygons.json",
    {
 		responseType: "json",
 		method: "get"
    }
)];
Promise.all(promises).then((results:Array<EsriRequestResponse>) => {
    createCoverages(results[0].data, results[1].data, thisView);
});
```
This function is used to group similar points into polylines that are then buffered based on the spray width of the truck. First the array of points is looped through and each point is checked to see if the truck was spraying at that position. If the truck was spraying, that point is added to a polyline. If the truck stops spraying those points are discarded. When the truck starts spraying again the polyline is buffered and added to an array of buffers. A new polyline is created using the current point as the initial vertex.

```javascript
for(let i = 0; i < points.length; i++) {
	if(!currentWidth && points[i].attributes.Spraying == 1) {
		currentPolyline = new Polyline(points[i].geometry.spatialReference);
		currentPolyline.addPath([[(points[i].geometry as Point).x , (points[i].geometry as Point).y]]);
		currentWidth = points[i].attributes.SprayWidth;
    }
    else if(currentWidth == points[i].attributes.SprayWidth && points[i].attributes.Spraying == 1) {
		currentPolyline.insertPoint(0, currentPolyline.paths[0].length, points[i].geometry as Point);
    }
    else {
		if(currentPolyline) {
			let bufferGraphic = createBufferGraphic(currentPolyline, currentWidth, buffers, bufferSymbol, template);
			buffers.push(bufferGraphic);
			currentWidth = points[i].attributes.SprayWidth;
			currentPolyline = null;
		}
		if(points[i].attributes.Spraying == true) {
			currentPolyline = new Polyline(points[i].geometry.spatialReference);
			currentPolyline.addPath([[(points[i].geometry as Point).x , (points[i].geometry as Point).y]]);
		}
    }
}
```
This function creates a buffer from the polyline the width of the truck's boom. If there are already buffers in the array the code checks to see if the current buffer and the previous buffer overlap. If they do overlap they are unioned into one polygon and the previous buffer is removed.

```javascript
function createBufferGraphic(line:Polyline, width:number, buffers:Array<Graphic>, symbol:SimpleFillSymbol, template:PopupTemplate): Graphic {
	let buffer = geometryEngine.geodesicBuffer(line, (width / 2), "feet");
	if(buffers.length > 0) {
		if(geometryEngine.overlaps(buffer as Polygon, buffers[buffers.length -1].geometry)) {
			buffer = geometryEngine.union([buffer as Polygon,  buffers[buffers.length -1].geometry]) as Polygon;
			buffers.pop();
		}
	}
	let area = geometryEngine.geodesicArea(buffer as Polygon, "acres").toFixed(2);
```

Now we can calculate how much of the field was covered and how much fertilizer was wasted. To do this we loop through the array of coverage buffers. To find the area sprayed outside the field use the difference operation on the buffer geometry with the field geometry as the subtractor. The geodesicArea method is used to calculate how many acres outside the field were sprayed. The area of the field covered can then be calculated by subtracting the difference of the buffered area and the wasted area from the area of the field.

```javascript
function findTotalAreaCovered(fields:GraphicsLayer,buffers:Array<Graphic>) {
	for(let i = 0; i < buffers.length; i++) {
		let field = fields.graphics.shift();
		let wastedAreaGeometry = geometryEngine.difference(buffers[i].geometry, field.geometry);
		field.attributes["wasted"] = geometryEngine.geodesicArea(wastedAreaGeometry as Polygon, "acres").toFixed(2);
		field.attributes["coverage"] = (((buffers[i].attributes.area - field.attributes.wasted)/ field.attributes.area) * 100).toFixed(2);
		field.attributes["missed"] = (field.attributes.area - (buffers[i].attributes.area - field.attributes.wasted)).toFixed(2);
		fields.graphics.push(field);
```