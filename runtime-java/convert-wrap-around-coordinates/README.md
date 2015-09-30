#Convert coordinates to a useable value when the map is in wrap around mode
##About
There are many cases when you may need to get the map coordinates of the location where a user has clicked on the map. Normally you are able to do this without issue. However if the JMap has wrap around mode enabled you may see som e strange behavior. In this mode you are able to pan the map left or right into infinity. As you pan left the x coordinate values increase into infinity and as you pan to the right the x coordinate values decrease into infinity. Converting the click location into map coordinates will result in coordinates that are impossibly large or small and are completely unusable in calculations. This application demonstrates how to convert these unusable values into usable ones.
##Usage Notes
In this sample you are able to click on the map and have the coordinates display in the IDE console in 4326 coordinates. The spatial refernce of JMap is 102100 and I have not tested my logic against other spatial references. Note I developed the logic to convert these coordinates. There may very well be a more efficient way to perform the conversion.
##The Logic
This is part of the application that performs the conversions:
```Java
//Convert the screen coordinates of the click location to a map point
Point point = jMap.toMapPoint(arg0.getX(), arg0.getY());
//Make sure the spatial reference of the map is 102100 (otherwise this won't work)
if(jMap.getSpatialReference().equals(SpatialReference.create(102100))) {
	//Create a multiplier value to use when converting the coordinate. The key is to round the value then cast it as an int
	int multiplier = (int) Math.round((Math.abs(point.getX()) / (coordXMax * 2)));
        //In case the multiplier is 0 (because we cast it to an in) set it to 1
        if(multiplier == 0) multiplier = 1;
        //If the point is larger than the coordinate system's xMax
        if(point.getX() > coordXMax) {
        	//Convert the coordinate
            	point.setX(point.getX() - ((coordXMax * 2) * multiplier));
        }
        //If the point is smaller than the coordinate system's xMin
        else if(point.getX() < coordXMin) {
            	//Convert the coordinate
            	point.setX(point.getX() + ((coordXMax * 2) * multiplier));
        }
}
//Convert the coordinate to lat long (to make it easier to read)
Point newPoint = (Point) GeometryEngine.project(point, jMap.getSpatialReference(), SpatialReference.create(4326));
//Print the coordinate to the console
System.out.println("X: " + String.valueOf(newPoint.getX()) + ", Y: " + String.valueOf(newPoint.getY()));
```