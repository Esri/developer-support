# Join Data Source Sample by using ArcGIS API for JavaScript 

This is a sample shows how to use Join Data Source ("esri/layers/JoinDataSource") to perform join operation on the fly with a registed workspace ID from another feature class. 

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)
[Search](https://developers.arcgis.com/javascript/jsapi/joindatasource-amd.html)

## Pay Attention when using Join Data Source
The workspace ID is for the registered file geodatabase, SDE or Shapefile workspace. Basically, there are two ways to enable this workspace ID

1) From ArcMap before publishing the services,for more information please take a look about this documentation talks about "Enabling dynamic layers on a map service in ArcGIS for Desktop":

http://desktop.arcgis.com/en/desktop/latest/map/publish-map-services/enabling-dynamic-layers-on-a-map-service-in-arcgis-for-desktop.htm

![Alt text](https://cloud.githubusercontent.com/assets/5265346/8947025/dd9769a6-354a-11e5-8c59-6abc1e1f22c0.png "Add workspace ID from ArcMap")

2) Or you can go to the ArcGIS Server Manager to manually add workspace ID for existing services, please check this documenation as a reference: 

http://desktop.arcgis.com/en/desktop/latest/map/publish-map-services/enabling-dynamic-layers-on-a-map-service-in-manager.htm

![Alt text](https://cloud.githubusercontent.com/assets/5265346/8947024/dd88c6e4-354a-11e5-8e19-101bbab3473a.png "Add workspace ID from ArcGIS Server")

## Features

* Shows how to use "Join Data Source" to dynamically add another feature class and display on the map 

NOTE: Feel free to update to this repo!

**EXPLICIT: The demo server within this sample is not intended for use for anything other than testing!**
[Live Sample](http://esri.github.io/developer-support/web-js/join-data-source/JoinDataSource_Final.html)

