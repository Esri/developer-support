Get XY Coordinates in Different Coordinate System
=========================

## Instructions

1. Set the path to the input point feature class, and the WKID for the desired output coordinate system
2. Run the script
3. The output will be the input feature class with an "X" and a "Y" double field containing the coordinates in your specified coordinate system

## Resources
[Projected Coordinate System WKID List](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Projected_coordinate_systems/02r3000000vt000000/)

[Geographic Coordiante System WKID List](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Geographic_coordinate_systems/02r300000105000000/)


## Use Case

If your data are in a local state plane projection, but you want to show the WGS1984 coordinates, you could use this script to get these coordiantes. The data would stay the same, but the table would have the new values.
