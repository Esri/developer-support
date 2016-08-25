#Android Location Tracking Sample Mindful of Battery Consumption

This code mixes two important SDKs - ArcGIS Runtime SDK for Android and Geotrigger SDK for Android.  It also shows how to create an Android Java class that extends Service.


## Features

* Shows the build.gradle file when mixing together Geotrigger and Runtime SDKs 
* Code shows how to extend Android Service so that processing gets done in the background even when the app itself (the Activity) has been shutdown (swiped closed) 
* Shows how to use / implement GeotriggerBroadcastReceiver's LocationUpdateListener, specifically in the class that extends Service (MyService.java)
* Code shows how to save location updates to a Feature Service (the ArcGIS Runtime SDK for Android piece)

##Notes

To visualize the location updates that get sent to the Feature Service, create a Map in ArcGIS Online and add the Feature Service as a layer.

##Screen Shot

![alt text](https://raw.githubusercontent.com/Esri/developer-support/gh-pages/repository-images/location-tracking.png "Location tracking w/ Android and Esri")

NOTE: Feel free to update to this repo!



***********update*************