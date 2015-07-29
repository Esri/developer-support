Python Script to update a web map (proof of concept)
=========================

## Instructions

1. This script relies on the urllib, urllib2, and json modules

2. This script is designed to be run through an IDE

3. Access the data of your web map as JSON using: 
  ``` 
	 http://www.arcgis.com/sharing/rest/content/items/<web map ID>/data?f=pjson
  ```
  NOTE:  The above link will only work if the web map is public.  If the webmap is not public, a token would need to be appended to the end of the link.  To generate a token, run the script and use ArcGISOnline.generateToken passing in your username and password to the method.  This will allow a token to be generated for consumption in this request.
  ```
	 http://www.arcgis.com/sharing/rest/content/items/<web map ID>/data?f=pjson&token=<INSERT_TOKEN>
  ```

4. The JSON file that was downloaded should be modified.  In order to delete an entire layer from the webmap, the entire dictionary definition for that layer should be removed.

5. Replace the following in the JSON using a text editor(See sample JSON below):

	true > True
	
	false > False
	
	null > None
	
5. On line 96, replace "Replace with JSON, remove the quotes" with your edited JSON

6. Run the script and input your username, password, and web map title



## Use Case

This script is useful for someone who is not familiar with python but needs to update their existing web map, not through the UI of ArcGIS Online. This is a workaround for BUG-000085088 (Provide users with the ability to delete or replace inactive URLs for map services in a Web Map.).

This is often required if a service that was previously accessible has been turned off or removed. If you do not care about maintaining your existing web map ID, simply save a copy of the web map.

NOTE: This script assumes that there is ONLY one web map in your content(all folders) with this title.

While the [ArcGIS Online Assistant](http://ago-assistant.esri.com/) does allow for similar functionality in remapping of URLs, the ArcGIS Online Assistant does not completely remove URLs which is available with this script.

## Sample JSON
```javascript
{
    "applicationProperties": {
        "viewing": {
            "basemapGallery": {
                "enabled": True
            },
            "routing": {
                "enabled": True
            },
            "measure": {
                "enabled": True
            }
        }
    },
    "operationalLayers": [],
    "baseMap": {
        "baseMapLayers": [
			{
                "opacity": 1,
                "url": "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
                "id": "World_Light_Gray_Base_4394",
                "visibility": True,
                "itemId": "ed712cb1db3e4bae9e85329040fb9a49"
            }
        ],
        "title": "Sample Web Map"
    },
    "version": "1.9"
}

```
