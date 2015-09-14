# Creating rectangles from coordinates
This script provides the users with a sample on how to create polygons from coordinates.  The center of the polygon is provided in a list object along with the height and width information ([latitude, longitude, height, width]).  This script is designed as a proof of concept on how to create a polygon with minimal information.  The script can be modified to read from a CSV file or a table in a file geodatabase so the coordinates do not have to be hard coded.

## Use case
* Helicopter pads are located in areas of a city (rooftops, fields, airports, ...)
* We know the coordinates of the center of the helicopter pad and the approximate size of the helicopter pad.
* We have the data in a tabular format (CSV, File geodatabase table, ...)
* We want to automate the process of creating these polygons for a project without having to draw all of the helicopter pads by hand.

## Items to have a conceptual understanding on before running
* [SpatialReference (arcpy)](http://resources.arcgis.com/en/help/main/10.2/index.html#//018z0000000v000000) - Knowing the spatial reference information of the data that you are using is crucial to getting the polygons to show in the correct location.  If this information is not correct, the data will not be displayed correctly.
* [Polygon (arcpy)](http://resources.arcgis.com/en/help/main/10.2/index.html#/Polygon/018z00000061000000/) - The polygon object is constructed and then copied over when we make a call to the copy features method.
* [Array (arcpy)](http://resources.arcgis.com/en/help/main/10.2/index.html#//018z0000006n000000) - We use the array object to construct our polygon geometry object.

## How can I run this?
After downloading the script, load it in the python console in ArcMap to run it.

## Unfamiliar with Python?
* The following is a blog article that documents some ways for you to familiazrize yourself with python -
[Seven easy ways to start learning Python and ArcPy](http://blogs.esri.com/esri/supportcenter/2014/03/26/8-easy-ways-learning-python-arcpy/)
