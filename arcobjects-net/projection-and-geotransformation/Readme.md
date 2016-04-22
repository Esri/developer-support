# How to perform a map projection using a geotransformation parameter
This ArcObjects C# code sample shows how to How to perform a map projection using a geotransformation parameter. It projects a feature class from its current projection to GCS_WGS_1984 (EPSG: 4326), and then computes the area of each feature in the feature class using a search cursor to loop through the features.

Author: Sami E.

[Documentation on Spatial References]
(http://resources.arcgis.com/en/help/arcobjects-net/conceptualhelp/index.html#/Working_with_spatial_references/0001000002mq000000/)

## Features
* Uses ISpatialReferenceFactory3
* Uses IGeoTransformation
* Uses ISpatialReference
