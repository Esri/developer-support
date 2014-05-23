Remove all basemaps from an MXD (batch)
=========================

## Instructions

1. Set the input path that contains your MXDs
2. This script will go through each MXD and remove any layer with the name "Basemap" in it
3. The output will be the same MXDs without basemaps

## Use Case

If you have MXDs saved with basemaps, but you now have limited/no network connectivity, this is a quick and easy way to remove basemaps that could be causing performance issues. The "*Basemap*" wildcard could also be changed to something like "*Bing*" to remove Bing basemaps. This  would be useful if you have MXDs saved with Bing basemaps, but now do not have a Bing Key.

## Limitations

This tool removes any layer with the string "Basemap" in it, so if you have non-basemap layers in your map with the string "Basemap" in them, they will be removed. Also, basemaps that do not contain the string "Basemap" will not be removed. By default, all online tiled services are put in a basemap layer, so this should not be a common issue for Esri Basemaps.