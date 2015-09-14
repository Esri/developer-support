#ArcGIS API for JavaScript Point Clustering with a FeatureLayer

This is a sample app that modifies the Point Clustering sample to use a featureLayer instead of a JSON request to create dynamically clustering point features.

[ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)



[update-end](https://developers.arcgis.com/javascript/jsapi/featurelayer-amd.html#event-update-end)

[Based off of this sample:](https://developers.arcgis.com/javascript/jssamples/layers_point_clustering.html)


## Features

* The following modifications were made to the app:
* written in AMD
* A feature layer is turned into a JSON object
* Uses the featureLayer update-end event to wait until features and their attributes are loaded 
* Then the JSON object is constructed by creating an array objects containing the attributes and lat, long of all of the features
* The featureLayer is hidden, so that only the custom clusterLayer is shown
* uses version 3.9 of the JS API, but should be able to be upgraded conveniently. 

NOTE: Feel free to update to this repo!
