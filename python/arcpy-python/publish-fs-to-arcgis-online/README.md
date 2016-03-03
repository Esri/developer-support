Publish Feature Service to ArcGIS Online
=========================

## Instructions

1. This script processes all file geodatabases in a specified directory
2. For each File Geodatabase it adds layers to an Untitled Document and saves out a new document / mxd
3. Once the ArcMap document is created this script publishes the content as a hosted feature service in ArcGIS Online.
4. ArcMap should be opened and signed into ArcGIS Online while running this script


## Detailed Instructions

At the bottom of this script you will need to change the ```pathLocationContainingEmptyMXD``` variable and point it to an empty untitled document on your machine. Also you will need to change the ```pathLocationWhereGeodatabasesLive``` variable and point it to the directory containing file geodatabases.  Note there is special logic in this script to not add layers to the map document if the layer name ends with a digit.  This is special logic you want to remove.

## Use Case

If you need to publish file geodatabase content to ArcGIS Online this is a helpful script.  The script automate publishing feature services to ArcGIS Online. All you need is a file geodatabase with layers, an empty MXD and ArcPy.


## Limitations

This tool currently only works if you have ArcMap open when running the script.  Also ArcMap needs to be signed into ArcGIS Online.
