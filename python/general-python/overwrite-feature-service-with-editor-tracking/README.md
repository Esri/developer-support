Python Script to overwrite feature service and maintain editor tracking (based on item type)
=========================

## Instructions

1. This script relies on the requests,time and json modules

2. This script is designed to be run through an IDE

3. This script publishes from a filegeodatabase that has already been uploaded to arcgis online. The file geodatabase must belong to the organization of the administrator running the script, or belong to a user without the adminsitrator role.  Also the file geodatabase should be enabled with editor tracking active (turned on).

4. To determine the item id of the navigate to the item and copy the item number from the Url: https://cloudygis.maps.arcgis.com/home/item.html?id=6ce5aae1a98b45a496a2fd8acdf736bb . Item Id = 6ce5aae1a98b45a496a2fd8acdf736bb

5. To overwrite a specific feature service, you must input the feature service name as indicated at the rest endpoint: 
https://services.arcgis.com/6tVsHR2ERRUR1RFd/arcgis/rest/services/2015_Total_Population_NY/FeatureServer/0 Service name = 2015_Total_Population_NY/FeatureServer/0

6. Enter username, Password, Item ID and service name when prompted

#use case

If you want to overwrite a service with data in which editor tracking was already collected, use this tool.

#Additions
You can modify the publish parameters in paramDict further to include more capabilities by referring to the following documentation:
http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Publish_Item/02r300000080000000/

You can download and the following item in ArcGIS Online to get the script with the needed requests library in order to access a ready to use script: https://www.arcgis.com/home/item.html?id=2d7027b148e24005916e55ab2cb74b50
