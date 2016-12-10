Python Script to upload an updated tile package and update the tile service with new tiles
=========================

## Instructions

1. This script relies on the requests,  and json modules 

2. This script is designed to be run through an IDE

3. An uploaded Tile Package and Tile Service must already be present in ArcGIS Online 

4. This script must be run as the user who owns the Tile Service and Tile Package

5. Input Username, and password for user who owns tilepackage and service

6. Input ArcGIS Online item ID of uploaded tile package

7. Input Service Name of service to have the tiles updated

8. Add the Extent and Levels of the updated tiles to update the service


## Use Case

This is to be used when you have updated data for your tiled service that was published from a tile package. The script updates the tile package item to have the new tile package, and updates the service with the new tiles.

You can download and the following item in ArcGIS Online to get the script with the needed requests library in order to access a ready to use script: https://www.arcgis.com/home/item.html?id=d829e15ca7d840f29b1a1d8d2e8b7ac7